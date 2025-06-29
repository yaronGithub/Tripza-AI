import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { SocialPost, SocialProfile, PostComment, UserFollow } from '../types/social';
import { useAuth } from './useAuth';

export function useSocial() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchSocialFeed();
    }
  }, [user]);

  const fetchSocialFeed = async () => {
    try {
      setLoading(true);
      
      // Fetch posts with user and trip data
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select(`
          *,
          user:profiles(*),
          trip:trips(*),
          post_likes!inner(user_id)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError) throw postsError;

      // Check which posts are liked by current user
      const { data: userLikes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', user?.id);

      // Check which posts are saved by current user
      const { data: userSaved } = await supabase
        .from('saved_posts')
        .select('post_id')
        .eq('user_id', user?.id);

      const likedPostIds = new Set(userLikes?.map(like => like.post_id) || []);
      const savedPostIds = new Set(userSaved?.map(saved => saved.post_id) || []);

      const enrichedPosts = postsData?.map(post => ({
        ...post,
        is_liked: likedPostIds.has(post.id),
        is_saved: savedPostIds.has(post.id)
      })) || [];

      setPosts(enrichedPosts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch social feed');
    } finally {
      setLoading(false);
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.is_liked) {
        // Unlike
        await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Like
        await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: user.id });
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              is_liked: !p.is_liked,
              likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1
            }
          : p
      ));
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const savePost = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.is_saved) {
        // Unsave
        await supabase
          .from('saved_posts')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
      } else {
        // Save
        await supabase
          .from('saved_posts')
          .insert({ post_id: postId, user_id: user.id });
      }

      // Update local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, is_saved: !p.is_saved }
          : p
      ));
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const createPost = async (caption: string, tripId: string | null, photos: string[] = []) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          trip_id: tripId,
          caption,
          photos
        })
        .select(`
          *,
          user:profiles(*),
          trip:trips(*)
        `)
        .single();

      if (error) throw error;

      // Add to local state
      setPosts([{ ...data, is_liked: false, is_saved: false }, ...posts]);
      
      return data;
    } catch (err) {
      console.error('Error creating post:', err);
      throw err;
    }
  };

  const getPostComments = async (postId: string): Promise<PostComment[]> => {
    try {
      const { data, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          user:profiles(*)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching comments:', err);
      return [];
    }
  };

  const addComment = async (postId: string, content: string) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('post_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content
        })
        .select(`
          *,
          user:profiles(*)
        `)
        .single();

      if (error) throw error;

      // Update comments count in local state
      setPosts(posts.map(p => 
        p.id === postId 
          ? { ...p, comments_count: p.comments_count + 1 }
          : p
      ));

      return data;
    } catch (err) {
      console.error('Error adding comment:', err);
      throw err;
    }
  };

  return {
    posts,
    loading,
    error,
    likePost,
    savePost,
    createPost,
    getPostComments,
    addComment,
    refetch: fetchSocialFeed
  };
}

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<SocialProfile | null>(null);
  const [userPosts, setUserPosts] = useState<SocialPost[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (userId) {
      fetchUserProfile();
      fetchUserPosts();
      checkFollowStatus();
    }
  }, [userId, user]);

  const fetchUserProfile = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  const fetchUserPosts = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          user:profiles(*),
          trip:trips(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserPosts(data || []);
    } catch (err) {
      console.error('Error fetching user posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowStatus = async () => {
    if (!user || !userId || user.id === userId) return;

    try {
      const { data, error } = await supabase
        .from('user_follows')
        .select('id')
        .eq('follower_id', user.id)
        .eq('following_id', userId)
        .single();

      setIsFollowing(!!data);
    } catch (err) {
      // Not following
      setIsFollowing(false);
    }
  };

  const toggleFollow = async () => {
    if (!user || !userId || user.id === userId) return;

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('user_follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
      } else {
        // Follow
        await supabase
          .from('user_follows')
          .insert({
            follower_id: user.id,
            following_id: userId
          });
      }

      setIsFollowing(!isFollowing);
      
      // Update follower count in profile
      if (profile) {
        setProfile({
          ...profile,
          followers_count: isFollowing 
            ? profile.followers_count - 1 
            : profile.followers_count + 1
        });
      }
    } catch (err) {
      console.error('Error toggling follow:', err);
    }
  };

  return {
    profile,
    userPosts,
    isFollowing,
    loading,
    toggleFollow
  };
}

export function useTrendingData() {
  const [trendingDestinations, setTrendingDestinations] = useState<any[]>([]);
  const [suggestedUsers, setSuggestedUsers] = useState<SocialProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrendingData();
  }, []);

  const fetchTrendingData = async () => {
    try {
      // Fetch trending destinations based on recent posts
      const { data: destinations } = await supabase
        .from('social_posts')
        .select(`
          trip:trips(destination)
        `)
        .not('trip_id', 'is', null)
        .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      // Count destinations
      const destinationCounts: Record<string, number> = {};
      destinations?.forEach(post => {
        if (post.trip?.destination) {
          destinationCounts[post.trip.destination] = (destinationCounts[post.trip.destination] || 0) + 1;
        }
      });

      const trending = Object.entries(destinationCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([destination, count]) => ({
          name: destination,
          posts: count,
          trend: `+${Math.floor(Math.random() * 20) + 5}%`
        }));

      setTrendingDestinations(trending);

      // Fetch suggested users (users with most followers)
      const { data: users } = await supabase
        .from('profiles')
        .select('*')
        .order('followers_count', { ascending: false })
        .limit(5);

      setSuggestedUsers(users || []);
    } catch (err) {
      console.error('Error fetching trending data:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    trendingDestinations,
    suggestedUsers,
    loading
  };
}
import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, Users, Eye, MoreHorizontal, User, Send, X } from 'lucide-react';
import { useSocial } from '../hooks/useSocial';
import { SocialPost, PostComment } from '../types/social';
import { ImageGallery } from './ImageGallery';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './NotificationToast';
import { LoadingSpinner } from './LoadingSpinner';
import { googleMapsService } from '../services/googleMapsService';
import { imageService } from '../services/imageService';

export function SocialFeed() {
  const { posts, loading, likePost, savePost, getPostComments, addComment } = useSocial();
  const { user } = useAuth();
  const { showInfo, showError } = useToast();
  const [refreshing, setRefreshing] = useState(false);
  const [postImages, setPostImages] = useState<Record<string, string[]>>({});
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, PostComment[]>>({});
  const [loadingComments, setLoadingComments] = useState<Record<string, boolean>>({});
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Simulate a refresh when component mounts
    handleRefresh();
  }, []);

  useEffect(() => {
    // Load images for posts that don't have them
    loadPostImages();
  }, [posts]);

  const loadPostImages = async () => {
    const newPostImages: Record<string, string[]> = { ...postImages };
    let updated = false;

    for (const post of posts) {
      // Skip if post already has photos or if we've already loaded images for it
      if ((post.photos && post.photos.length > 0) || newPostImages[post.id]) {
        continue;
      }

      try {
        // Try to get images for the post based on trip destination
        if (post.trip) {
          const destination = post.trip.destination;
          
          // Try Google Maps first
          if (googleMapsService.isAvailable()) {
            try {
              await googleMapsService.initialize();
              const places = await googleMapsService.searchPlaces(`${destination} landmark`);
              
              if (places && places.length > 0 && places[0].photos && places[0].photos.length > 0) {
                const photos = googleMapsService.getPlacePhotos(places[0], 3);
                if (photos.length > 0) {
                  newPostImages[post.id] = photos;
                  updated = true;
                  continue;
                }
              }
            } catch (error) {
              console.warn('Error loading Google Maps images:', error);
            }
          }
          
          // Try Pexels API
          try {
            const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;
            if (pexelsApiKey) {
              const response = await fetch(
                `https://api.pexels.com/v1/search?query=${encodeURIComponent(destination + ' landmark')}&per_page=3&orientation=landscape`,
                {
                  headers: {
                    'Authorization': pexelsApiKey
                  }
                }
              );
              
              if (response.ok) {
                const data = await response.json();
                if (data.photos && data.photos.length > 0) {
                  const pexelsImages = data.photos.map((photo: any) => photo.src.large);
                  newPostImages[post.id] = pexelsImages;
                  updated = true;
                  continue;
                }
              }
            }
          } catch (pexelsError) {
            console.warn('Pexels API error:', pexelsError);
          }
          
          // Fallback to image service
          try {
            const image = await imageService.getDestinationHeroImage(destination);
            newPostImages[post.id] = [image];
            updated = true;
          } catch (error) {
            console.error('Error loading destination image:', error);
            
            // Use fallback images based on destination
            const destination = post.trip.destination.toLowerCase();
            if (destination.includes('paris')) {
              newPostImages[post.id] = ['https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=800'];
            } else if (destination.includes('tokyo')) {
              newPostImages[post.id] = ['https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800'];
            } else if (destination.includes('new york')) {
              newPostImages[post.id] = ['https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=800'];
            } else {
              newPostImages[post.id] = ['https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800'];
            }
            updated = true;
          }
        }
      } catch (error) {
        console.error('Error loading post images:', error);
      }
    }

    if (updated) {
      setPostImages(newPostImages);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleViewTrip = (tripId: string) => {
    // Navigate to trip view
    const navigateEvent = new CustomEvent('navigateTo', { 
      detail: { page: 'discover' } 
    });
    window.dispatchEvent(navigateEvent);
    
    showInfo('Trip View', 'Viewing shared trip details');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Wait a bit to simulate loading
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getPostPhotos = (post: SocialPost): string[] => {
    if (post.photos && post.photos.length > 0) {
      return post.photos;
    }
    
    if (postImages[post.id]) {
      return postImages[post.id];
    }
    
    return [];
  };

  const toggleComments = async (postId: string) => {
    if (expandedPost === postId) {
      setExpandedPost(null);
      return;
    }
    
    setExpandedPost(postId);
    
    // Load comments if not already loaded
    if (!comments[postId]) {
      setLoadingComments(prev => ({ ...prev, [postId]: true }));
      try {
        const postComments = await getPostComments(postId);
        setComments(prev => ({ ...prev, [postId]: postComments }));
      } catch (error) {
        console.error('Error loading comments:', error);
      } finally {
        setLoadingComments(prev => ({ ...prev, [postId]: false }));
      }
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!user) {
      showInfo('Sign In Required', 'Please sign in to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setSubmittingComment(prev => ({ ...prev, [postId]: true }));
    
    try {
      const comment = await addComment(postId, newComment);
      setComments(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), comment]
      }));
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
      showError('Comment Failed', 'Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(prev => ({ ...prev, [postId]: false }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 animate-pulse">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full mr-3"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/6"></div>
              </div>
            </div>
            <div className="h-64 bg-gray-200 rounded-xl mb-4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (refreshing) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="md" color="blue" text="Refreshing feed..." />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Users className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No posts yet</h3>
        <p className="text-gray-600 mb-6">Be the first to share your travel experiences or follow other travelers to see their posts.</p>
        <button 
          onClick={() => {
            const navigateEvent = new CustomEvent('navigateTo', { 
              detail: { page: 'create' } 
            });
            window.dispatchEvent(navigateEvent);
          }}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Plan Your First Trip
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300">
          {/* Post Header */}
          <div className="p-6 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={post.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || 'User')}&background=6366f1&color=fff`}
                    alt={post.user?.name || 'User'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  {post.user?.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <h3 className="font-bold text-gray-900">{post.user?.name}</h3>
                    {post.user?.verified && (
                      <span className="ml-1 text-blue-500">✓</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>@{post.user?.username || post.user?.name?.toLowerCase().replace(/\s+/g, '') || 'user'}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTimeAgo(post.created_at)}</span>
                    {post.trip && (
                      <>
                        <span className="mx-1">•</span>
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{post.trip.destination}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trip Preview */}
          {post.trip && (
            <div className="px-6 mb-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-1">{post.trip.title || `Trip to ${post.trip.destination}`}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(post.trip.start_date).toLocaleDateString()} - {new Date(post.trip.end_date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      <span>{post.trip.preferences?.length || 0} interests</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleViewTrip(post.trip.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Trip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {getPostPhotos(post).length > 0 && (
            <div className="px-6 mb-4">
              <div className="relative h-80 rounded-xl overflow-hidden">
                {getPostPhotos(post).length === 1 ? (
                  <img
                    src={getPostPhotos(post)[0]}
                    alt="Post photo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {getPostPhotos(post).slice(0, 4).map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Post photo ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800';
                          }}
                        />
                        {index === 3 && getPostPhotos(post).length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">+{getPostPhotos(post).length - 4}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Post Content */}
          <div className="px-6 mb-4">
            <p className="text-gray-800 leading-relaxed">{post.caption}</p>
          </div>

          {/* Engagement Stats */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>{post.likes_count} likes</span>
                <span>{post.comments_count} comments</span>
                <span>{post.shares_count} shares</span>
              </div>
              <span>{formatTimeAgo(post.created_at)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => user ? likePost(post.id) : showInfo('Sign In Required', 'Please sign in to like posts')}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.is_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Like</span>
                </button>
                
                <button 
                  onClick={() => toggleComments(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    expandedPost === post.id ? 'text-blue-500' : 'text-gray-600 hover:text-blue-500'
                  }`}
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Comment</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share</span>
                </button>
              </div>
              
              <button
                onClick={() => user ? savePost(post.id) : showInfo('Sign In Required', 'Please sign in to save posts')}
                className={`p-2 rounded-full transition-colors ${
                  post.is_saved ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.is_saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Comments Section */}
          {expandedPost === post.id && (
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <h4 className="font-medium text-gray-900 mb-4">Comments</h4>
              
              {/* Comments List */}
              <div className="space-y-4 mb-4 max-h-80 overflow-y-auto">
                {loadingComments[post.id] ? (
                  <div className="flex justify-center py-4">
                    <LoadingSpinner size="sm" color="blue" text="Loading comments..." />
                  </div>
                ) : comments[post.id]?.length ? (
                  comments[post.id].map(comment => (
                    <div key={comment.id} className="flex space-x-3">
                      <img
                        src={comment.user?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'User')}&background=6366f1&color=fff`}
                        alt={comment.user?.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-lg shadow-sm">
                          <div className="font-medium text-gray-900 text-sm">{comment.user?.name || 'User'}</div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 ml-2">
                          {formatTimeAgo(comment.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <p>No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>
              
              {/* Add Comment */}
              {user ? (
                <div className="flex items-center space-x-2">
                  <img
                    src={user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.name || 'User')}&background=6366f1&color=fff`}
                    alt={user?.user_metadata?.name || 'User'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full px-4 py-2 pr-10 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && newComment.trim()) {
                          handleAddComment(post.id);
                        }
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newComment.trim() || submittingComment[post.id]}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-600 hover:text-blue-700 disabled:text-gray-400"
                    >
                      {submittingComment[post.id] ? (
                        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Sign in to add a comment</p>
                  <button
                    onClick={() => showInfo('Sign In Required', 'Please sign in to comment on posts')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    Sign In
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
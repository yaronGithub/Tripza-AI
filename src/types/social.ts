export interface SocialProfile {
  id: string;
  email: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  website: string | null;
  verified: boolean;
  followers_count: number;
  following_count: number;
  posts_count: number;
  created_at: string;
  updated_at: string;
}

export interface SocialPost {
  id: string;
  user_id: string;
  trip_id: string | null;
  caption: string;
  photos: string[];
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  updated_at: string;
  // Joined data
  user?: SocialProfile;
  trip?: any;
  is_liked?: boolean;
  is_saved?: boolean;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: SocialProfile;
}

export interface UserFollow {
  id: string;
  follower_id: string;
  following_id: string;
  created_at: string;
}

export interface SavedPost {
  id: string;
  user_id: string;
  post_id: string;
  created_at: string;
}
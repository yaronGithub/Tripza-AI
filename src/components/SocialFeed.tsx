import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, Users, Eye, MoreHorizontal, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Trip } from '../types';
import { ImageGallery } from './ImageGallery';

interface SocialPost {
  id: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    username: string;
    verified?: boolean;
  };
  trip: Trip;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  location: string;
  photos: string[];
}

export function SocialFeed() {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadSocialFeed();
  }, []);

  const loadSocialFeed = async () => {
    // Simulate loading social feed
    setTimeout(() => {
      const mockPosts: SocialPost[] = [
        {
          id: '1',
          user: {
            id: 'user1',
            name: 'Sarah Chen',
            username: 'sarahexplores',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
            verified: true
          },
          trip: {
            id: 'trip1',
            destination: 'Paris, France',
            startDate: '2024-03-15',
            endDate: '2024-03-18',
            preferences: ['Museums & Galleries', 'Art & Culture'],
            itinerary: [],
            isPublic: true,
            userId: 'user1',
            createdAt: '2024-03-10T10:00:00Z',
            updatedAt: '2024-03-10T10:00:00Z',
            title: 'Paris Art & Culture Immersion'
          },
          caption: 'Just finished an incredible 4-day art journey through Paris! The Louvre was absolutely breathtaking, and I discovered some amazing hidden galleries in Montmartre. Who else loves getting lost in art museums? 🎨✨',
          likes: 234,
          comments: 18,
          shares: 12,
          isLiked: false,
          isBookmarked: false,
          createdAt: '2024-03-20T14:30:00Z',
          location: 'Paris, France',
          photos: [
            'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80',
            'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
            'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&q=80'
          ]
        },
        {
          id: '2',
          user: {
            id: 'user2',
            name: 'Mike Rodriguez',
            username: 'mikeadventures',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
          },
          trip: {
            id: 'trip2',
            destination: 'Tokyo, Japan',
            startDate: '2024-03-10',
            endDate: '2024-03-14',
            preferences: ['Restaurants & Foodie Spots', 'Art & Culture'],
            itinerary: [],
            isPublic: true,
            userId: 'user2',
            createdAt: '2024-03-05T08:00:00Z',
            updatedAt: '2024-03-05T08:00:00Z',
            title: 'Tokyo Foodie Adventure'
          },
          caption: 'Tokyo blew my mind! From street food in Shibuya to michelin-starred ramen, every meal was an adventure. The AI trip planner helped me discover places I never would have found. Already planning my next trip! 🍜🇯🇵',
          likes: 189,
          comments: 25,
          shares: 8,
          isLiked: true,
          isBookmarked: true,
          createdAt: '2024-03-18T09:15:00Z',
          location: 'Tokyo, Japan',
          photos: [
            'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
            'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80',
            'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80'
          ]
        },
        {
          id: '3',
          user: {
            id: 'user3',
            name: 'Emma Thompson',
            username: 'emmaroams',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
            verified: true
          },
          trip: {
            id: 'trip3',
            destination: 'San Francisco, CA',
            startDate: '2024-03-12',
            endDate: '2024-03-15',
            preferences: ['Parks & Nature', 'Adventure & Outdoors'],
            itinerary: [],
            isPublic: true,
            userId: 'user3',
            createdAt: '2024-03-07T16:00:00Z',
            updatedAt: '2024-03-07T16:00:00Z',
            title: 'SF Nature & Adventure'
          },
          caption: 'Golden Gate Bridge at sunrise hits different! 🌅 Spent the weekend hiking through SF\'s amazing parks and trails. The route optimization in Tripza AI saved me so much time - I got to see twice as many spots! Nature therapy at its finest 🌲',
          likes: 156,
          comments: 12,
          shares: 6,
          isLiked: false,
          isBookmarked: false,
          createdAt: '2024-03-16T18:45:00Z',
          location: 'San Francisco, CA',
          photos: [
            'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
            'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
            'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80'
          ]
        }
      ];
      setPosts(mockPosts);
      setLoading(false);
    }, 1000);
  };

  const handleLike = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleBookmark = (postId: string) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, isBookmarked: !post.isBookmarked }
        : post
    ));
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
                    src={post.user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user.name)}&background=6366f1&color=fff`}
                    alt={post.user.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
                  />
                  {post.user.verified && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="flex items-center">
                    <h3 className="font-bold text-gray-900">{post.user.name}</h3>
                    {post.user.verified && (
                      <span className="ml-1 text-blue-500">✓</span>
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span>@{post.user.username}</span>
                    <span className="mx-1">•</span>
                    <span>{formatTimeAgo(post.createdAt)}</span>
                    <span className="mx-1">•</span>
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{post.location}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Trip Preview */}
          <div className="px-6 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900 mb-1">{post.trip.title}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(post.trip.startDate).toLocaleDateString()} - {new Date(post.trip.endDate).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <Users className="w-4 h-4 mr-1" />
                    <span>{post.trip.preferences.length} interests</span>
                  </div>
                </div>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  <Eye className="w-4 h-4 inline mr-1" />
                  View Trip
                </button>
              </div>
            </div>
          </div>

          {/* Photo Gallery */}
          <div className="px-6 mb-4">
            <div className="relative h-80 rounded-xl overflow-hidden">
              <ImageGallery
                attractionName={post.trip.destination}
                city={post.trip.destination}
                category={post.trip.preferences[0]}
                className="w-full h-full"
                autoSlide={false}
              />
            </div>
          </div>

          {/* Post Content */}
          <div className="px-6 mb-4">
            <p className="text-gray-800 leading-relaxed">{post.caption}</p>
          </div>

          {/* Engagement Stats */}
          <div className="px-6 py-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center space-x-4">
                <span>{post.likes} likes</span>
                <span>{post.comments} comments</span>
                <span>{post.shares} shares</span>
              </div>
              <span>{formatTimeAgo(post.createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-6">
                <button
                  onClick={() => handleLike(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.isLiked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                  <span className="font-medium">Like</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                  <span className="font-medium">Comment</span>
                </button>
                
                <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                  <Share2 className="w-5 h-5" />
                  <span className="font-medium">Share</span>
                </button>
              </div>
              
              <button
                onClick={() => handleBookmark(post.id)}
                className={`p-2 rounded-full transition-colors ${
                  post.isBookmarked ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.isBookmarked ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
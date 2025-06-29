import React, { useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, MapPin, Calendar, Users, Eye, MoreHorizontal, User } from 'lucide-react';
import { useSocial } from '../hooks/useSocial';
import { SocialPost } from '../types/social';
import { ImageGallery } from './ImageGallery';

export function SocialFeed() {
  const { posts, loading, likePost, savePost } = useSocial();

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
                    <span>@{post.user?.username}</span>
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
                    <h4 className="font-bold text-gray-900 mb-1">{post.trip.title}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(post.trip.start_date).toLocaleDateString()} - {new Date(post.trip.end_date).toLocaleDateString()}</span>
                      <span className="mx-2">•</span>
                      <Users className="w-4 h-4 mr-1" />
                      <span>{post.trip.preferences?.length || 0} interests</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Eye className="w-4 h-4 inline mr-1" />
                    View Trip
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Photo Gallery */}
          {post.photos && post.photos.length > 0 && (
            <div className="px-6 mb-4">
              <div className="relative h-80 rounded-xl overflow-hidden">
                {post.photos.length === 1 ? (
                  <img
                    src={post.photos[0]}
                    alt="Post photo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2 h-full">
                    {post.photos.slice(0, 4).map((photo, index) => (
                      <div key={index} className="relative">
                        <img
                          src={photo}
                          alt={`Post photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {index === 3 && post.photos.length > 4 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="text-white text-xl font-bold">+{post.photos.length - 4}</span>
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
                  onClick={() => likePost(post.id)}
                  className={`flex items-center space-x-2 transition-colors ${
                    post.is_liked ? 'text-red-500' : 'text-gray-600 hover:text-red-500'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${post.is_liked ? 'fill-current' : ''}`} />
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
                onClick={() => savePost(post.id)}
                className={`p-2 rounded-full transition-colors ${
                  post.is_saved ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'
                }`}
              >
                <Bookmark className={`w-5 h-5 ${post.is_saved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
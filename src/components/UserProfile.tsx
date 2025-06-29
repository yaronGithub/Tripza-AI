import React, { useState } from 'react';
import { MapPin, Calendar, Users, Heart, Bookmark, Settings, Edit, Camera, Globe, Star, TrendingUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Trip } from '../types';

interface UserProfileProps {
  userId?: string;
  isOwnProfile?: boolean;
}

export function UserProfile({ userId, isOwnProfile = false }: UserProfileProps) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'trips' | 'liked' | 'saved'>('trips');
  const [isFollowing, setIsFollowing] = useState(false);

  // Mock user data
  const profileUser = {
    id: userId || user?.id || '',
    name: isOwnProfile ? (user?.user_metadata?.name || 'Your Name') : 'Sarah Chen',
    username: isOwnProfile ? 'you' : 'sarahexplores',
    bio: isOwnProfile 
      ? 'Travel enthusiast exploring the world one trip at a time ✈️' 
      : 'Digital nomad • Travel photographer • Coffee addict ☕ Currently exploring Europe 🇪🇺',
    avatar: isOwnProfile 
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.name || 'You')}&background=6366f1&color=fff`
      : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face',
    verified: !isOwnProfile,
    location: isOwnProfile ? 'Your Location' : 'San Francisco, CA',
    joinedDate: '2023-01-15',
    stats: {
      trips: isOwnProfile ? 3 : 24,
      followers: isOwnProfile ? 12 : 1247,
      following: isOwnProfile ? 8 : 892,
      likes: isOwnProfile ? 45 : 3421
    }
  };

  const mockTrips: Trip[] = [
    {
      id: '1',
      title: 'Paris Art & Culture Immersion',
      destination: 'Paris, France',
      startDate: '2024-03-15',
      endDate: '2024-03-18',
      preferences: ['Museums & Galleries', 'Art & Culture'],
      itinerary: [],
      isPublic: true,
      userId: profileUser.id,
      createdAt: '2024-03-10T10:00:00Z',
      updatedAt: '2024-03-10T10:00:00Z'
    },
    {
      id: '2',
      title: 'Tokyo Foodie Adventure',
      destination: 'Tokyo, Japan',
      startDate: '2024-02-10',
      endDate: '2024-02-14',
      preferences: ['Restaurants & Foodie Spots', 'Art & Culture'],
      itinerary: [],
      isPublic: true,
      userId: profileUser.id,
      createdAt: '2024-02-05T08:00:00Z',
      updatedAt: '2024-02-05T08:00:00Z'
    }
  ];

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-8">
        {/* Cover Photo */}
        <div className="h-48 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 relative">
          <div className="absolute inset-0 bg-black/20"></div>
          {isOwnProfile && (
            <button className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
              <Camera className="w-5 h-5 text-white" />
            </button>
          )}
        </div>

        {/* Profile Info */}
        <div className="px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 mb-6">
            <div className="flex items-end">
              <div className="relative">
                <img
                  src={profileUser.avatar}
                  alt={profileUser.name}
                  className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                />
                {profileUser.verified && (
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                    <span className="text-white text-sm">✓</span>
                  </div>
                )}
                {isOwnProfile && (
                  <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow">
                    <Camera className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-3 mt-4 sm:mt-0">
              {isOwnProfile ? (
                <>
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                  <button className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <Settings className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={handleFollow}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      isFollowing
                        ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  <button className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Message
                  </button>
                </>
              )}
            </div>
          </div>

          {/* User Details */}
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
              {profileUser.verified && (
                <span className="ml-2 text-blue-500">✓</span>
              )}
            </div>
            <p className="text-gray-600 mb-1">@{profileUser.username}</p>
            <p className="text-gray-800 mb-4">{profileUser.bio}</p>
            
            <div className="flex items-center text-sm text-gray-600 space-x-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{profileUser.location}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                <span>Joined {formatDate(profileUser.joinedDate)}</span>
              </div>
              <div className="flex items-center">
                <Globe className="w-4 h-4 mr-1" />
                <span>Tripza AI Explorer</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-6 py-4 border-t border-gray-100">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profileUser.stats.trips}</div>
              <div className="text-sm text-gray-600">Trips</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profileUser.stats.followers.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Followers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profileUser.stats.following}</div>
              <div className="text-sm text-gray-600">Following</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{profileUser.stats.likes.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Likes</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Tab Navigation */}
        <div className="border-b border-gray-100">
          <div className="flex">
            <button
              onClick={() => setActiveTab('trips')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'trips'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <MapPin className="w-5 h-5 inline mr-2" />
              Trips ({profileUser.stats.trips})
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'liked'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="w-5 h-5 inline mr-2" />
              Liked
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                activeTab === 'saved'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Bookmark className="w-5 h-5 inline mr-2" />
              Saved
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {activeTab === 'trips' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {mockTrips.map((trip) => (
                <div key={trip.id} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                        {trip.title}
                      </h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{trip.destination}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Heart className="w-4 h-4 mr-1 text-red-500" />
                        <span>{Math.floor(Math.random() * 100) + 20}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                        <span>{Math.floor(Math.random() * 50) + 10}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {trip.preferences.slice(0, 2).map((pref) => (
                      <span key={pref} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                        {pref}
                      </span>
                    ))}
                    {trip.preferences.length > 2 && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">
                        +{trip.preferences.length - 2} more
                      </span>
                    )}
                  </div>

                  <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                    View Trip Details
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'liked' && (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No liked posts yet</h3>
              <p className="text-gray-600">Posts you like will appear here</p>
            </div>
          )}

          {activeTab === 'saved' && (
            <div className="text-center py-12">
              <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">No saved trips yet</h3>
              <p className="text-gray-600">Trips you save will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
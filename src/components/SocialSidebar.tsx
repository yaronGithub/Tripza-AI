import React from 'react';
import { TrendingUp, Users, MapPin, Star, Calendar, Globe } from 'lucide-react';

export function SocialSidebar() {
  const trendingDestinations = [
    { name: 'Paris, France', posts: 1247, trend: '+12%' },
    { name: 'Tokyo, Japan', posts: 892, trend: '+8%' },
    { name: 'New York, USA', posts: 756, trend: '+15%' },
    { name: 'London, UK', posts: 634, trend: '+5%' },
    { name: 'Barcelona, Spain', posts: 523, trend: '+22%' }
  ];

  const suggestedUsers = [
    {
      id: '1',
      name: 'Alex Rivera',
      username: 'alexexplores',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      followers: '2.3K',
      verified: true,
      bio: 'Adventure photographer'
    },
    {
      id: '2',
      name: 'Maya Patel',
      username: 'mayatravels',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      followers: '1.8K',
      verified: false,
      bio: 'Solo travel enthusiast'
    },
    {
      id: '3',
      name: 'David Kim',
      username: 'davidwanders',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      followers: '3.1K',
      verified: true,
      bio: 'Food & culture explorer'
    }
  ];

  const upcomingEvents = [
    {
      id: '1',
      title: 'Virtual Travel Meetup',
      date: '2024-04-15',
      attendees: 234,
      type: 'Online Event'
    },
    {
      id: '2',
      title: 'Photography Workshop',
      date: '2024-04-20',
      attendees: 45,
      type: 'San Francisco'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Trending Destinations */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">Trending Destinations</h3>
        </div>
        <div className="space-y-3">
          {trendingDestinations.map((destination, index) => (
            <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium text-gray-900">{destination.name}</div>
                  <div className="text-sm text-gray-600">{destination.posts} posts</div>
                </div>
              </div>
              <div className="text-sm font-medium text-green-600">{destination.trend}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Users */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Users className="w-5 h-5 text-blue-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">Suggested for You</h3>
        </div>
        <div className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.id} className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {user.verified && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </div>
                <div className="ml-3">
                  <div className="font-medium text-gray-900">{user.name}</div>
                  <div className="text-sm text-gray-600">@{user.username}</div>
                  <div className="text-xs text-gray-500">{user.followers} followers</div>
                </div>
              </div>
              <button className="px-4 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center mb-4">
          <Calendar className="w-5 h-5 text-purple-500 mr-2" />
          <h3 className="text-lg font-bold text-gray-900">Upcoming Events</h3>
        </div>
        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
              <div className="font-medium text-gray-900 mb-1">{event.title}</div>
              <div className="text-sm text-gray-600 mb-2">
                {new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {event.type}
                </div>
                <div className="text-xs text-gray-500 flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {event.attendees} attending
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
        <div className="flex items-center mb-4">
          <Globe className="w-5 h-5 mr-2" />
          <h3 className="text-lg font-bold">Community Stats</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-100">Active Travelers</span>
            <span className="font-bold">12.4K</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-100">Trips Shared Today</span>
            <span className="font-bold">89</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-blue-100">Countries Explored</span>
            <span className="font-bold">156</span>
          </div>
        </div>
      </div>
    </div>
  );
}
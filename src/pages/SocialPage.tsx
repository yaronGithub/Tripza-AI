import React, { useState } from 'react';
import { Plus, Search, Filter, TrendingUp, Users, Globe } from 'lucide-react';
import { SocialFeed } from '../components/SocialFeed';
import { SocialSidebar } from '../components/SocialSidebar';
import { CreatePost } from '../components/CreatePost';
import { UserProfile } from '../components/UserProfile';
import { useAuth } from '../hooks/useAuth';

export function SocialPage() {
  const [activeView, setActiveView] = useState<'feed' | 'profile' | 'explore'>('feed');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Navigation */}
            <div className="flex items-center space-x-8">
              <button
                onClick={() => setActiveView('feed')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'feed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                Feed
              </button>
              <button
                onClick={() => setActiveView('explore')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'explore'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Globe className="w-5 h-5 mr-2" />
                Explore
              </button>
              <button
                onClick={() => setActiveView('profile')}
                className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === 'profile'
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Users className="w-5 h-5 mr-2" />
                Profile
              </button>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search travelers, trips, destinations..."
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
                />
              </div>
              
              <button
                onClick={() => setShowCreatePost(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-4 h-4 mr-2" />
                Share Trip
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeView === 'feed' && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Travel Feed</h1>
                  <p className="text-gray-600">Discover amazing trips from travelers around the world</p>
                </div>
                <SocialFeed />
              </div>
            )}

            {activeView === 'explore' && (
              <div>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore</h1>
                  <p className="text-gray-600">Find inspiration for your next adventure</p>
                </div>
                
                {/* Filter Bar */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                  <div className="flex items-center space-x-4">
                    <Filter className="w-5 h-5 text-gray-400" />
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Destinations</option>
                      <option>Europe</option>
                      <option>Asia</option>
                      <option>North America</option>
                      <option>South America</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>All Trip Types</option>
                      <option>Adventure</option>
                      <option>Culture</option>
                      <option>Food</option>
                      <option>Nature</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>This Week</option>
                      <option>This Month</option>
                      <option>All Time</option>
                    </select>
                  </div>
                </div>
                
                <SocialFeed />
              </div>
            )}

            {activeView === 'profile' && (
              <UserProfile isOwnProfile={true} />
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <SocialSidebar />
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePost && (
        <CreatePost onClose={() => setShowCreatePost(false)} />
      )}
    </div>
  );
}
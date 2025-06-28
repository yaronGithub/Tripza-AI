import React, { useState } from 'react';
import { Map, User, PlusCircle, Heart, LogOut, Compass, Sparkles } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { AuthModal } from './AuthModal';

interface LayoutProps {
  children: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export function Layout({ children, currentPage = 'home', onNavigate }: LayoutProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const { user, signOut } = useAuth();

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    }
  };

  const handleAuthClick = () => {
    if (user) {
      signOut();
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-lg border-b border-blue-100 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity group"
              onClick={() => handleNavigation('home')}
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2 h-2 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                  Tripza AI
                </span>
                <div className="text-xs text-gray-500 font-medium">Smart Travel</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                className={`text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
                  currentPage === 'home' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => handleNavigation('home')}
              >
                Home
              </button>
              <button 
                className={`text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
                  currentPage === 'discover' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => handleNavigation('discover')}
              >
                Discover
              </button>
              <button 
                className={`text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
                  currentPage === 'create' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => handleNavigation('create')}
              >
                Plan Trip
              </button>
              <button 
                className={`text-sm font-semibold transition-all duration-200 px-3 py-2 rounded-lg ${
                  currentPage === 'trips' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
                onClick={() => handleNavigation('trips')}
              >
                My Trips
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button 
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white text-sm font-bold rounded-xl hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                onClick={() => handleNavigation('create')}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                AI Trip Planner
              </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-xs text-gray-500">Premium User</div>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <button 
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    onClick={handleAuthClick}
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  className="p-3 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 border border-gray-200 hover:border-blue-300"
                  onClick={handleAuthClick}
                  title="Sign In"
                >
                  <User className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-blue-100 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-3">
            <div className="flex justify-around">
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-200 ${
                  currentPage === 'home' 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('home')}
              >
                <Heart className="w-5 h-5 mb-1" />
                Home
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-200 ${
                  currentPage === 'discover' 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('discover')}
              >
                <Compass className="w-5 h-5 mb-1" />
                Discover
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-200 ${
                  currentPage === 'create' 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('create')}
              >
                <PlusCircle className="w-5 h-5 mb-1" />
                Plan
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-200 ${
                  currentPage === 'trips' 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('trips')}
              >
                <Map className="w-5 h-5 mb-1" />
                Trips
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-200 ${
                  currentPage === 'profile' 
                    ? 'text-blue-600' 
                    : 'text-gray-600'
                }`}
                onClick={handleAuthClick}
              >
                {user ? <LogOut className="w-5 h-5 mb-1" /> : <User className="w-5 h-5 mb-1" />}
                {user ? 'Sign Out' : 'Sign In'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 rounded-xl flex items-center justify-center">
                  <Map className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold">Tripza AI</span>
              </div>
              <p className="text-gray-300 mb-4 max-w-md">
                The world's most advanced AI-powered trip planning platform. Create perfect itineraries in seconds with real-time data and intelligent optimization.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm">🐦</span>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm">📘</span>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                  <span className="text-sm">📷</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold mb-4">Features</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white transition-colors cursor-pointer">AI Trip Planning</li>
                <li className="hover:text-white transition-colors cursor-pointer">Google Maps Integration</li>
                <li className="hover:text-white transition-colors cursor-pointer">Route Optimization</li>
                <li className="hover:text-white transition-colors cursor-pointer">Real-time Directions</li>
                <li className="hover:text-white transition-colors cursor-pointer">Global Coverage</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-gray-300">
                <li className="hover:text-white transition-colors cursor-pointer">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer">Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Tripza AI. All rights reserved. Powered by AI.
            </div>
            <div className="text-gray-400 text-sm">
              Made with ❤️ for travelers worldwide
            </div>
          </div>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
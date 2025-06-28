import React, { useState } from 'react';
import { Map, User, PlusCircle, Heart, LogOut, Compass } from 'lucide-react';
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
      <header className="bg-white/80 backdrop-blur-sm border-b border-blue-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => handleNavigation('home')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Map className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                TripCraft
              </span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'home' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => handleNavigation('home')}
              >
                Home
              </button>
              <button 
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'discover' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => handleNavigation('discover')}
              >
                Discover
              </button>
              <button 
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'create' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => handleNavigation('create')}
              >
                Plan Trip
              </button>
              <button 
                className={`text-sm font-medium transition-colors ${
                  currentPage === 'trips' 
                    ? 'text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600'
                }`}
                onClick={() => handleNavigation('trips')}
              >
                My Trips
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button 
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl"
                onClick={() => handleNavigation('create')}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                New Trip
              </button>
              
              {user ? (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 hidden sm:block">
                    Welcome, {user.user_metadata?.name || user.email}
                  </span>
                  <button 
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    onClick={handleAuthClick}
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
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
        <div className="md:hidden border-t border-blue-100">
          <div className="px-4 py-2">
            <div className="flex justify-around">
              <button 
                className={`flex flex-col items-center py-2 text-xs ${
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
                className={`flex flex-col items-center py-2 text-xs ${
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
                className={`flex flex-col items-center py-2 text-xs ${
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
                className={`flex flex-col items-center py-2 text-xs ${
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
                className={`flex flex-col items-center py-2 text-xs ${
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
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-orange-500 rounded-lg flex items-center justify-center">
                <Map className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-600">
                Built for travelers, by travelers
              </span>
            </div>
            <div className="text-sm text-gray-500">
              © 2025 TripCraft. Making travel planning delightful.
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
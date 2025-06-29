import React, { useState } from 'react';
import { Map, User, PlusCircle, Heart, LogOut, Compass, Sparkles, Zap, Users, TrendingUp } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="particles">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="glass sticky top-0 z-50 border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div 
              className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all duration-300 group"
              onClick={() => handleNavigation('home')}
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 pulse-glow">
                  <Map className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center animate-pulse">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
              </div>
              <div>
                <span className="text-2xl font-bold gradient-text neon-glow">
                  Tripza AI
                </span>
                <div className="text-xs text-purple-600 font-semibold">Smart Travel Social</div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <button 
                className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover-lift ${
                  currentPage === 'home' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-white/50'
                }`}
                onClick={() => handleNavigation('home')}
              >
                Home
              </button>
              <button 
                className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover-lift ${
                  currentPage === 'social' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-white/50'
                }`}
                onClick={() => handleNavigation('social')}
              >
                <TrendingUp className="w-4 h-4 inline mr-2" />
                Social Feed
              </button>
              <button 
                className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover-lift ${
                  currentPage === 'discover' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-white/50'
                }`}
                onClick={() => handleNavigation('discover')}
              >
                Discover
              </button>
              <button 
                className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover-lift ${
                  currentPage === 'create' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-white/50'
                }`}
                onClick={() => handleNavigation('create')}
              >
                Plan Trip
              </button>
              <button 
                className={`text-sm font-semibold transition-all duration-300 px-4 py-2 rounded-xl hover-lift ${
                  currentPage === 'trips' 
                    ? 'text-white bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                    : 'text-gray-700 hover:text-purple-600 hover:bg-white/50'
                }`}
                onClick={() => handleNavigation('trips')}
              >
                My Trips
              </button>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              <button 
                className="btn-premium inline-flex items-center px-6 py-3 text-white text-sm font-bold rounded-2xl hover-lift shimmer"
                onClick={() => handleNavigation('create')}
              >
                <Zap className="w-4 h-4 mr-2" />
                AI Trip Planner
              </button>
              
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="hidden sm:block text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      {user.user_metadata?.name || user.email?.split('@')[0]}
                    </div>
                    <div className="text-xs text-purple-600 font-medium">Travel Explorer</div>
                  </div>
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm shadow-lg hover-lift">
                      {(user.user_metadata?.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
                  </div>
                  <button 
                    className="p-3 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 hover-lift"
                    onClick={handleAuthClick}
                    title="Sign Out"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <button 
                  className="p-3 text-gray-600 hover:text-purple-600 hover:bg-white/50 rounded-2xl transition-all duration-300 hover-lift glass"
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
        <div className="md:hidden border-t border-white/20 glass-dark">
          <div className="px-4 py-3">
            <div className="flex justify-around">
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-300 ${
                  currentPage === 'home' 
                    ? 'text-purple-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('home')}
              >
                <Heart className="w-5 h-5 mb-1" />
                Home
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-300 ${
                  currentPage === 'social' 
                    ? 'text-purple-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('social')}
              >
                <Users className="w-5 h-5 mb-1" />
                Social
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-300 ${
                  currentPage === 'discover' 
                    ? 'text-purple-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('discover')}
              >
                <Compass className="w-5 h-5 mb-1" />
                Discover
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-300 ${
                  currentPage === 'create' 
                    ? 'text-purple-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('create')}
              >
                <PlusCircle className="w-5 h-5 mb-1" />
                Plan
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-300 ${
                  currentPage === 'trips' 
                    ? 'text-purple-600' 
                    : 'text-gray-600'
                }`}
                onClick={() => handleNavigation('trips')}
              >
                <Map className="w-5 h-5 mb-1" />
                Trips
              </button>
              <button 
                className={`flex flex-col items-center py-2 text-xs font-medium transition-all duration-300 ${
                  currentPage === 'profile' 
                    ? 'text-purple-600' 
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
      <footer className="bg-gradient-to-r from-gray-900 via-purple-900 to-blue-900 text-white mt-20 relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl float"></div>
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-500/20 rounded-full blur-xl float-reverse"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center pulse-glow">
                  <Map className="w-7 h-7 text-white" />
                </div>
                <span className="text-3xl font-bold gradient-text-tertiary">Tripza AI</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                The world's first AI-powered social travel platform. Plan perfect trips, share amazing experiences, and connect with fellow travelers worldwide.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                  <span className="text-lg">🐦</span>
                </div>
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                  <span className="text-lg">📘</span>
                </div>
                <div className="w-10 h-10 glass rounded-xl flex items-center justify-center hover-lift cursor-pointer">
                  <span className="text-lg">📷</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-bold mb-4 gradient-text-secondary">Features</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">AI Trip Planning</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Social Travel Feed</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Google Maps Integration</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Trip Sharing</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Travel Community</li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-lg font-bold mb-4 gradient-text-secondary">Company</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">About Us</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Privacy Policy</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Terms of Service</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Contact</li>
                <li className="hover:text-white transition-colors cursor-pointer hover-lift">Support</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 Tripza AI. All rights reserved. Powered by AI & Community.
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
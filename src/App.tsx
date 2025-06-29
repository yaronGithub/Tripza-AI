import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { CreateTripPage } from './pages/CreateTripPage';
import { TripsPage } from './pages/TripsPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useAuth } from './hooks/useAuth';
import { useSubscription } from './hooks/useSubscription';
import { useToast } from './components/NotificationToast';

type Page = 'home' | 'create' | 'trips' | 'discover' | 'profile';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { loading: authLoading, user } = useAuth();
  const { initializeRevenueCat } = useSubscription();
  const { ToastContainer } = useToast();

  // Initialize RevenueCat when user changes
  useEffect(() => {
    if (!authLoading) {
      initializeRevenueCat();
    }
  }, [authLoading, user, initializeRevenueCat]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const renderCurrentPage = () => {
    if (authLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Tripza AI...</p>
          </div>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <HomePage onNavigateToCreate={() => setCurrentPage('create')} />;
      case 'create':
        return <CreateTripPage />;
      case 'trips':
        return <TripsPage />;
      case 'discover':
        return <DiscoverPage />;
      case 'profile':
        return (
          <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">User Profile</h1>
              <p className="text-gray-600">Profile management coming soon</p>
            </div>
          </div>
        );
      default:
        return <HomePage onNavigateToCreate={() => setCurrentPage('create')} />;
    }
  };

  return (
    <ErrorBoundary>
      <Layout currentPage={currentPage} onNavigate={handleNavigate}>
        {renderCurrentPage()}
      </Layout>
      <ToastContainer />
    </ErrorBoundary>
  );
}

export default App;
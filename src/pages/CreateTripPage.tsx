import React, { useState } from 'react';
import { TripPlanningForm } from '../components/TripPlanningForm';
import { ItineraryDisplay } from '../components/ItineraryDisplay';
import { AuthModal } from '../components/AuthModal';
import { TripFormData, Trip } from '../types';
import { generateItinerary } from '../utils/itinerary';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { useAttractions } from '../hooks/useAttractions';
import { useToast } from '../components/NotificationToast';

export function CreateTripPage() {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [saveLoading, setSaveLoading] = useState(false);

  const { user } = useAuth();
  const { saveTrip } = useTrips(user?.id);
  const { searchAttractions } = useAttractions();
  const { showSuccess, showError, showInfo } = useToast();

  const handleFormSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    
    try {
      showInfo('Searching Attractions', `Finding the best attractions in ${formData.destination}...`);
      
      // Get attractions from multiple sources (database + external APIs)
      const availableAttractions = await searchAttractions(formData.destination, formData.preferences);
      
      if (availableAttractions.length === 0) {
        showError('No Attractions Found', `We couldn't find attractions for ${formData.destination}. Please try a different destination.`);
        return;
      }

      const daysCount = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24)) + 1;
      showInfo('Generating Itinerary', `Creating your optimized ${daysCount}-day itinerary with ${availableAttractions.length} attractions...`);
      
      // Generate itinerary (now synchronous)
      const itinerary = generateItinerary(formData, availableAttractions);
      
      if (itinerary.length === 0) {
        showError('Generation Failed', 'Failed to generate itinerary. Please try different dates or preferences.');
        return;
      }

      const newTrip: Trip = {
        id: Date.now().toString(),
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        preferences: formData.preferences,
        itinerary,
        isPublic: false,
        userId: user?.id || 'anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: `Trip to ${formData.destination}`
      };

      setCurrentTrip(newTrip);
      
      const totalAttractions = itinerary.reduce((sum, day) => sum + day.attractions.length, 0);
      showSuccess(
        'Itinerary Generated!', 
        `Your ${itinerary.length}-day trip with ${totalAttractions} attractions is ready to explore.`
      );
    } catch (error) {
      console.error('Error generating itinerary:', error);
      showError('Generation Failed', 'Failed to generate itinerary. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!currentTrip) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSaveLoading(true);
    try {
      await saveTrip(currentTrip);
      showSuccess('Trip Saved!', 'Your trip has been saved to your account.');
    } catch (error) {
      console.error('Error saving trip:', error);
      showError('Save Failed', 'Failed to save trip. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditTrip = () => {
    setCurrentTrip(null);
  };

  const handleTripUpdate = (updatedTrip: Trip) => {
    setCurrentTrip(updatedTrip);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {currentTrip ? (
        <ItineraryDisplay
          trip={currentTrip}
          onEdit={handleEditTrip}
          onSave={handleSaveTrip}
          saveLoading={saveLoading}
          onTripUpdate={handleTripUpdate}
        />
      ) : (
        <div>
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Plan Your Next Adventure
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us about your dream destination and we'll create a personalized itinerary with optimized routes and handpicked attractions from around the world.
            </p>
          </div>

          <TripPlanningForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {/* Benefits Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
                <p className="text-gray-600 text-sm">
                  Plan trips to any destination worldwide with real-time attraction data
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Routing</h3>
                <p className="text-gray-600 text-sm">
                  Advanced algorithms minimize travel time and maximize exploration
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Results</h3>
                <p className="text-gray-600 text-sm">
                  Get your complete itinerary in seconds, not hours of research
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}
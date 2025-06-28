import React, { useState } from 'react';
import { TripPlanningForm } from '../components/TripPlanningForm';
import { EnhancedItineraryDisplay } from '../components/EnhancedItineraryDisplay';
import { AuthModal } from '../components/AuthModal';
import { TripFormData, Trip } from '../types';
import { generateItinerary } from '../utils/itinerary';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { useAttractions } from '../hooks/useAttractions';
import { useToast } from '../components/NotificationToast';
import { openaiService } from '../services/openaiService';

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
      showInfo('AI Planning Started', `Creating your personalized ${formData.destination} experience...`);
      
      // Calculate trip duration
      const daysCount = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24)) + 1;
      
      // Generate AI-enhanced trip title and description
      const [tripTitle, tripDescription, availableAttractions] = await Promise.all([
        openaiService.optimizeTripTitle(formData.destination, formData.preferences, daysCount),
        openaiService.generateTripDescription(formData.destination, formData.preferences, daysCount),
        searchAttractions(formData.destination, formData.preferences)
      ]);
      
      if (availableAttractions.length === 0) {
        showError('No Attractions Found', `We couldn't find attractions for ${formData.destination}. Please try a different destination.`);
        return;
      }

      showInfo('Optimizing Route', `Using AI to create the perfect ${daysCount}-day itinerary with ${availableAttractions.length} attractions...`);
      
      // Generate optimized itinerary
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
        title: tripTitle,
        description: tripDescription
      };

      setCurrentTrip(newTrip);
      
      const totalAttractions = itinerary.reduce((sum, day) => sum + day.attractions.length, 0);
      showSuccess(
        'AI Trip Generated!', 
        `Your personalized ${itinerary.length}-day adventure with ${totalAttractions} attractions is ready!`
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
      showSuccess('Trip Saved!', 'Your AI-generated trip has been saved to your account.');
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
        <EnhancedItineraryDisplay
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
              AI-Powered Trip Planning
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of travel planning. Our AI creates personalized itineraries with Google Maps integration, 
              real-time optimization, and intelligent recommendations tailored to your interests.
            </p>
          </div>

          <TripPlanningForm onSubmit={handleFormSubmit} isLoading={isLoading} />
          
          {/* Enhanced Benefits Section */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Enhanced Planning</h3>
                <p className="text-gray-600 text-sm">
                  Advanced AI creates personalized descriptions and optimizes your entire journey
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Maps Integration</h3>
                <p className="text-gray-600 text-sm">
                  Real-time directions, traffic data, and street view for professional navigation
                </p>
              </div>
              
              <div className="p-6">
                <div className="w-12 h-12 mx-auto mb-4 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
                <p className="text-gray-600 text-sm">
                  Plan trips to any destination worldwide with real attraction data and local insights
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
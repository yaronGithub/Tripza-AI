import React, { useState } from 'react';
import { Calendar, MapPin, Users, Globe, Lock, Trash2, Eye, X, MessageCircle, Share2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types';
import { ItineraryDisplay } from '../components/ItineraryDisplay';
import { AITravelCompanion } from '../components/AITravelCompanion';
import { useToast } from '../components/NotificationToast';
import { CreatePost } from '../components/CreatePost';

export function TripsPage() {
  const { user } = useAuth();
  const { trips, loading, error, deleteTrip, updateTripPublicStatus } = useTrips(user?.id);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showCompanion, setShowCompanion] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const { showSuccess, showError } = useToast();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleBackToList = () => {
    setSelectedTrip(null);
  };

  const handleNavigateToCreate = () => {
    // Use window.dispatchEvent to trigger a custom event
    const navigateEvent = new CustomEvent('navigateTo', { 
      detail: { page: 'create' } 
    });
    window.dispatchEvent(navigateEvent);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
        showSuccess('Trip Deleted', 'Your trip has been successfully deleted');
      } catch (error) {
        showError('Delete Failed', 'Failed to delete trip. Please try again.');
      }
    }
  };

  const handleTogglePublic = async (trip: Trip) => {
    try {
      await updateTripPublicStatus(trip.id, !trip.isPublic);
      showSuccess(
        trip.isPublic ? 'Trip Made Private' : 'Trip Made Public', 
        trip.isPublic 
          ? 'Your trip is now private and won\'t appear in Discover' 
          : 'Your trip is now public and will appear in Discover'
      );
    } catch (error) {
      showError('Update Failed', 'Failed to update trip visibility. Please try again.');
    }
  };

  const handleShareTrip = (trip: Trip) => {
    // If trip is not public, make it public first
    if (!trip.isPublic) {
      updateTripPublicStatus(trip.id, true)
        .then(() => {
          setSelectedTrip({...trip, isPublic: true});
          setShowShareModal(true);
        })
        .catch(error => {
          showError('Update Failed', 'Failed to make trip public. Please try again.');
        });
    } else {
      setShowShareModal(true);
    }
  };

  const toggleCompanion = () => {
    setShowCompanion(!showCompanion);
  };

  if (!user) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Sign In Required</h1>
          <p className="text-gray-600 mb-8">Please sign in to view your saved trips</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your trips...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Error</h1>
          <p className="text-red-600 mb-8">{error}</p>
        </div>
      </div>
    );
  }

  // If a trip is selected, show the detailed view
  if (selectedTrip) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-6">
          <button
            onClick={handleBackToList}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            Back to My Trips
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ItineraryDisplay 
              trip={selectedTrip} 
              onSave={() => handleShareTrip(selectedTrip)}
            />
          </div>
          
          <div className="lg:col-span-1">
            <AITravelCompanion trip={selectedTrip} className="sticky top-8" />
          </div>
        </div>

        {/* Share Modal */}
        {showShareModal && (
          <CreatePost 
            onClose={() => setShowShareModal(false)} 
            selectedTrip={selectedTrip}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">My Trips</h1>
            <p className="text-xl text-gray-600">
              Your saved travel adventures and itineraries
            </p>
          </div>
          
          <button
            onClick={toggleCompanion}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors flex items-center"
          >
            <MessageCircle className="w-5 h-5 mr-2" />
            AI Travel Assistant
          </button>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trips Grid */}
          <div className={`${showCompanion ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {trips.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">No trips yet</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Start planning your first adventure! Create a personalized itinerary in just a few minutes.
                </p>
                <button 
                  onClick={handleNavigateToCreate}
                  className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all duration-200"
                >
                  Plan Your First Trip
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {trips.map((trip) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onDelete={() => handleDeleteTrip(trip.id)}
                    onView={() => handleViewTrip(trip)}
                    onTogglePublic={() => handleTogglePublic(trip)}
                    onShare={() => handleShareTrip(trip)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* AI Companion */}
          {showCompanion && (
            <div className="lg:col-span-1">
              <AITravelCompanion className="sticky top-8" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface TripCardProps {
  trip: Trip;
  onDelete: () => void;
  onView: () => void;
  onTogglePublic: () => void;
  onShare: () => void;
}

function TripCard({ trip, onDelete, onView, onTogglePublic, onShare }: TripCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalAttractions = trip.itinerary.reduce((sum, day) => sum + day.attractions.length, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 group">
      {/* Trip Image/Header */}
      <div className="h-48 bg-gradient-to-br from-blue-500 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-bold text-white mb-1 truncate">
            {trip.title || `Trip to ${trip.destination}`}
          </h3>
          <p className="text-blue-100 flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            {trip.destination}
          </p>
        </div>
        
        {/* Privacy indicator */}
        <div className="absolute top-4 right-4">
          {trip.isPublic ? (
            <div className="bg-green-500/90 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Globe className="w-3 h-3 mr-1" />
              Public
            </div>
          ) : (
            <div className="bg-gray-500/90 text-white px-2 py-1 rounded-full text-xs flex items-center">
              <Lock className="w-3 h-3 mr-1" />
              Private
            </div>
          )}
        </div>
      </div>

      {/* Trip Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </div>
          <div className="text-sm text-gray-500">
            {trip.itinerary.length} days
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{totalAttractions}</div>
            <div className="text-xs text-gray-600">Attractions</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-500">{trip.preferences.length}</div>
            <div className="text-xs text-gray-600">Interests</div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {trip.preferences.slice(0, 3).map((pref) => (
              <span
                key={pref}
                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
              >
                {pref}
              </span>
            ))}
            {trip.preferences.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                +{trip.preferences.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-2">
            <button 
              onClick={onView}
              className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </button>
            <button
              onClick={onTogglePublic}
              className="flex items-center text-gray-600 hover:text-gray-700 text-sm font-medium"
            >
              {trip.isPublic ? (
                <>
                  <Lock className="w-4 h-4 mr-1" />
                  Make Private
                </>
              ) : (
                <>
                  <Globe className="w-4 h-4 mr-1" />
                  Make Public
                </>
              )}
            </button>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onShare}
              className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
            >
              <Share2 className="w-4 h-4 mr-1" />
              Share
            </button>
            <button
              onClick={onDelete}
              className="flex items-center text-red-600 hover:text-red-700 text-sm font-medium"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { Calendar, MapPin, Users, Globe, Lock, Trash2, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types';

export function TripsPage() {
  const { user } = useAuth();
  const { trips, loading, error, deleteTrip } = useTrips(user?.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (window.confirm('Are you sure you want to delete this trip?')) {
      try {
        await deleteTrip(tripId);
      } catch (error) {
        alert('Failed to delete trip. Please try again.');
      }
    }
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

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Trips</h1>
          <p className="text-xl text-gray-600">
            Your saved travel adventures and itineraries
          </p>
        </div>

        {trips.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-100 to-orange-100 rounded-full flex items-center justify-center">
              <MapPin className="w-12 h-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No trips yet</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Start planning your first adventure! Create a personalized itinerary in just a few minutes.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-orange-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-orange-600 transition-all duration-200">
              Plan Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                onDelete={() => handleDeleteTrip(trip.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface TripCardProps {
  trip: Trip;
  onDelete: () => void;
}

function TripCard({ trip, onDelete }: TripCardProps) {
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
          <button className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium">
            <Eye className="w-4 h-4 mr-1" />
            View Details
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
  );
}
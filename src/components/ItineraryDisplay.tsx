import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Navigation, Edit, Eye, Share2, Route } from 'lucide-react';
import { Trip } from '../types';
import { MapView } from './MapView';
import { TripEditor } from './TripEditor';
import { RouteOptimizer } from './RouteOptimizer';

interface ItineraryDisplayProps {
  trip: Trip;
  onEdit?: () => void;
  onSave?: () => void;
  saveLoading?: boolean;
  onTripUpdate?: (updatedTrip: Trip) => void;
}

export function ItineraryDisplay({ trip, onEdit, onSave, saveLoading = false, onTripUpdate }: ItineraryDisplayProps) {
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'map' | 'optimize'>('view');
  const [selectedMapDay, setSelectedMapDay] = useState(0);
  const [currentTrip, setCurrentTrip] = useState(trip);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const handleTripUpdate = (updatedTrip: Trip) => {
    setCurrentTrip(updatedTrip);
    onTripUpdate?.(updatedTrip);
  };

  const handleSaveFromEditor = () => {
    setViewMode('view');
    onSave?.();
  };

  const handleRouteOptimization = (dayIndex: number, optimizedAttractions: any[]) => {
    const updatedTrip = { ...currentTrip };
    updatedTrip.itinerary[dayIndex].attractions = optimizedAttractions;
    
    // Recalculate day totals
    const dayPlan = updatedTrip.itinerary[dayIndex];
    const attractionTime = dayPlan.attractions.reduce((sum, attr) => sum + attr.estimatedDuration, 0);
    const travelTime = dayPlan.attractions.length > 1 ? (dayPlan.attractions.length - 1) * 15 : 0;
    dayPlan.totalDuration = attractionTime + travelTime;
    dayPlan.estimatedTravelTime = travelTime;
    
    handleTripUpdate(updatedTrip);
  };

  if (viewMode === 'edit') {
    return (
      <TripEditor
        trip={currentTrip}
        onTripUpdate={handleTripUpdate}
        onSave={handleSaveFromEditor}
        onCancel={() => setViewMode('view')}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Trip to {currentTrip.destination}
              </h1>
              <p className="text-blue-100 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(currentTrip.startDate)} - {formatDate(currentTrip.endDate)}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setViewMode('edit')}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Trip
              </button>
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saveLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4 mr-2" />
                      Save Trip
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trip Summary */}
        <div className="px-8 py-6 bg-gray-50 border-b">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{currentTrip.itinerary.length}</div>
              <div className="text-sm text-gray-600">Days</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-orange-500">
                {currentTrip.itinerary.reduce((sum, day) => sum + day.attractions.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Attractions</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {currentTrip.preferences.length}
              </div>
              <div className="text-sm text-gray-600">Interests</div>
            </div>
          </div>
        </div>

        {/* View Toggle */}
        <div className="px-8 py-4 border-b">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('view')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'view'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Itinerary
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <MapPin className="w-4 h-4 inline mr-2" />
              Interactive Map
            </button>
            <button
              onClick={() => setViewMode('optimize')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'optimize'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Route className="w-4 h-4 inline mr-2" />
              Route Optimizer
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="px-8 py-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Your Interests:</h3>
          <div className="flex flex-wrap gap-2">
            {currentTrip.preferences.map((pref) => (
              <span
                key={pref}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {pref}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'map' ? (
        <MapView
          dayPlans={currentTrip.itinerary}
          selectedDay={selectedMapDay}
          onDaySelect={setSelectedMapDay}
        />
      ) : viewMode === 'optimize' ? (
        <div className="space-y-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Route Optimization</h2>
            <p className="text-gray-600">Optimize each day's route to minimize travel time and maximize exploration</p>
          </div>
          
          {currentTrip.itinerary.map((day, dayIndex) => (
            <div key={day.date} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 px-6 py-4 border-b">
                <h3 className="text-lg font-bold text-gray-800">
                  Day {dayIndex + 1} - {formatDate(day.date)}
                </h3>
                <p className="text-sm text-gray-600">
                  {day.attractions.length} attractions • {formatDuration(day.totalDuration)} total time
                </p>
              </div>
              <div className="p-6">
                <RouteOptimizer
                  attractions={day.attractions}
                  onOptimize={(optimized) => handleRouteOptimization(dayIndex, optimized)}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Daily Itinerary */
        <div className="space-y-6">
          {currentTrip.itinerary.map((day, dayIndex) => (
            <div key={day.date} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    Day {dayIndex + 1} - {formatDate(day.date)}
                  </h2>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(day.totalDuration)}
                    </div>
                    <div className="flex items-center">
                      <Navigation className="w-4 h-4 mr-1" />
                      {formatDuration(day.estimatedTravelTime)} travel
                    </div>
                    <button
                      onClick={() => {
                        setSelectedMapDay(dayIndex);
                        setViewMode('map');
                      }}
                      className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                    >
                      <MapPin className="w-4 h-4 mr-1" />
                      View on Map
                    </button>
                  </div>
                </div>
              </div>

              {/* Attractions */}
              <div className="p-6">
                {day.attractions.length > 0 ? (
                  <div className="space-y-4">
                    {day.attractions.map((attraction, index) => (
                      <div
                        key={attraction.id}
                        className="flex items-start space-x-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        {/* Attraction Image */}
                        <div className="flex-shrink-0">
                          {attraction.imageUrl ? (
                            <img
                              src={attraction.imageUrl}
                              alt={attraction.name}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-orange-400 rounded-lg flex items-center justify-center">
                              <MapPin className="w-8 h-8 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Attraction Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                {attraction.name}
                              </h3>
                              <p className="text-sm text-gray-600 mb-2">
                                {attraction.description}
                              </p>
                              <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {formatDuration(attraction.estimatedDuration)}
                                </span>
                                <span className="flex items-center">
                                  <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                  {attraction.rating}
                                </span>
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                                  {attraction.type}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-gray-900">
                                Stop {index + 1}
                              </div>
                              {index < day.attractions.length - 1 && (
                                <div className="text-xs text-gray-500 mt-1">
                                  {formatDuration(
                                    Math.round(
                                      Math.sqrt(
                                        Math.pow(day.attractions[index + 1].latitude - attraction.latitude, 2) +
                                        Math.pow(day.attractions[index + 1].longitude - attraction.longitude, 2)
                                      ) * 111 * 3 // Rough travel time calculation
                                    )
                                  )} to next
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>No attractions planned for this day</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
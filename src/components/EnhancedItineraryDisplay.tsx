import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Navigation, Edit, Eye, Share2, Route, Brain, TrendingUp, Lightbulb, Cloud } from 'lucide-react';
import { Trip } from '../types';
import { MapView } from './MapView';
import { TripEditor } from './TripEditor';
import { RouteOptimizer } from './RouteOptimizer';
import { DestinationHero } from './DestinationHero';
import { AttractionCard } from './AttractionCard';
import { AIInsights } from './AIInsights';
import { TripStats } from './TripStats';
import { WeatherWidget } from './WeatherWidget';
import { TravelTips } from './TravelTips';

interface EnhancedItineraryDisplayProps {
  trip: Trip;
  onEdit?: () => void;
  onSave?: () => void;
  saveLoading?: boolean;
  onTripUpdate?: (updatedTrip: Trip) => void;
}

export function EnhancedItineraryDisplay({ trip, onEdit, onSave, saveLoading = false, onTripUpdate }: EnhancedItineraryDisplayProps) {
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'map' | 'optimize' | 'insights'>('view');
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

  const tripDates = currentTrip.itinerary.map(day => day.date);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <DestinationHero
        destination={currentTrip.destination}
        startDate={currentTrip.startDate}
        endDate={currentTrip.endDate}
        preferences={currentTrip.preferences}
        className="h-80 mb-8"
      />

      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentTrip.title || `Trip to ${currentTrip.destination}`}
              </h1>
              {currentTrip.description && (
                <p className="text-gray-600 max-w-2xl">
                  {currentTrip.description}
                </p>
              )}
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={() => setViewMode('edit')}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Trip
              </button>
              {onSave && (
                <button
                  onClick={onSave}
                  disabled={saveLoading}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {saveLoading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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

        {/* View Toggle */}
        <div className="px-8 py-4 border-t bg-gray-50">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setViewMode('view')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'view'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
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
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Route className="w-4 h-4 inline mr-2" />
              Route Optimizer
            </button>
            <button
              onClick={() => setViewMode('insights')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'insights'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              AI Insights
            </button>
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
      ) : viewMode === 'insights' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <AIInsights trip={currentTrip} />
            <TripStats trip={currentTrip} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <WeatherWidget 
              destination={currentTrip.destination} 
              dates={tripDates} 
            />
            <TravelTips 
              destination={currentTrip.destination}
              preferences={currentTrip.preferences}
            />
          </div>
        </div>
      ) : (
        /* Daily Itinerary with Beautiful Images */
        <div className="space-y-8">
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

              {/* Attractions Grid */}
              <div className="p-6">
                {day.attractions.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {day.attractions.map((attraction, index) => (
                      <AttractionCard
                        key={attraction.id}
                        attraction={attraction}
                        city={currentTrip.destination}
                        showGallery={true}
                        className="h-full"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-lg font-medium mb-2">No attractions planned for this day</p>
                    <p className="text-sm">Add some attractions to make this day amazing!</p>
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
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Star, Navigation, Edit, Eye, Share2, Route, Brain, TrendingUp, Lightbulb, Cloud, Sparkles, Globe } from 'lucide-react';
import { Trip } from '../types';
import { MapView } from './MapView';
import { TripEditor } from './TripEditor';
import { RouteOptimizer } from './RouteOptimizer';
import { DestinationHero } from './DestinationHero';
import { AttractionCard } from './AttractionCard';
import { AIInsights } from './AIInsights';
import { AITravelInsights } from './AITravelInsights';
import { TripStats } from './TripStats';
import { WeatherWidget } from './WeatherWidget';
import { TravelTips } from './TravelTips';
import { CreatePost } from './CreatePost';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './NotificationToast';
import { useTrips } from '../hooks/useTrips';

interface EnhancedItineraryDisplayProps {
  trip: Trip;
  onEdit?: () => void;
  onSave?: () => void;
  saveLoading?: boolean;
  onTripUpdate?: (updatedTrip: Trip) => void;
}

export function EnhancedItineraryDisplay({ trip, onEdit, onSave, saveLoading = false, onTripUpdate }: EnhancedItineraryDisplayProps) {
  const [viewMode, setViewMode] = useState<'view' | 'edit' | 'map' | 'optimize' | 'insights' | 'ai-analysis'>('view');
  const [selectedMapDay, setSelectedMapDay] = useState(0);
  const [currentTrip, setCurrentTrip] = useState(trip);
  const [showShareModal, setShowShareModal] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  
  const { user } = useAuth();
  const { saveTrip } = useTrips(user?.id);
  const { showSuccess, showError } = useToast();

  // Auto-save when trip is updated
  useEffect(() => {
    if (user && currentTrip !== trip) {
      // Clear any existing timer
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
      
      // Set a new timer to save after 3 seconds of inactivity
      const timer = setTimeout(() => {
        handleAutoSave();
      }, 3000);
      
      setAutoSaveTimer(timer);
    }
    
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [currentTrip]);

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

  const handleAutoSave = async () => {
    if (!user || !currentTrip) return;
    
    setAutoSaving(true);
    try {
      // Make sure the trip has the current user ID
      const tripToSave = {
        ...currentTrip,
        userId: user.id
      };
      
      await saveTrip(tripToSave);
      showSuccess('Trip Auto-Saved', 'Your changes have been automatically saved');
    } catch (error) {
      console.error('Error auto-saving trip:', error);
      showError('Auto-Save Failed', 'Failed to save your changes automatically. Please try saving manually.');
    } finally {
      setAutoSaving(false);
    }
  };

  const handleShareTrip = () => {
    // Update trip to be public
    const updatedTrip = { ...currentTrip, isPublic: true };
    handleTripUpdate(updatedTrip);
    
    // Open share modal
    setShowShareModal(true);
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
  const aiEnhancedCount = currentTrip.itinerary.reduce((sum, day) => 
    sum + day.attractions.filter(attr => attr.aiEnhanced).length, 0
  );

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
              <div className="flex items-center mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {currentTrip.title || `Trip to ${currentTrip.destination}`}
                </h1>
                {aiEnhancedCount > 0 && (
                  <div className="ml-3 px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center">
                    <Sparkles className="w-4 h-4 text-purple-600 mr-1" />
                    <span className="text-xs font-semibold text-purple-700">AI Enhanced</span>
                  </div>
                )}
                {currentTrip.isPublic && (
                  <div className="ml-3 px-3 py-1 bg-gradient-to-r from-green-100 to-teal-100 rounded-full flex items-center">
                    <Globe className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs font-semibold text-green-700">Public</span>
                  </div>
                )}
              </div>
              {currentTrip.description && (
                <p className="text-gray-600 max-w-2xl leading-relaxed">
                  {currentTrip.description}
                </p>
              )}
              {aiEnhancedCount > 0 && (
                <p className="text-sm text-purple-600 mt-2 flex items-center">
                  <Brain className="w-4 h-4 mr-1" />
                  {aiEnhancedCount} attractions enhanced with AI-powered descriptions
                </p>
              )}
              {autoSaving && (
                <p className="text-sm text-blue-600 mt-2 flex items-center">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Auto-saving changes...
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
              {user && (
                <button
                  onClick={handleShareTrip}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-colors font-medium flex items-center"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Trip
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
              onClick={() => setViewMode('ai-analysis')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'ai-analysis'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Brain className="w-4 h-4 inline mr-2" />
              AI Analysis
            </button>
            <button
              onClick={() => setViewMode('insights')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                viewMode === 'insights'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Trip Insights
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">AI Route Optimization</h2>
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
      ) : viewMode === 'ai-analysis' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <AITravelInsights />
            <TripStats trip={currentTrip} />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <AIInsights trip={currentTrip} />
            <WeatherWidget 
              destination={currentTrip.destination} 
              dates={tripDates} 
            />
          </div>
        </div>
      ) : viewMode === 'insights' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <TripStats trip={currentTrip} />
            <WeatherWidget 
              destination={currentTrip.destination} 
              dates={tripDates} 
            />
          </div>
          
          {/* Right Column */}
          <div className="space-y-8">
            <TravelTips 
              destination={currentTrip.destination}
              preferences={currentTrip.preferences}
            />
            {currentTrip.aiTravelTips && (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">AI Travel Tips</h3>
                    <p className="text-sm text-purple-600">Personalized advice from our AI</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {currentTrip.aiTravelTips.map((tip, index) => (
                    <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                      <p className="text-gray-700 text-sm leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Daily Itinerary with AI-Enhanced Content */
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
                    {day.attractions.some(attr => attr.aiEnhanced) && (
                      <div className="flex items-center text-purple-600">
                        <Sparkles className="w-4 h-4 mr-1" />
                        AI Enhanced
                      </div>
                    )}
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
                      <div key={attraction.id} className="relative">
                        <AttractionCard
                          attraction={attraction}
                          city={currentTrip.destination}
                          showGallery={true}
                          className="h-full"
                        />
                        {attraction.aiEnhanced && (
                          <div className="absolute top-3 left-3 z-10 px-2 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-full text-xs font-semibold flex items-center">
                            <Sparkles className="w-3 h-3 mr-1" />
                            AI
                          </div>
                        )}
                      </div>
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

      {/* Share Modal */}
      {showShareModal && (
        <CreatePost 
          onClose={() => setShowShareModal(false)} 
          selectedTrip={currentTrip}
        />
      )}
    </div>
  );
}
import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import { MapPin, Navigation, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Attraction, DayPlan } from '../types';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface RealMapViewProps {
  dayPlans: DayPlan[];
  selectedDay?: number;
  onDaySelect?: (dayIndex: number) => void;
}

// Custom marker icons for different positions
const createCustomIcon = (color: string, number: number) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg width="25" height="41" viewBox="0 0 25 41" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.5 0C5.6 0 0 5.6 0 12.5c0 12.5 12.5 28.5 12.5 28.5s12.5-16 12.5-28.5C25 5.6 19.4 0 12.5 0z" fill="${color}"/>
        <circle cx="12.5" cy="12.5" r="8" fill="white"/>
        <text x="12.5" y="17" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="bold" fill="${color}">${number}</text>
      </svg>
    `)}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
};

// Component to fit map bounds to attractions
function MapBounds({ attractions }: { attractions: Attraction[] }) {
  const map = useMap();

  useEffect(() => {
    if (attractions.length > 0) {
      const bounds = new LatLngBounds(
        attractions.map(attr => [attr.latitude, attr.longitude])
      );
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [attractions, map]);

  return null;
}

export function RealMapView({ dayPlans, selectedDay = 0, onDaySelect }: RealMapViewProps) {
  const [mapReady, setMapReady] = useState(false);
  const currentDayPlan = dayPlans[selectedDay];
  const attractions = currentDayPlan?.attractions || [];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Create route polyline coordinates
  const routeCoordinates = attractions.map(attr => [attr.latitude, attr.longitude] as [number, number]);

  // Get marker color based on position
  const getMarkerColor = (index: number) => {
    if (index === 0) return '#10B981'; // Green for start
    if (index === attractions.length - 1) return '#EF4444'; // Red for end
    return '#3B82F6'; // Blue for middle stops
  };

  const handlePrevDay = () => {
    if (selectedDay > 0) {
      onDaySelect?.(selectedDay - 1);
    }
  };

  const handleNextDay = () => {
    if (selectedDay < dayPlans.length - 1) {
      onDaySelect?.(selectedDay + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Interactive Map</h2>
            <p className="text-green-100">Real-time route visualization with turn-by-turn directions</p>
          </div>
          
          {/* Day Navigation */}
          {dayPlans.length > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevDay}
                disabled={selectedDay === 0}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="px-4 py-2 bg-white/20 text-white rounded-lg font-medium">
                Day {selectedDay + 1} of {dayPlans.length}
              </div>
              
              <button
                onClick={handleNextDay}
                disabled={selectedDay === dayPlans.length - 1}
                className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Day Selector Tabs */}
      {dayPlans.length > 1 && (
        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
          <div className="flex space-x-2 overflow-x-auto">
            {dayPlans.map((_, index) => (
              <button
                key={index}
                onClick={() => onDaySelect?.(index)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedDay === index
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                Day {index + 1}
                <span className="ml-2 text-xs opacity-75">
                  {dayPlans[index].attractions.length} stops
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="relative">
        <div className="h-96 w-full">
          {attractions.length > 0 ? (
            <MapContainer
              center={[attractions[0].latitude, attractions[0].longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
              whenReady={() => setMapReady(true)}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Fit bounds to attractions */}
              <MapBounds attractions={attractions} />
              
              {/* Route polyline */}
              {routeCoordinates.length > 1 && (
                <Polyline
                  positions={routeCoordinates}
                  color="#3B82F6"
                  weight={4}
                  opacity={0.7}
                  dashArray="10, 10"
                />
              )}
              
              {/* Attraction markers */}
              {attractions.map((attraction, index) => (
                <Marker
                  key={attraction.id}
                  position={[attraction.latitude, attraction.longitude]}
                  icon={createCustomIcon(getMarkerColor(index), index + 1)}
                >
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-64">
                      <div className="flex items-start space-x-3">
                        {attraction.imageUrl && (
                          <img
                            src={attraction.imageUrl}
                            alt={attraction.name}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {attraction.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                            {attraction.description}
                          </p>
                          <div className="flex items-center space-x-3 text-xs text-gray-500">
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              {formatDuration(attraction.estimatedDuration)}
                            </span>
                            <span className="flex items-center">
                              <Star className="w-3 h-3 mr-1 text-yellow-400" />
                              {attraction.rating}
                            </span>
                          </div>
                          <div className="mt-2">
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                              Stop {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          ) : (
            <div className="h-full flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No attractions to display on map</p>
              </div>
            </div>
          )}
        </div>

        {/* Map Controls Overlay */}
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
              <span>Start</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
              <span>Stop</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
              <span>End</span>
            </div>
          </div>
        </div>

        {/* Day Summary Overlay */}
        {currentDayPlan && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
            <div className="text-sm font-semibold text-gray-900 mb-1">
              Day {selectedDay + 1} Summary
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {attractions.length} stops
              </div>
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDuration(currentDayPlan.totalDuration)}
              </div>
              <div className="flex items-center">
                <Navigation className="w-3 h-3 mr-1" />
                {formatDuration(currentDayPlan.estimatedTravelTime)} travel
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Route Details */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Day {selectedDay + 1} Route Details
          </h3>
          <div className="text-sm text-gray-600">
            {attractions.length} stops • {formatDuration(currentDayPlan?.totalDuration || 0)} total
          </div>
        </div>
        
        {attractions.length > 0 ? (
          <div className="space-y-3">
            {attractions.map((attraction, index) => (
              <div key={attraction.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                  index === 0 ? 'bg-green-500' : 
                  index === attractions.length - 1 ? 'bg-red-500' : 
                  'bg-blue-500'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{attraction.name}</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {formatDuration(attraction.estimatedDuration)}
                    <span className="mx-2">•</span>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                      {attraction.type}
                    </span>
                  </div>
                </div>
                {index < attractions.length - 1 && (
                  <div className="text-xs text-gray-500 flex items-center">
                    <Navigation className="w-3 h-3 mr-1" />
                    {Math.round(
                      Math.sqrt(
                        Math.pow(attractions[index + 1].latitude - attraction.latitude, 2) +
                        Math.pow(attractions[index + 1].longitude - attraction.longitude, 2)
                      ) * 111 * 3
                    )}m to next
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p>No attractions planned for this day</p>
          </div>
        )}
      </div>
    </div>
  );
}
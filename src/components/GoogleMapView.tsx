import React, { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapPin, Navigation, Clock, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Attraction, DayPlan } from '../types';

interface GoogleMapViewProps {
  dayPlans: DayPlan[];
  selectedDay?: number;
  onDaySelect?: (dayIndex: number) => void;
}

export function GoogleMapView({ dayPlans, selectedDay = 0, onDaySelect }: GoogleMapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService | null>(null);
  const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const currentDayPlan = dayPlans[selectedDay];
  const attractions = currentDayPlan?.attractions || [];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  // Initialize Google Maps
  useEffect(() => {
    const initMap = async () => {
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      
      if (!apiKey) {
        setError('Google Maps API key not configured');
        setLoading(false);
        return;
      }

      try {
        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places', 'geometry']
        });

        await loader.load();

        if (!mapRef.current) return;

        const mapInstance = new google.maps.Map(mapRef.current, {
          zoom: 13,
          center: { lat: 37.7749, lng: -122.4194 }, // Default to SF
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          styles: [
            {
              featureType: 'poi',
              elementType: 'labels',
              stylers: [{ visibility: 'off' }]
            }
          ]
        });

        const directionsServiceInstance = new google.maps.DirectionsService();
        const directionsRendererInstance = new google.maps.DirectionsRenderer({
          suppressMarkers: true,
          polylineOptions: {
            strokeColor: '#3B82F6',
            strokeWeight: 4,
            strokeOpacity: 0.8
          }
        });

        directionsRendererInstance.setMap(mapInstance);

        setMap(mapInstance);
        setDirectionsService(directionsServiceInstance);
        setDirectionsRenderer(directionsRendererInstance);
        setLoading(false);
      } catch (err) {
        console.error('Error loading Google Maps:', err);
        setError('Failed to load Google Maps');
        setLoading(false);
      }
    };

    initMap();
  }, []);

  // Update map when attractions change
  useEffect(() => {
    if (!map || !attractions.length) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));
    setMarkers([]);

    // Create new markers
    const newMarkers: google.maps.Marker[] = [];
    const bounds = new google.maps.LatLngBounds();

    attractions.forEach((attraction, index) => {
      const position = { lat: attraction.latitude, lng: attraction.longitude };
      
      // Create custom marker icon
      const markerColor = index === 0 ? '#10B981' : 
                         index === attractions.length - 1 ? '#EF4444' : '#3B82F6';
      
      const marker = new google.maps.Marker({
        position,
        map,
        title: attraction.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 12,
          fillColor: markerColor,
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 3
        },
        label: {
          text: (index + 1).toString(),
          color: '#ffffff',
          fontWeight: 'bold',
          fontSize: '12px'
        }
      });

      // Create info window
      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 250px;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${attraction.name}</h3>
            <p style="margin: 0 0 8px 0; font-size: 14px; color: #666;">${attraction.description}</p>
            <div style="display: flex; gap: 12px; font-size: 12px; color: #888;">
              <span>⏱️ ${formatDuration(attraction.estimatedDuration)}</span>
              <span>⭐ ${attraction.rating}</span>
              <span style="background: #3B82F6; color: white; padding: 2px 6px; border-radius: 4px;">
                Stop ${index + 1}
              </span>
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      newMarkers.push(marker);
      bounds.extend(position);
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (attractions.length > 1) {
      map.fitBounds(bounds);
    } else if (attractions.length === 1) {
      map.setCenter({ lat: attractions[0].latitude, lng: attractions[0].longitude });
      map.setZoom(15);
    }

    // Calculate and display route
    if (attractions.length > 1 && directionsService && directionsRenderer) {
      const waypoints = attractions.slice(1, -1).map(attraction => ({
        location: { lat: attraction.latitude, lng: attraction.longitude },
        stopover: true
      }));

      directionsService.route({
        origin: { lat: attractions[0].latitude, lng: attractions[0].longitude },
        destination: { lat: attractions[attractions.length - 1].latitude, lng: attractions[attractions.length - 1].longitude },
        waypoints,
        travelMode: google.maps.TravelMode.WALKING,
        optimizeWaypoints: true
      }, (result, status) => {
        if (status === 'OK' && result) {
          directionsRenderer?.setDirections(result);
        }
      });
    }
  }, [map, attractions, directionsService, directionsRenderer, markers]);

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

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Google Maps...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="h-96 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600 mb-2">{error}</p>
            <p className="text-sm text-gray-500">Falling back to OpenStreetMap</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white mb-1">Google Maps Integration</h2>
            <p className="text-green-100">Real-time directions with traffic data and street view</p>
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
        <div ref={mapRef} className="h-96 w-full" />

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
                Real-time directions
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
                <button
                  onClick={() => {
                    if (map) {
                      map.setCenter({ lat: attraction.latitude, lng: attraction.longitude });
                      map.setZoom(17);
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View
                </button>
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
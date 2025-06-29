import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { imageService } from '../services/imageService';
import { googleMapsService } from '../services/googleMapsService';

interface DestinationHeroProps {
  destination: string;
  startDate: string;
  endDate: string;
  preferences: string[];
  className?: string;
}

export function DestinationHero({ 
  destination, 
  startDate, 
  endDate, 
  preferences, 
  className = '' 
}: DestinationHeroProps) {
  const [heroImage, setHeroImage] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [imageSource, setImageSource] = useState<'Google Maps' | 'Pexels' | 'Unsplash' | 'Default'>('Default');

  useEffect(() => {
    loadHeroImage();
  }, [destination]);

  const loadHeroImage = async () => {
    try {
      setLoading(true);
      
      // Try to get image from Google Maps first if available
      if (googleMapsService.isAvailable()) {
        try {
          await googleMapsService.initialize();
          const places = await googleMapsService.searchPlaces(`${destination} skyline landmark`);
          
          if (places && places.length > 0 && places[0].photos && places[0].photos.length > 0) {
            const photoUrl = googleMapsService.getPlacePhotoUrl(places[0].photos[0], 1200);
            setHeroImage(photoUrl);
            setImageSource('Google Maps');
            setLoading(false);
            return;
          }
        } catch (error) {
          console.warn('Error loading Google Maps image:', error);
          // Continue to fallback methods
        }
      }
      
      // Try Pexels API
      try {
        const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;
        if (pexelsApiKey) {
          const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(destination + ' skyline landmark')}&per_page=1&orientation=landscape`,
            {
              headers: {
                'Authorization': pexelsApiKey
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
              const imageUrl = data.photos[0].src.large2x || data.photos[0].src.large;
              setHeroImage(imageUrl);
              setImageSource('Pexels');
              setLoading(false);
              return;
            }
          }
        }
      } catch (pexelsError) {
        console.warn('Pexels API error:', pexelsError);
      }
      
      // Try to get a destination image from our image service
      const imageUrl = await imageService.getDestinationHeroImage(destination);
      setHeroImage(imageUrl);
      setImageSource('Default');
    } catch (error) {
      console.error('Error loading hero image:', error);
      // Use a fallback image based on destination
      const fallbackImages = {
        'paris': 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'tokyo': 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'new york': 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'london': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'rome': 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'barcelona': 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'san francisco': 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1200'
      };
      
      const destinationLower = destination.toLowerCase();
      let matchedImage = 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200';
      
      for (const [key, url] of Object.entries(fallbackImages)) {
        if (destinationLower.includes(key)) {
          matchedImage = url;
          break;
        }
      }
      
      setHeroImage(matchedImage);
      setImageSource('Default');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  return (
    <div className={`relative rounded-2xl overflow-hidden ${className}`}>
      {/* Background Image */}
      <div className="absolute inset-0">
        {loading ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-400 via-purple-500 to-orange-400 animate-pulse" />
        ) : (
          <img
            src={heroImage}
            alt={destination}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200';
            }}
          />
        )}
        
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 h-full flex flex-col justify-end">
        <div className="max-w-2xl">
          {/* Destination Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
            {destination}
          </h1>
          
          {/* Trip Details */}
          <div className="flex flex-wrap items-center gap-6 mb-6 text-white/90">
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              <span className="font-medium">
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            </div>
            
            <div className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              <span className="font-medium">{getDuration()}</span>
            </div>
            
            <div className="flex items-center">
              <Users className="w-5 h-5 mr-2" />
              <span className="font-medium">{preferences.length} interests</span>
            </div>
          </div>

          {/* Preferences */}
          <div className="flex flex-wrap gap-2">
            {preferences.slice(0, 4).map((preference) => (
              <span
                key={preference}
                className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30"
              >
                {preference}
              </span>
            ))}
            {preferences.length > 4 && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm font-medium border border-white/30">
                +{preferences.length - 4} more
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Image Source Badge */}
      <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-white border border-white/30">
        {imageSource}
      </div>
    </div>
  );
}
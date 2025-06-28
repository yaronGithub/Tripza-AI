import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Users } from 'lucide-react';
import { imageService } from '../services/imageService';

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

  useEffect(() => {
    loadHeroImage();
  }, [destination]);

  const loadHeroImage = async () => {
    try {
      setLoading(true);
      const imageUrl = await imageService.getDestinationHeroImage(destination);
      setHeroImage(imageUrl);
    } catch (error) {
      console.error('Error loading hero image:', error);
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
              target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80';
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
    </div>
  );
}
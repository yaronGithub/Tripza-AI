import React, { useState, useEffect } from 'react';
import { Clock, Star, MapPin, Eye, Heart } from 'lucide-react';
import { Attraction } from '../types';
import { ImageGallery } from './ImageGallery';
import { imageService } from '../services/imageService';

interface AttractionCardProps {
  attraction: Attraction;
  city: string;
  onView?: () => void;
  onLike?: () => void;
  isLiked?: boolean;
  showGallery?: boolean;
  className?: string;
}

export function AttractionCard({ 
  attraction, 
  city, 
  onView, 
  onLike, 
  isLiked = false, 
  showGallery = true,
  className = '' 
}: AttractionCardProps) {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    loadImage();
  }, [attraction.name, city, attraction.type]);

  const loadImage = async () => {
    try {
      setImageLoading(true);
      const url = await imageService.getAttractionImage(attraction.name, city, attraction.type);
      setImageUrl(url);
    } catch (error) {
      console.error('Error loading attraction image:', error);
    } finally {
      setImageLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group ${className}`}>
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {showGallery ? (
          <ImageGallery
            attractionName={attraction.name}
            city={city}
            category={attraction.type}
            className="w-full h-full"
            autoSlide={true}
          />
        ) : (
          <div className="relative w-full h-full">
            {imageLoading ? (
              <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <img
                src={imageUrl || attraction.imageUrl}
                alt={attraction.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
                }}
              />
            )}
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Rating Badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
              <Star className="w-3 h-3 text-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">{attraction.rating}</span>
            </div>
            
            {/* Like Button */}
            {onLike && (
              <button
                onClick={onLike}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
              >
                <Heart 
                  className={`w-4 h-4 ${
                    isLiked 
                      ? 'text-red-500 fill-current' 
                      : 'text-gray-600'
                  }`} 
                />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {attraction.name}
          </h3>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-3 h-3 mr-1" />
            <span className="truncate">{attraction.address}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
          {attraction.description}
        </p>

        {/* Stats */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatDuration(attraction.estimatedDuration)}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-400" />
              {attraction.rating}
            </span>
          </div>
          
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
            {attraction.type}
          </span>
        </div>

        {/* Actions */}
        {onView && (
          <button
            onClick={onView}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
        )}
      </div>
    </div>
  );
}
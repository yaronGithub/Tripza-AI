import React, { useState, useEffect } from 'react';
import { Clock, Star, MapPin, Eye, Heart, X } from 'lucide-react';
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
  const [showModal, setShowModal] = useState(false);

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

  const handleViewDetails = () => {
    if (onView) {
      onView();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
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
          <button
            onClick={handleViewDetails}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </button>
        </div>
      </div>

      {/* Attraction Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="relative h-64 overflow-hidden">
              <img
                src={imageUrl || attraction.imageUrl}
                alt={attraction.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              
              {/* Close Button */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
              
              {/* Title Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <h2 className="text-2xl font-bold text-white mb-2">{attraction.name}</h2>
                <div className="flex items-center text-white/90">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span className="text-sm">{attraction.address}</span>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{attraction.rating}</div>
                  <div className="text-xs text-blue-700">Rating</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{formatDuration(attraction.estimatedDuration)}</div>
                  <div className="text-xs text-green-700">Duration</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-lg">
                  <div className="text-lg font-bold text-purple-600">{attraction.type}</div>
                  <div className="text-xs text-purple-700">Category</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this attraction</h3>
                <p className="text-gray-700 leading-relaxed">{attraction.description}</p>
              </div>

              {/* Additional Info */}
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Location</div>
                    <div className="text-gray-600 text-sm">{attraction.address}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Clock className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Recommended Duration</div>
                    <div className="text-gray-600 text-sm">{formatDuration(attraction.estimatedDuration)}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Star className="w-5 h-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium text-gray-900">Visitor Rating</div>
                    <div className="text-gray-600 text-sm">{attraction.rating} out of 5 stars</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
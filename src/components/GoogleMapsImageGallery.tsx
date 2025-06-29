import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Loader2, MapPin } from 'lucide-react';
import { googleMapsService } from '../services/googleMapsService';
import { imageService } from '../services/imageService';

interface GoogleMapsImageGalleryProps {
  attractionName: string;
  city: string;
  placeId?: string;
  className?: string;
  showControls?: boolean;
  autoSlide?: boolean;
}

export function GoogleMapsImageGallery({ 
  attractionName, 
  city, 
  placeId,
  className = '', 
  showControls = true,
  autoSlide = false 
}: GoogleMapsImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadImages();
  }, [attractionName, city, placeId]);

  useEffect(() => {
    if (autoSlide && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [autoSlide, images.length]);

  const loadImages = async () => {
    try {
      setLoading(true);
      setError(false);

      // Check if Google Maps is available
      if (!googleMapsService.isAvailable()) {
        console.warn('Google Maps not available for image loading');
        // Fall back to image service instead of showing error
        const fallbackImages = await imageService.getImageGallery(attractionName, city, 'attraction', 3);
        if (fallbackImages.length > 0) {
          setImages(fallbackImages);
          setLoading(false);
          return;
        }
        setError(true);
        setLoading(false);
        return;
      }

      let photos: string[] = [];

      // If we have a place ID, get photos directly
      if (placeId) {
        try {
          const placeDetails = await googleMapsService.getPlaceDetails(placeId);
          if (placeDetails) {
            photos = googleMapsService.getPlacePhotos(placeDetails, 5);
          }
        } catch (err) {
          console.warn('Error getting place details:', err);
        }
      }

      // If no photos from place ID, search for the place
      if (photos.length === 0) {
        try {
          const searchQuery = `${attractionName} ${city}`;
          const places = await googleMapsService.searchPlaces(searchQuery);
          
          if (places.length > 0) {
            const bestMatch = places[0];
            if (bestMatch.place_id) {
              const placeDetails = await googleMapsService.getPlaceDetails(bestMatch.place_id);
              if (placeDetails) {
                photos = googleMapsService.getPlacePhotos(placeDetails, 5);
              }
            }
          }
        } catch (err) {
          console.warn('Error searching for place:', err);
        }
      }

      if (photos.length > 0) {
        setImages(photos);
      } else {
        // Fall back to image service if Google Maps photos are not available
        const fallbackImages = await imageService.getImageGallery(attractionName, city, 'attraction', 3);
        if (fallbackImages.length > 0) {
          setImages(fallbackImages);
        } else {
          setError(true);
        }
      }
    } catch (err) {
      console.error('Error loading images:', err);
      // Try fallback images from image service
      try {
        const fallbackImages = await imageService.getImageGallery(attractionName, city, 'attraction', 3);
        if (fallbackImages.length > 0) {
          setImages(fallbackImages);
        } else {
          setError(true);
        }
      } catch (fallbackErr) {
        setError(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (loading) {
    return (
      <div className={`relative bg-gray-200 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-xs text-gray-600">Loading photos...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className={`relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <MapPin className="w-8 h-8 mx-auto mb-2 opacity-70" />
            <p className="text-xs opacity-90">No photos available</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden group ${className}`}>
      {/* Main Image */}
      <div className="relative w-full h-full">
        <img
          src={images[currentIndex]}
          alt={`${attractionName} - Photo ${currentIndex + 1}`}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={() => setError(true)}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Google Maps Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800 flex items-center">
          <MapPin className="w-3 h-3 mr-1 text-blue-600" />
          Google Maps
        </div>
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs font-medium">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {showControls && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
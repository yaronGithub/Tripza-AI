import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from 'lucide-react';
import { imageService } from '../services/imageService';

interface ImageGalleryProps {
  attractionName: string;
  city: string;
  category: string;
  className?: string;
  showControls?: boolean;
  autoSlide?: boolean;
}

export function ImageGallery({ 
  attractionName, 
  city, 
  category, 
  className = '', 
  showControls = true,
  autoSlide = false 
}: ImageGalleryProps) {
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSource, setImageSource] = useState<'Pexels' | 'Unsplash' | 'Default'>('Default');

  useEffect(() => {
    loadImages();
  }, [attractionName, city, category]);

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
      
      // Try Pexels API first
      try {
        const pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;
        if (pexelsApiKey) {
          const searchQuery = `${attractionName} ${city} ${category}`;
          const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(searchQuery)}&per_page=3&orientation=landscape`,
            {
              headers: {
                'Authorization': pexelsApiKey
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
              const pexelsImages = data.photos.map((photo: any) => photo.src.large);
              setImages(pexelsImages);
              setImageSource('Pexels');
              setError(false);
              setLoading(false);
              return;
            }
          }
        }
      } catch (pexelsError) {
        console.warn('Pexels API error:', pexelsError);
      }
      
      // Try Unsplash API if available
      try {
        const unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
        if (unsplashAccessKey) {
          const searchQuery = `${attractionName} ${city} ${category}`;
          const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=3&orientation=landscape`,
            {
              headers: {
                'Authorization': `Client-ID ${unsplashAccessKey}`
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.results && data.results.length > 0) {
              const unsplashImages = data.results.map((photo: any) => photo.urls.regular);
              setImages(unsplashImages);
              setImageSource('Unsplash');
              setError(false);
              setLoading(false);
              return;
            }
          }
        }
      } catch (unsplashError) {
        console.warn('Unsplash API error:', unsplashError);
      }
      
      // Fall back to image service
      const imageGallery = await imageService.getImageGallery(attractionName, city, category, 3);
      if (imageGallery.length > 0) {
        setImages(imageGallery);
        setImageSource('Default');
        setError(false);
      } else {
        setError(true);
      }
    } catch (err) {
      console.error('Error loading images:', err);
      setError(true);
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
          <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || images.length === 0) {
    return (
      <div className={`relative bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg overflow-hidden ${className}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <ImageIcon className="w-12 h-12 text-white/70" />
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
          alt={attractionName}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800';
          }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Image Source Badge */}
        <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-800">
          {imageSource}
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
import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar, Heart, ExternalLink } from 'lucide-react';

interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  bestTimeToVisit: string;
  highlights: string[];
}

interface TravelInspirationGalleryProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TravelInspirationGallery({ isOpen, onClose }: TravelInspirationGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [likedDestinations, setLikedDestinations] = useState<Set<string>>(new Set());

  // Curated list of inspiring destinations
  const destinations: Destination[] = [
    {
      id: '1',
      name: 'Kyoto, Japan',
      description: 'Experience the perfect blend of ancient traditions and modern culture in Japan\'s former capital. Explore serene temples, stunning gardens, and traditional tea houses while immersing yourself in Japanese history and cuisine.',
      imageUrl: 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bestTimeToVisit: 'March-May (cherry blossoms) or October-November (fall colors)',
      highlights: ['Fushimi Inari Shrine', 'Arashiyama Bamboo Grove', 'Kinkaku-ji (Golden Pavilion)', 'Gion District']
    },
    {
      id: '2',
      name: 'Santorini, Greece',
      description: 'Discover the iconic white-washed buildings with blue domes perched on dramatic cliffs overlooking the Aegean Sea. Enjoy breathtaking sunsets, volcanic beaches, and exceptional Mediterranean cuisine.',
      imageUrl: 'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bestTimeToVisit: 'April-May or September-October (fewer crowds, pleasant weather)',
      highlights: ['Oia Sunset', 'Fira Town', 'Red Beach', 'Ancient Thera']
    },
    {
      id: '3',
      name: 'Machu Picchu, Peru',
      description: 'Trek through the Andes to discover this 15th-century Incan citadel set against a breathtaking mountain backdrop. This UNESCO World Heritage site offers a glimpse into ancient civilization and engineering marvels.',
      imageUrl: 'https://images.pexels.com/photos/2929906/pexels-photo-2929906.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bestTimeToVisit: 'May-September (dry season)',
      highlights: ['Inca Trail', 'Sun Gate', 'Huayna Picchu', 'Temple of the Sun']
    },
    {
      id: '4',
      name: 'Amalfi Coast, Italy',
      description: 'Drive along the stunning Mediterranean coastline with colorful villages clinging to cliffs, crystal-clear waters, and lemon groves. Experience Italian dolce vita with exceptional cuisine and hospitality.',
      imageUrl: 'https://images.pexels.com/photos/1797134/pexels-photo-1797134.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bestTimeToVisit: 'May-June or September (pleasant weather, fewer crowds)',
      highlights: ['Positano', 'Ravello', 'Path of the Gods Hike', 'Emerald Grotto']
    },
    {
      id: '5',
      name: 'Serengeti National Park, Tanzania',
      description: 'Witness the spectacular Great Migration where millions of wildebeest, zebra, and gazelle traverse the plains in search of water and fresh grass. Experience the ultimate safari adventure.',
      imageUrl: 'https://images.pexels.com/photos/259411/pexels-photo-259411.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bestTimeToVisit: 'June-September (dry season, migration)',
      highlights: ['Great Migration', 'Big Five Safari', 'Hot Air Balloon Ride', 'Maasai Villages']
    },
    {
      id: '6',
      name: 'Banff National Park, Canada',
      description: 'Explore the heart of the Canadian Rockies with turquoise lakes, snow-capped mountains, and abundant wildlife. Perfect for hiking, skiing, and photography enthusiasts.',
      imageUrl: 'https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      bestTimeToVisit: 'June-August (summer) or December-March (winter sports)',
      highlights: ['Lake Louise', 'Moraine Lake', 'Banff Gondola', 'Johnston Canyon']
    }
  ];

  useEffect(() => {
    if (isOpen) {
      // Simulate loading
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  }, [isOpen]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % destinations.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + destinations.length) % destinations.length);
  };

  const toggleLike = (id: string) => {
    setLikedDestinations(prev => {
      const newLiked = new Set(prev);
      if (newLiked.has(id)) {
        newLiked.delete(id);
      } else {
        newLiked.add(id);
      }
      return newLiked;
    });
  };

  const handlePlanTrip = () => {
    // Close the gallery
    onClose();
    
    // Trigger navigation to create trip page
    const navigateEvent = new CustomEvent('navigateTo', { 
      detail: { page: 'create' } 
    });
    window.dispatchEvent(navigateEvent);
  };

  if (!isOpen) return null;

  const currentDestination = destinations[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-6xl bg-white rounded-2xl overflow-hidden shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading ? (
          <div className="h-[600px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-t-transparent border-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Discovering amazing destinations...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row h-[600px]">
            {/* Image Section */}
            <div className="relative w-full md:w-2/3 h-64 md:h-full">
              <img
                src={currentDestination.imageUrl}
                alt={currentDestination.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Buttons */}
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
              
              {/* Pagination Indicator */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {destinations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/80'
                    }`}
                  />
                ))}
              </div>
              
              {/* Destination Name Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white">{currentDestination.name}</h2>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="w-full md:w-1/3 p-6 overflow-y-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900">{currentDestination.name}</h3>
                  <button
                    onClick={() => toggleLike(currentDestination.id)}
                    className={`p-2 rounded-full ${
                      likedDestinations.has(currentDestination.id)
                        ? 'bg-red-100 text-red-500'
                        : 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500'
                    } transition-colors`}
                  >
                    <Heart className={`w-5 h-5 ${likedDestinations.has(currentDestination.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Best time to visit: {currentDestination.bestTimeToVisit}</span>
                </div>
                
                <p className="text-gray-700 leading-relaxed mb-6">
                  {currentDestination.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Highlights</h4>
                  <div className="space-y-2">
                    {currentDestination.highlights.map((highlight, index) => (
                      <div key={index} className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                        <MapPin className="w-4 h-4 text-blue-600 mr-2" />
                        <span className="text-gray-800">{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={handlePlanTrip}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center"
                  >
                    Plan a Trip Here
                  </button>
                  
                  <a
                    href={`https://www.google.com/search?q=${encodeURIComponent(currentDestination.name + ' travel')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                </div>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">
                  Swipe through for more travel inspiration
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Utensils, DollarSign, MapPin, Clock, Star, Info, Coffee, ShoppingBag } from 'lucide-react';
import { openaiService } from '../services/openaiService';

interface AICuisineGuideProps {
  destination: string;
  preferences: string[];
  className?: string;
}

export function AICuisineGuide({ destination, preferences, className = '' }: AICuisineGuideProps) {
  const [cuisineGuide, setCuisineGuide] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateCuisineGuide();
  }, [destination]);

  const generateCuisineGuide = async () => {
    setLoading(true);
    
    try {
      // Get AI-powered cuisine guide
      const guide = await openaiService.generateLocalCuisineGuide(destination, preferences);
      setCuisineGuide(guide);
    } catch (error) {
      console.error('Error generating cuisine guide:', error);
      // Fallback to simulated guide
      setCuisineGuide({
        mustTryDishes: [
          'Local Specialty 1 - A traditional dish with rich flavors',
          'Local Specialty 2 - Popular street food loved by locals',
          'Local Specialty 3 - Classic comfort food with regional ingredients',
          'Local Specialty 4 - Unique dessert with cultural significance',
          'Local Specialty 5 - Signature beverage or drink'
        ],
        bestRestaurants: [
          { name: 'Traditional Restaurant', specialty: 'Authentic local cuisine', priceRange: 'Moderate' },
          { name: 'Local Favorite', specialty: 'Family recipes', priceRange: 'Budget-friendly' },
          { name: 'Upscale Dining', specialty: 'Modern interpretations of classic dishes', priceRange: 'High-end' }
        ],
        foodMarkets: [
          'Central Market - Bustling food hall with various vendors',
          'Street Food District - Area known for authentic street food stalls'
        ],
        diningTips: [
          'Meal times may differ from what you\'re used to',
          'Tipping customs vary by location',
          'Reservations recommended for popular restaurants'
        ],
        dietaryOptions: 'Vegetarian options are increasingly available. Communicate dietary restrictions clearly, preferably in the local language.'
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriceRangeIcons = (priceRange: string) => {
    switch (priceRange.toLowerCase()) {
      case 'budget-friendly':
      case 'budget':
      case 'inexpensive':
      case 'cheap':
        return <span className="text-green-600">$</span>;
      case 'moderate':
      case 'mid-range':
      case 'average':
        return <span className="text-blue-600">$$</span>;
      case 'high-end':
      case 'expensive':
      case 'upscale':
      case 'luxury':
        return <span className="text-purple-600">$$$</span>;
      default:
        return <span className="text-gray-600">$$</span>;
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center pulse-glow mr-4">
            <Utensils className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Cuisine Guide</h3>
            <p className="text-sm text-orange-600">Analyzing local food in {destination}...</p>
          </div>
        </div>
        
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
            <Utensils className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Cuisine Guide</h3>
            <p className="text-orange-100">Local food recommendations for {destination}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Must-Try Dishes */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-orange-600" />
            Must-Try Local Dishes
          </h4>
          <div className="space-y-3">
            {cuisineGuide.mustTryDishes.map((dish: string, index: number) => (
              <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-gray-800 font-medium">{dish}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Best Restaurants */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Utensils className="w-5 h-5 mr-2 text-red-600" />
            Recommended Restaurants
          </h4>
          <div className="space-y-3">
            {cuisineGuide.bestRestaurants.map((restaurant: any, index: number) => (
              <div key={index} className="p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="font-semibold text-gray-900">{restaurant.name}</h5>
                    <p className="text-sm text-gray-700">{restaurant.specialty}</p>
                  </div>
                  <div className="text-sm font-medium">
                    {getPriceRangeIcons(restaurant.priceRange)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Food Markets */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-green-600" />
            Local Food Markets
          </h4>
          <div className="space-y-3">
            {cuisineGuide.foodMarkets.map((market: string, index: number) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                <p className="text-gray-800">{market}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dining Tips */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Info className="w-5 h-5 mr-2 text-blue-600" />
            Local Dining Tips
          </h4>
          <div className="space-y-2">
            {cuisineGuide.diningTips.map((tip: string, index: number) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold text-sm mr-3 flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dietary Options */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Coffee className="w-5 h-5 mr-2 text-purple-600" />
            Dietary Considerations
          </h4>
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
            <p className="text-gray-700">{cuisineGuide.dietaryOptions}</p>
          </div>
        </div>

        {/* AI Powered Badge */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 rounded-full text-white text-sm">
            <Utensils className="w-4 h-4 mr-2" />
            AI-Powered Culinary Recommendations
          </div>
        </div>
      </div>
    </div>
  );
}
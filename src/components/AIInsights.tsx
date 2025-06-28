import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Clock, MapPin, Star, Zap, Globe, Users, Calendar, Sparkles } from 'lucide-react';
import { Trip } from '../types';

interface AIInsightsProps {
  trip: Trip;
  className?: string;
}

export function AIInsights({ trip, className = '' }: AIInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateInsights();
  }, [trip]);

  const generateInsights = async () => {
    setLoading(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const totalAttractions = trip.itinerary.reduce((sum, day) => sum + day.attractions.length, 0);
    const totalDuration = trip.itinerary.reduce((sum, day) => sum + day.totalDuration, 0);
    const avgRating = trip.itinerary.reduce((sum, day) => 
      sum + day.attractions.reduce((daySum, attr) => daySum + attr.rating, 0), 0
    ) / totalAttractions;

    const insights = {
      efficiency: Math.min(95, 70 + Math.random() * 25),
      popularity: Math.min(98, 80 + Math.random() * 18),
      uniqueness: Math.min(92, 60 + Math.random() * 32),
      timeOptimization: Math.min(88, 65 + Math.random() * 23),
      recommendations: [
        'Perfect balance of culture and nature',
        'Optimal route reduces travel time by 35%',
        'High-rated attractions with 4.5+ stars',
        'Great for photography enthusiasts',
        'Ideal for first-time visitors'
      ],
      bestTimeToVisit: 'Morning (9-11 AM) for fewer crowds',
      estimatedCost: '$' + Math.floor(totalAttractions * 25 + Math.random() * 100),
      weatherTip: 'Pack layers - temperatures vary throughout the day',
      localTip: 'Download offline maps for better navigation'
    };

    setInsights(insights);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center pulse-glow mr-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Travel Insights</h3>
            <p className="text-sm text-purple-600">Analyzing your trip with advanced AI...</p>
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
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Travel Insights</h3>
            <p className="text-purple-100">Powered by advanced machine learning</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
            <div className="text-2xl font-bold text-green-600 mb-1">{insights.efficiency}%</div>
            <div className="text-xs text-green-700 font-medium">Route Efficiency</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
            <div className="text-2xl font-bold text-blue-600 mb-1">{insights.popularity}%</div>
            <div className="text-xs text-blue-700 font-medium">Popularity Score</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <div className="text-2xl font-bold text-purple-600 mb-1">{insights.uniqueness}%</div>
            <div className="text-xs text-purple-700 font-medium">Uniqueness</div>
          </div>
          
          <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border border-orange-200">
            <div className="text-2xl font-bold text-orange-600 mb-1">{insights.timeOptimization}%</div>
            <div className="text-xs text-orange-700 font-medium">Time Optimized</div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
            AI Recommendations
          </h4>
          <div className="space-y-2">
            {insights.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-700 text-sm">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 text-yellow-600 mr-2" />
              <span className="text-sm font-semibold text-yellow-800">Best Time</span>
            </div>
            <p className="text-xs text-yellow-700">{insights.bestTimeToVisit}</p>
          </div>
          
          <div className="p-4 bg-gradient-to-br from-green-50 to-teal-50 rounded-xl border border-green-200">
            <div className="flex items-center mb-2">
              <MapPin className="w-4 h-4 text-green-600 mr-2" />
              <span className="text-sm font-semibold text-green-800">Local Tip</span>
            </div>
            <p className="text-xs text-green-700">{insights.localTip}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
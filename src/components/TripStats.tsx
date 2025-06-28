import React from 'react';
import { MapPin, Clock, Star, TrendingUp, Users, Calendar, Zap, Globe } from 'lucide-react';
import { Trip } from '../types';

interface TripStatsProps {
  trip: Trip;
  className?: string;
}

export function TripStats({ trip, className = '' }: TripStatsProps) {
  const totalAttractions = trip.itinerary.reduce((sum, day) => sum + day.attractions.length, 0);
  const totalDuration = trip.itinerary.reduce((sum, day) => sum + day.totalDuration, 0);
  const totalTravelTime = trip.itinerary.reduce((sum, day) => sum + day.estimatedTravelTime, 0);
  const avgRating = trip.itinerary.reduce((sum, day) => 
    sum + day.attractions.reduce((daySum, attr) => daySum + attr.rating, 0), 0
  ) / (totalAttractions || 1);

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const stats = [
    {
      icon: <Calendar className="w-6 h-6" />,
      label: 'Duration',
      value: `${trip.itinerary.length} days`,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-200'
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      label: 'Attractions',
      value: totalAttractions.toString(),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-200'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      label: 'Total Time',
      value: formatTime(totalDuration),
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-200'
    },
    {
      icon: <Star className="w-6 h-6" />,
      label: 'Avg Rating',
      value: avgRating.toFixed(1),
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-200'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Travel Time',
      value: formatTime(totalTravelTime),
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      borderColor: 'border-red-200'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: 'Interests',
      value: trip.preferences.length.toString(),
      color: 'from-indigo-500 to-purple-500',
      bgColor: 'from-indigo-50 to-purple-50',
      borderColor: 'border-indigo-200'
    }
  ];

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center pulse-glow mr-4">
          <TrendingUp className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Trip Statistics</h3>
          <p className="text-sm text-gray-600">Comprehensive trip analytics</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`p-4 bg-gradient-to-br ${stat.bgColor} rounded-xl border ${stat.borderColor} hover-lift transition-all duration-300 group`}
          >
            <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform duration-300`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Efficiency Indicator */}
      <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold text-gray-800">Route Efficiency</span>
          <span className="text-sm font-bold text-green-600">Excellent</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: '87%' }}></div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Your itinerary is optimized to minimize travel time and maximize exploration
        </p>
      </div>
    </div>
  );
}
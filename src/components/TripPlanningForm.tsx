import React, { useState } from 'react';
import { Calendar, MapPin, Heart, Loader2, Sparkles, Globe, Clock } from 'lucide-react';
import { ATTRACTION_TYPES, TripFormData } from '../types';

interface TripPlanningFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading?: boolean;
}

export function TripPlanningForm({ onSubmit, isLoading = false }: TripPlanningFormProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    preferences: []
  });

  const [errors, setErrors] = useState<Partial<TripFormData>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    const newErrors: Partial<TripFormData> = {};
    
    if (!formData.destination.trim()) {
      newErrors.destination = 'Destination is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.endDate) {
      newErrors.endDate = 'End date is required';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (formData.preferences.length === 0) {
      newErrors.preferences = 'Please select at least one preference';
    }

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      onSubmit(formData);
    }
  };

  const handlePreferenceToggle = (preference: string) => {
    const newPreferences = formData.preferences.includes(preference)
      ? formData.preferences.filter(p => p !== preference)
      : [...formData.preferences, preference];
    
    setFormData({ ...formData, preferences: newPreferences });
    
    if (errors.preferences && newPreferences.length > 0) {
      setErrors({ ...errors, preferences: undefined });
    }
  };

  // Set minimum date to today
  const today = new Date().toISOString().split('T')[0];

  // Calculate trip duration
  const getTripDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      return days;
    }
    return 0;
  };

  const tripDuration = getTripDuration();

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 px-8 py-8">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Trip Planner</h2>
                <p className="text-blue-100">Powered by advanced AI and real-time data</p>
              </div>
            </div>
            
            {tripDuration > 0 && (
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    <span className="font-medium">{tripDuration} day trip</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    <span className="font-medium">Global coverage</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Destination */}
          <div className="space-y-3">
            <label className="block text-sm font-bold text-gray-800 mb-3">
              <MapPin className="w-5 h-5 inline mr-2 text-blue-600" />
              Where would you like to explore?
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.destination}
                onChange={(e) => {
                  setFormData({ ...formData, destination: e.target.value });
                  if (errors.destination) {
                    setErrors({ ...errors, destination: undefined });
                  }
                }}
                onFocus={() => setFocusedField('destination')}
                onBlur={() => setFocusedField(null)}
                placeholder="e.g., Paris, Tokyo, New York, Barcelona..."
                className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${
                  errors.destination 
                    ? 'border-red-300 bg-red-50' 
                    : focusedField === 'destination'
                    ? 'border-blue-500 bg-blue-50/50'
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              />
              {focusedField === 'destination' && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            {errors.destination && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-1">⚠️</span>
                {errors.destination}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800">
                <Calendar className="w-5 h-5 inline mr-2 text-green-600" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                min={today}
                onChange={(e) => {
                  setFormData({ ...formData, startDate: e.target.value });
                  if (errors.startDate) {
                    setErrors({ ...errors, startDate: undefined });
                  }
                }}
                onFocus={() => setFocusedField('startDate')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 ${
                  errors.startDate 
                    ? 'border-red-300 bg-red-50' 
                    : focusedField === 'startDate'
                    ? 'border-green-500 bg-green-50/50'
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.startDate}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-bold text-gray-800">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                min={formData.startDate || today}
                onChange={(e) => {
                  setFormData({ ...formData, endDate: e.target.value });
                  if (errors.endDate) {
                    setErrors({ ...errors, endDate: undefined });
                  }
                }}
                onFocus={() => setFocusedField('endDate')}
                onBlur={() => setFocusedField(null)}
                className={`w-full px-6 py-4 border-2 rounded-2xl text-gray-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-green-500/20 ${
                  errors.endDate 
                    ? 'border-red-300 bg-red-50' 
                    : focusedField === 'endDate'
                    ? 'border-green-500 bg-green-50/50'
                    : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-1">⚠️</span>
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <label className="block text-sm font-bold text-gray-800">
              <Heart className="w-5 h-5 inline mr-2 text-pink-600" />
              What interests you most? (Select all that apply)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ATTRACTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePreferenceToggle(type)}
                  className={`group p-4 rounded-2xl border-2 text-sm font-medium transition-all duration-200 text-left hover:scale-105 hover:shadow-lg ${
                    formData.preferences.includes(type)
                      ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-purple-50 text-blue-700 shadow-lg'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{type}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                      formData.preferences.includes(type)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 group-hover:border-blue-400'
                    }`}>
                      {formData.preferences.includes(type) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {errors.preferences && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-1">⚠️</span>
                {errors.preferences}
              </p>
            )}
            
            {formData.preferences.length > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                <p className="text-sm text-green-700 font-medium flex items-center">
                  <span className="w-4 h-4 mr-2">✨</span>
                  {formData.preferences.length} interest{formData.preferences.length !== 1 ? 's' : ''} selected - Perfect for personalization!
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white py-5 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                  <span>AI is crafting your perfect trip...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-6 h-6 mr-3" />
                  <span>Generate My AI-Powered Itinerary</span>
                </>
              )}
            </button>
          </div>

          {/* Features Preview */}
          <div className="pt-6 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-3">
                <div className="w-10 h-10 mx-auto mb-2 bg-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🤖</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">AI-Enhanced</h4>
                <p className="text-xs text-gray-600">Smart recommendations powered by OpenAI</p>
              </div>
              
              <div className="p-3">
                <div className="w-10 h-10 mx-auto mb-2 bg-green-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">🗺️</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Real Maps</h4>
                <p className="text-xs text-gray-600">Google Maps integration with live directions</p>
              </div>
              
              <div className="p-3">
                <div className="w-10 h-10 mx-auto mb-2 bg-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-xl">⚡</span>
                </div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Instant</h4>
                <p className="text-xs text-gray-600">Complete itinerary in under 30 seconds</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
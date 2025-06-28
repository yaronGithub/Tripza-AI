import React, { useState } from 'react';
import { Calendar, MapPin, Heart, Loader2, Sparkles, Globe, Clock, Zap, Brain, Star } from 'lucide-react';
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
    <div className="max-w-3xl mx-auto">
      <div className="card-premium rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-premium px-8 py-10">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl float"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl float-reverse"></div>
          
          <div className="relative z-10">
            <div className="flex items-center mb-6">
              <div className="p-4 glass rounded-2xl mr-4 pulse-glow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white text-shadow-lg">AI Trip Planner</h2>
                <p className="text-blue-100">Powered by advanced AI and real-time data</p>
              </div>
            </div>
            
            {tripDuration > 0 && (
              <div className="glass rounded-2xl p-6 border border-white/30">
                <div className="grid grid-cols-3 gap-4 text-white text-center">
                  <div className="flex flex-col items-center">
                    <Clock className="w-6 h-6 mb-2" />
                    <span className="font-bold text-lg">{tripDuration}</span>
                    <span className="text-sm text-blue-100">Days</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Globe className="w-6 h-6 mb-2" />
                    <span className="font-bold text-lg">Global</span>
                    <span className="text-sm text-blue-100">Coverage</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Zap className="w-6 h-6 mb-2" />
                    <span className="font-bold text-lg">30s</span>
                    <span className="text-sm text-blue-100">Generation</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Destination */}
          <div className="space-y-4">
            <label className="block text-lg font-bold text-gray-800 mb-3">
              <MapPin className="w-6 h-6 inline mr-3 text-purple-600" />
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
                className={`input-premium w-full px-6 py-4 rounded-2xl text-gray-900 placeholder-gray-500 transition-premium focus:outline-none ${
                  errors.destination 
                    ? 'border-red-300 bg-red-50' 
                    : focusedField === 'destination'
                    ? 'border-purple-500 bg-white shadow-lg'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              />
              {focusedField === 'destination' && (
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
                </div>
              )}
            </div>
            {errors.destination && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-2">⚠️</span>
                {errors.destination}
              </p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <label className="block text-lg font-bold text-gray-800">
                <Calendar className="w-6 h-6 inline mr-3 text-green-600" />
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
                className={`input-premium w-full px-6 py-4 rounded-2xl text-gray-900 transition-premium focus:outline-none ${
                  errors.startDate 
                    ? 'border-red-300 bg-red-50' 
                    : focusedField === 'startDate'
                    ? 'border-green-500 bg-white shadow-lg'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              />
              {errors.startDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-2">⚠️</span>
                  {errors.startDate}
                </p>
              )}
            </div>
            
            <div className="space-y-4">
              <label className="block text-lg font-bold text-gray-800">
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
                className={`input-premium w-full px-6 py-4 rounded-2xl text-gray-900 transition-premium focus:outline-none ${
                  errors.endDate 
                    ? 'border-red-300 bg-red-50' 
                    : focusedField === 'endDate'
                    ? 'border-green-500 bg-white shadow-lg'
                    : 'border-gray-200 hover:border-green-300'
                }`}
              />
              {errors.endDate && (
                <p className="text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 mr-2">⚠️</span>
                  {errors.endDate}
                </p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-6">
            <label className="block text-lg font-bold text-gray-800">
              <Heart className="w-6 h-6 inline mr-3 text-pink-600" />
              What interests you most? (Select all that apply)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ATTRACTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePreferenceToggle(type)}
                  className={`group p-6 rounded-2xl border-2 text-sm font-semibold transition-premium text-left hover-lift ${
                    formData.preferences.includes(type)
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 text-purple-700 shadow-lg pulse-glow'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{type}</span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-premium ${
                      formData.preferences.includes(type)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300 group-hover:border-purple-400'
                    }`}>
                      {formData.preferences.includes(type) && (
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {errors.preferences && (
              <p className="text-sm text-red-600 flex items-center">
                <span className="w-4 h-4 mr-2">⚠️</span>
                {errors.preferences}
              </p>
            )}
            
            {formData.preferences.length > 0 && (
              <div className="p-6 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                <p className="text-sm text-green-700 font-semibold flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  {formData.preferences.length} interest{formData.preferences.length !== 1 ? 's' : ''} selected - Perfect for personalization!
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-premium w-full py-6 px-8 rounded-3xl font-bold text-lg text-white hover-lift shimmer transition-premium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-2xl"
            >
              {isLoading ? (
                <>
                  <div className="spinner-premium mr-3"></div>
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
          <div className="pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <span className="text-2xl">🤖</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">AI-Enhanced</h4>
                <p className="text-xs text-gray-600">Smart recommendations powered by OpenAI</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <span className="text-2xl">🗺️</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Real Maps</h4>
                <p className="text-xs text-gray-600">Google Maps integration with live directions</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <span className="text-2xl">⚡</span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Instant</h4>
                <p className="text-xs text-gray-600">Complete itinerary in under 30 seconds</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
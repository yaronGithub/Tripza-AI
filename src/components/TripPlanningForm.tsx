import React, { useState } from 'react';
import { Calendar, MapPin, Heart, Loader2 } from 'lucide-react';
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

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-orange-500 px-8 py-6">
          <h2 className="text-2xl font-bold text-white mb-2">Plan Your Perfect Trip</h2>
          <p className="text-blue-100">Tell us about your dream destination and we'll create a personalized itinerary</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Destination */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <MapPin className="w-4 h-4 inline mr-2" />
              Where are you traveling?
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => {
                setFormData({ ...formData, destination: e.target.value });
                if (errors.destination) {
                  setErrors({ ...errors, destination: undefined });
                }
              }}
              placeholder="e.g., San Francisco, New York, Paris"
              className={`w-full px-4 py-3 border rounded-xl text-gray-900 placeholder-gray-500 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.destination ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
              }`}
            />
            {errors.destination && (
              <p className="mt-2 text-sm text-red-600">{errors.destination}</p>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
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
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.startDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              />
              {errors.startDate && (
                <p className="mt-2 text-sm text-red-600">{errors.startDate}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
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
                className={`w-full px-4 py-3 border rounded-xl text-gray-900 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.endDate ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'
                }`}
              />
              {errors.endDate && (
                <p className="mt-2 text-sm text-red-600">{errors.endDate}</p>
              )}
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              <Heart className="w-4 h-4 inline mr-2" />
              What interests you most? (Select all that apply)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {ATTRACTION_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePreferenceToggle(type)}
                  className={`p-3 rounded-xl border-2 text-sm font-medium transition-all text-left hover:scale-105 ${
                    formData.preferences.includes(type)
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
            
            {errors.preferences && (
              <p className="mt-3 text-sm text-red-600">{errors.preferences}</p>
            )}
            
            {formData.preferences.length > 0 && (
              <p className="mt-3 text-sm text-green-600">
                {formData.preferences.length} preference{formData.preferences.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-orange-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Creating Your Perfect Trip...
              </>
            ) : (
              'Generate My Itinerary'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
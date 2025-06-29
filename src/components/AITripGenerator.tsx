import React, { useState } from 'react';
import { Brain, Sparkles, Zap, Globe, Clock, Star, MapPin, Users } from 'lucide-react';
import { openaiService } from '../services/openaiService';
import { TripFormData } from '../types';

interface AITripGeneratorProps {
  onTripGenerated: (tripData: any) => void;
  isLoading: boolean;
}

export function AITripGenerator({ onTripGenerated, isLoading }: AITripGeneratorProps) {
  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    startDate: '',
    endDate: '',
    preferences: []
  });
  const [aiStage, setAiStage] = useState<string>('');
  const [generationProgress, setGenerationProgress] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.destination || !formData.startDate || !formData.endDate) {
      return;
    }

    // Simulate AI generation stages
    const stages = [
      'Analyzing destination data...',
      'Processing your preferences...',
      'Consulting AI travel expert...',
      'Optimizing route efficiency...',
      'Generating personalized content...',
      'Finalizing your perfect trip...'
    ];

    for (let i = 0; i < stages.length; i++) {
      setAiStage(stages[i]);
      setGenerationProgress((i + 1) / stages.length * 100);
      await new Promise(resolve => setTimeout(resolve, 800));
    }

    // Generate the actual trip
    onTripGenerated(formData);
  };

  const today = new Date().toISOString().split('T')[0];

  const attractionTypes = [
    'Parks & Nature',
    'Museums & Galleries', 
    'Historical Sites',
    'Shopping Districts',
    'Restaurants & Foodie Spots',
    'Nightlife',
    'Family-Friendly',
    'Adventure & Outdoors',
    'Art & Culture'
  ];

  const handlePreferenceToggle = (preference: string) => {
    const newPreferences = formData.preferences.includes(preference)
      ? formData.preferences.filter(p => p !== preference)
      : [...formData.preferences, preference];
    
    setFormData({ ...formData, preferences: newPreferences });
  };

  const getDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)) + 1;
      return days;
    }
    return 0;
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* AI Generation Header */}
          <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-8 py-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center pulse-glow">
              <Brain className="w-10 h-10 text-white animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Trip Generator</h2>
            <p className="text-blue-100 text-lg">Creating your perfect itinerary...</p>
          </div>

          {/* Progress Section */}
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">{aiStage}</span>
                <span className="text-sm font-medium text-purple-600">{Math.round(generationProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${generationProgress}%` }}
                ></div>
              </div>
            </div>

            {/* AI Features Showcase */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-purple-50 rounded-xl">
                <Zap className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                <div className="text-sm font-semibold text-purple-800">Lightning Fast</div>
                <div className="text-xs text-purple-600">30-second generation</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                <div className="text-sm font-semibold text-blue-800">Global Coverage</div>
                <div className="text-xs text-blue-600">Any destination worldwide</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-xl">
                <Star className="w-8 h-8 mx-auto mb-2 text-green-600" />
                <div className="text-sm font-semibold text-green-800">Personalized</div>
                <div className="text-xs text-green-600">Tailored to your interests</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-xl">
                <MapPin className="w-8 h-8 mx-auto mb-2 text-orange-600" />
                <div className="text-sm font-semibold text-orange-800">Optimized Routes</div>
                <div className="text-xs text-orange-600">Minimal travel time</div>
              </div>
            </div>

            <div className="text-center text-gray-600">
              <p className="text-sm">Our AI is analyzing thousands of attractions and optimizing your perfect route...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 px-8 py-10 relative overflow-hidden">
          <div className="absolute top-4 left-4 w-20 h-20 bg-white/10 rounded-full blur-xl float"></div>
          <div className="absolute bottom-4 right-4 w-16 h-16 bg-white/10 rounded-full blur-xl float-reverse"></div>
          
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 rounded-full flex items-center justify-center pulse-glow">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">AI Trip Generator</h2>
            <p className="text-blue-100 text-lg">Powered by advanced artificial intelligence</p>
            
            {getDuration() > 0 && (
              <div className="mt-6 bg-white/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="grid grid-cols-3 gap-4 text-white text-center">
                  <div>
                    <Clock className="w-6 h-6 mx-auto mb-1" />
                    <div className="font-bold text-lg">{getDuration()}</div>
                    <div className="text-xs text-blue-100">Days</div>
                  </div>
                  <div>
                    <Globe className="w-6 h-6 mx-auto mb-1" />
                    <div className="font-bold text-lg">AI</div>
                    <div className="text-xs text-blue-100">Powered</div>
                  </div>
                  <div>
                    <Zap className="w-6 h-6 mx-auto mb-1" />
                    <div className="font-bold text-lg">30s</div>
                    <div className="text-xs text-blue-100">Generation</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Destination */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-3">
              <MapPin className="w-6 h-6 inline mr-3 text-purple-600" />
              Where would you like to explore?
            </label>
            <input
              type="text"
              value={formData.destination}
              onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              placeholder="e.g., Paris, Tokyo, New York, Barcelona..."
              className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-purple-500 focus:outline-none transition-colors text-lg"
              required
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                <Clock className="w-6 h-6 inline mr-3 text-green-600" />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                min={today}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-lg"
                required
              />
            </div>
            
            <div>
              <label className="block text-lg font-bold text-gray-800 mb-3">
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                min={formData.startDate || today}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-6 py-4 border-2 border-gray-200 rounded-2xl focus:border-green-500 focus:outline-none transition-colors text-lg"
                required
              />
            </div>
          </div>

          {/* Preferences */}
          <div>
            <label className="block text-lg font-bold text-gray-800 mb-4">
              <Star className="w-6 h-6 inline mr-3 text-pink-600" />
              What interests you most? (Select all that apply)
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {attractionTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handlePreferenceToggle(type)}
                  className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all duration-200 text-left hover-lift ${
                    formData.preferences.includes(type)
                      ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-blue-50 text-purple-700 shadow-lg pulse-glow'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="flex-1">{type}</span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      formData.preferences.includes(type)
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {formData.preferences.includes(type) && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            {formData.preferences.length > 0 && (
              <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl border border-green-200">
                <p className="text-sm text-green-700 font-semibold flex items-center">
                  <Star className="w-4 h-4 mr-2" />
                  {formData.preferences.length} interest{formData.preferences.length !== 1 ? 's' : ''} selected - Perfect for AI personalization!
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={!formData.destination || !formData.startDate || !formData.endDate || formData.preferences.length === 0}
              className="w-full py-6 px-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white rounded-3xl font-bold text-lg hover-lift shimmer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-2xl"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Generate My AI-Powered Itinerary
            </button>
          </div>

          {/* AI Features Preview */}
          <div className="pt-8 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Real AI Intelligence</h4>
                <p className="text-xs text-gray-600">OpenAI GPT-4o-mini powers personalized recommendations</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Google Maps Integration</h4>
                <p className="text-xs text-gray-600">Real photos, directions, and professional navigation</p>
              </div>
              
              <div className="p-4">
                <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Lightning Fast</h4>
                <p className="text-xs text-gray-600">Complete personalized itinerary in under 30 seconds</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
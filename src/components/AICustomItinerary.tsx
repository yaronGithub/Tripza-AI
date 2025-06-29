import React, { useState } from 'react';
import { Brain, Sparkles, Zap, Calendar, Clock, MapPin, Lightbulb, Loader2, Check } from 'lucide-react';
import { openaiService } from '../services/openaiService';

interface AICustomItineraryProps {
  destination: string;
  preferences: string[];
  duration: number;
  className?: string;
}

export function AICustomItinerary({ destination, preferences, duration, className = '' }: AICustomItineraryProps) {
  const [specialRequests, setSpecialRequests] = useState('');
  const [customItinerary, setCustomItinerary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);

  const handleGenerateItinerary = async () => {
    if (!specialRequests.trim()) return;
    
    setLoading(true);
    
    try {
      const itinerary = await openaiService.generateCustomItinerary(
        destination,
        preferences,
        duration,
        specialRequests
      );
      
      setCustomItinerary(itinerary);
      setGenerated(true);
    } catch (error) {
      console.error('Error generating custom itinerary:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Custom Itinerary</h3>
            <p className="text-blue-100">Personalized plan for your {destination} trip</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!generated ? (
          <>
            <div className="mb-6">
              <h4 className="text-lg font-bold text-gray-900 mb-3">Create Your Custom Itinerary</h4>
              <p className="text-gray-600 mb-4">
                Tell our AI about your specific needs, interests, or constraints for your {duration}-day trip to {destination}.
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Requests or Requirements
                </label>
                <textarea
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="Examples: 'I'm traveling with young children', 'I have mobility issues', 'I want to focus on photography opportunities', 'I'm a vegetarian', etc."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32 resize-none"
                />
              </div>
              
              <div className="flex items-center justify-between mb-6">
                <div className="text-sm text-gray-500">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {duration} days in {destination}
                </div>
                <div className="text-sm text-gray-500">
                  <MapPin className="w-4 h-4 inline mr-1" />
                  {preferences.length} interests selected
                </div>
              </div>
              
              <button
                onClick={handleGenerateItinerary}
                disabled={loading || !specialRequests.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating Custom Itinerary...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Custom AI Itinerary
                  </>
                )}
              </button>
            </div>
            
            <div className="border-t border-gray-100 pt-6">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Why Use Custom AI Itinerary?</h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-3 flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Personalized to Your Needs</span> - Accommodates special requirements like dietary restrictions, mobility issues, or traveling with children
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mr-3 flex-shrink-0">
                    <Lightbulb className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Expert Recommendations</span> - AI analyzes thousands of data points to suggest the perfect activities for your specific situation
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 mr-3 flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Time-Optimized</span> - Creates realistic daily plans that consider your pace and priorities
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-gray-900">Your Custom AI Itinerary</h4>
                <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  <Check className="w-4 h-4 mr-1" />
                  <span className="text-xs font-medium">Generated</span>
                </div>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 mb-4">
                <div className="flex items-start">
                  <Lightbulb className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
                  <div>
                    <p className="text-sm text-blue-800 font-medium">Your Special Requests</p>
                    <p className="text-sm text-blue-700">{specialRequests}</p>
                  </div>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                <div dangerouslySetInnerHTML={{ 
                  __html: customItinerary ? 
                    customItinerary.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : 
                    'No itinerary generated yet.' 
                }} />
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  setCustomItinerary(null);
                  setSpecialRequests('');
                  setGenerated(false);
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Create New Custom Itinerary
              </button>
              
              <button
                onClick={() => {
                  // In a real app, this would save the itinerary to the user's account
                  alert('Itinerary saved! This would be integrated with your trip planning in a real app.');
                }}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
              >
                Save This Itinerary
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
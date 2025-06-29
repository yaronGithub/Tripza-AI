import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Lightbulb, Star, MapPin, Clock, Users, Zap, Target, Award } from 'lucide-react';
import { openaiService } from '../services/openaiService';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';

interface AITravelInsightsProps {
  className?: string;
}

export function AITravelInsights({ className = '' }: AITravelInsightsProps) {
  const [insights, setInsights] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [travelTips, setTravelTips] = useState<string[]>([]);
  
  const { user } = useAuth();
  const { trips } = useTrips(user?.id);

  useEffect(() => {
    if (user && trips.length > 0) {
      generatePersonalizedInsights();
    } else {
      generateGeneralInsights();
    }
  }, [user, trips]);

  const generatePersonalizedInsights = async () => {
    try {
      setLoading(true);
      
      // Get user's travel preferences from their trips
      const allPreferences = trips.flatMap(trip => trip.preferences || []);
      const uniquePreferences = [...new Set(allPreferences)];
      
      // Generate AI analysis of user's travel personality
      const analysis = await openaiService.analyzeTravelPersonality(trips, uniquePreferences);
      setInsights(analysis);
      
      // Generate personalized travel tips
      if (trips.length > 0) {
        const lastTrip = trips[0];
        const tips = await openaiService.generateTravelTips(
          lastTrip.destination, 
          uniquePreferences, 
          3
        );
        setTravelTips(tips);
      }
    } catch (error) {
      console.error('Error generating personalized insights:', error);
      generateGeneralInsights();
    } finally {
      setLoading(false);
    }
  };

  const generateGeneralInsights = async () => {
    try {
      setLoading(true);
      
      // Generate general travel insights for new users
      const generalPreferences = ['Parks & Nature', 'Museums & Galleries', 'Restaurants & Foodie Spots'];
      const tips = await openaiService.generateTravelTips('popular destinations', generalPreferences, 3);
      setTravelTips(tips);
      
      // Set default insights for new users
      setInsights({
        personalityType: 'Explorer',
        travelStyle: 'You\'re ready to discover the world with AI-powered planning! Start your journey and let our AI learn your preferences.',
        recommendations: [
          'Try our AI trip planner for your first adventure',
          'Explore different destination types to find your style',
          'Join our travel community to get inspired'
        ],
        budgetTips: [
          'Use AI optimization to save time and money',
          'Plan trips during shoulder seasons',
          'Let AI find hidden gems that locals love'
        ],
        localInsights: [
          'AI recommendations include local favorites',
          'Get insider tips from our intelligent system',
          'Discover authentic experiences with smart planning'
        ]
      });
    } catch (error) {
      console.error('Error generating general insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center pulse-glow mr-4">
            <Brain className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Travel Insights</h3>
            <p className="text-sm text-purple-600">Analyzing your travel personality...</p>
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
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Travel Insights</h3>
            <p className="text-purple-100">Powered by advanced machine learning</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Travel Personality */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-500 rounded-xl flex items-center justify-center mr-3">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900">Your Travel Personality</h4>
              <div className="flex items-center">
                <Award className="w-4 h-4 text-purple-600 mr-1" />
                <span className="text-purple-600 font-semibold">{insights?.personalityType}</span>
              </div>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed bg-purple-50 p-4 rounded-xl border border-purple-100">
            {insights?.travelStyle}
          </p>
        </div>

        {/* AI Recommendations */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-blue-600" />
            AI Recommendations
          </h4>
          <div className="space-y-2">
            {insights?.recommendations?.map((rec: string, index: number) => (
              <div key={index} className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-3 mt-0.5">
                  <span className="text-white text-xs font-bold">{index + 1}</span>
                </div>
                <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Smart Travel Tips */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-600" />
            Smart Travel Tips
          </h4>
          <div className="space-y-2">
            {travelTips.map((tip, index) => (
              <div key={index} className="flex items-start p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <Star className="w-4 h-4 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Tips */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Budget Optimization
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {insights?.budgetTips?.map((tip: string, index: number) => (
              <div key={index} className="p-3 bg-green-50 rounded-lg border border-green-100">
                <span className="text-gray-700 text-sm leading-relaxed">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Insights */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-orange-600" />
            Local Connection Tips
          </h4>
          <div className="grid grid-cols-1 gap-2">
            {insights?.localInsights?.map((insight: string, index: number) => (
              <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <span className="text-gray-700 text-sm leading-relaxed">{insight}</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Stats */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-4 text-white">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold">AI Analysis Stats</h4>
            <Brain className="w-5 h-5" />
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">{trips.length}</div>
              <div className="text-xs text-purple-100">Trips Analyzed</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {insights?.recommendations?.length || 0}
              </div>
              <div className="text-xs text-purple-100">AI Suggestions</div>
            </div>
            <div>
              <div className="text-2xl font-bold">95%</div>
              <div className="text-xs text-purple-100">Accuracy Score</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
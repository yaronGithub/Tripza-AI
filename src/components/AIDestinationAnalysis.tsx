import React, { useState, useEffect } from 'react';
import { Brain, MapPin, Calendar, Users, Star, TrendingUp, Lightbulb, Clock, Zap, Globe, Camera } from 'lucide-react';
import { Trip } from '../types';
import { openaiService } from '../services/openaiService';

interface AIDestinationAnalysisProps {
  destination: string;
  preferences: string[];
  className?: string;
}

export function AIDestinationAnalysis({ destination, preferences, className = '' }: AIDestinationAnalysisProps) {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateDestinationAnalysis();
  }, [destination, preferences]);

  const generateDestinationAnalysis = async () => {
    setLoading(true);
    
    try {
      // Get AI-powered destination analysis
      const destinationInsights = await openaiService.analyzeDestination(destination, preferences);
      setAnalysis(destinationInsights);
    } catch (error) {
      console.error('Error generating destination analysis:', error);
      // Fallback to simulated analysis
      setAnalysis({
        bestTimeToVisit: 'Spring (April-June) and Fall (September-October)',
        localCuisine: ['Local specialty dishes', 'Regional favorites', 'Must-try street food'],
        culturalInsights: ['Key cultural norms', 'Local customs to respect', 'Traditional practices'],
        hiddenGems: ['Off-the-beaten-path locations', 'Local favorites', 'Undiscovered spots'],
        transportationTips: ['Best ways to get around', 'Local transit options', 'Navigation advice'],
        safetyInfo: ['General safety rating: Good', 'Areas to avoid at night', 'Emergency contacts'],
        packingRecommendations: ['Weather-appropriate clothing', 'Essential items', 'Local considerations'],
        languageTips: ['Common phrases', 'Translation resources', 'Communication advice']
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-green-600 rounded-2xl flex items-center justify-center pulse-glow mr-4">
            <Globe className="w-6 h-6 text-white animate-pulse" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">AI Destination Analysis</h3>
            <p className="text-sm text-blue-600">Analyzing {destination}...</p>
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
      <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">AI Destination Analysis</h3>
            <p className="text-blue-100">Intelligent insights for {destination}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Best Time to Visit */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-blue-600" />
            Best Time to Visit
          </h4>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-gray-700">{analysis.bestTimeToVisit}</p>
          </div>
        </div>

        {/* Local Cuisine */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-orange-600" />
            Local Cuisine
          </h4>
          <div className="space-y-2">
            {analysis.localCuisine.map((item: string, index: number) => (
              <div key={index} className="p-3 bg-orange-50 rounded-lg border border-orange-100">
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Cultural Insights */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Users className="w-5 h-5 mr-2 text-purple-600" />
            Cultural Insights
          </h4>
          <div className="space-y-2">
            {analysis.culturalInsights.map((insight: string, index: number) => (
              <div key={index} className="p-3 bg-purple-50 rounded-lg border border-purple-100">
                <p className="text-gray-700 text-sm">{insight}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Hidden Gems */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Star className="w-5 h-5 mr-2 text-yellow-600" />
            Hidden Gems
          </h4>
          <div className="space-y-2">
            {analysis.hiddenGems.map((gem: string, index: number) => (
              <div key={index} className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                <p className="text-gray-700 text-sm">{gem}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Transportation Tips */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Zap className="w-5 h-5 mr-2 text-green-600" />
            Transportation Tips
          </h4>
          <div className="p-4 bg-green-50 rounded-xl border border-green-100">
            <p className="text-gray-700">{analysis.transportationTips}</p>
          </div>
        </div>

        {/* Safety Info */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-red-600" />
            Safety Information
          </h4>
          <div className="p-4 bg-red-50 rounded-xl border border-red-100">
            <p className="text-gray-700">{analysis.safetyInfo}</p>
          </div>
        </div>

        {/* Packing Recommendations */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <Suitcase className="w-5 h-5 mr-2 text-indigo-600" />
            Packing Recommendations
          </h4>
          <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100">
            <p className="text-gray-700">{analysis.packingRecommendations}</p>
          </div>
        </div>

        {/* Language Tips */}
        <div className="mb-6">
          <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-pink-600" />
            Language Tips
          </h4>
          <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
            <p className="text-gray-700">{analysis.languageTips}</p>
          </div>
        </div>

        {/* AI Powered Badge */}
        <div className="text-center">
          <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-green-600 rounded-full text-white text-sm">
            <Brain className="w-4 h-4 mr-2" />
            Powered by AI Destination Analysis
          </div>
        </div>
      </div>
    </div>
  );
}

// Import missing components
function Shield(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function Suitcase(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V3.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.5V7" />
      <path d="M6 21V7" />
      <path d="M18 21V7" />
    </svg>
  );
}

function MessageSquare(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
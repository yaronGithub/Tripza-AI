import React from 'react';
import { Lightbulb, MapPin, Camera, Wallet, Shield, Clock, Users, Star } from 'lucide-react';

interface TravelTipsProps {
  destination: string;
  preferences: string[];
  className?: string;
}

export function TravelTips({ destination, preferences, className = '' }: TravelTipsProps) {
  const generateTips = () => {
    const baseTips = [
      {
        icon: <MapPin className="w-5 h-5" />,
        title: 'Navigation',
        tip: 'Download offline maps before exploring to avoid data charges',
        color: 'from-blue-500 to-cyan-500',
        bgColor: 'from-blue-50 to-cyan-50'
      },
      {
        icon: <Camera className="w-5 h-5" />,
        title: 'Photography',
        tip: 'Golden hour (sunrise/sunset) provides the best lighting for photos',
        color: 'from-yellow-500 to-orange-500',
        bgColor: 'from-yellow-50 to-orange-50'
      },
      {
        icon: <Wallet className="w-5 h-5" />,
        title: 'Budget',
        tip: 'Carry both cash and cards - some places only accept one or the other',
        color: 'from-green-500 to-emerald-500',
        bgColor: 'from-green-50 to-emerald-50'
      },
      {
        icon: <Shield className="w-5 h-5" />,
        title: 'Safety',
        tip: 'Keep copies of important documents in separate locations',
        color: 'from-red-500 to-pink-500',
        bgColor: 'from-red-50 to-pink-50'
      },
      {
        icon: <Clock className="w-5 h-5" />,
        title: 'Timing',
        tip: 'Visit popular attractions early morning or late afternoon to avoid crowds',
        color: 'from-purple-500 to-indigo-500',
        bgColor: 'from-purple-50 to-indigo-50'
      },
      {
        icon: <Users className="w-5 h-5" />,
        title: 'Local Culture',
        tip: 'Learn basic local phrases - locals appreciate the effort',
        color: 'from-teal-500 to-blue-500',
        bgColor: 'from-teal-50 to-blue-50'
      }
    ];

    // Add preference-specific tips
    const preferenceTips: Record<string, any> = {
      'Museums & Galleries': {
        icon: <Star className="w-5 h-5" />,
        title: 'Museum Tips',
        tip: 'Many museums offer free admission on certain days - check their websites',
        color: 'from-indigo-500 to-purple-500',
        bgColor: 'from-indigo-50 to-purple-50'
      },
      'Restaurants & Foodie Spots': {
        icon: <Star className="w-5 h-5" />,
        title: 'Dining Tips',
        tip: 'Try local specialties and ask locals for restaurant recommendations',
        color: 'from-orange-500 to-red-500',
        bgColor: 'from-orange-50 to-red-50'
      },
      'Parks & Nature': {
        icon: <Star className="w-5 h-5" />,
        title: 'Nature Tips',
        tip: 'Wear comfortable shoes and bring water for outdoor activities',
        color: 'from-green-500 to-teal-500',
        bgColor: 'from-green-50 to-teal-50'
      }
    };

    const tips = [...baseTips];
    preferences.forEach(pref => {
      if (preferenceTips[pref]) {
        tips.push(preferenceTips[pref]);
      }
    });

    return tips.slice(0, 6); // Limit to 6 tips
  };

  const tips = generateTips();

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Smart Travel Tips</h3>
            <p className="text-amber-100 text-sm">AI-curated advice for {destination}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, index) => (
            <div
              key={index}
              className={`p-4 bg-gradient-to-br ${tip.bgColor} rounded-xl border border-gray-200 hover-lift transition-all duration-300 group`}
            >
              <div className="flex items-start">
                <div className={`w-10 h-10 bg-gradient-to-r ${tip.color} rounded-xl flex items-center justify-center text-white mr-3 group-hover:scale-110 transition-transform duration-300`}>
                  {tip.icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{tip.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tip */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl text-white">
          <div className="flex items-center mb-2">
            <Star className="w-5 h-5 mr-2" />
            <span className="font-semibold">Pro Tip</span>
          </div>
          <p className="text-sm text-purple-100">
            Use Tripza AI's route optimization to save 2-3 hours of travel time per day. 
            Our AI clusters attractions geographically for maximum efficiency!
          </p>
        </div>
      </div>
    </div>
  );
}
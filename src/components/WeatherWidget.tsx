import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Thermometer, Eye, Droplets } from 'lucide-react';

interface WeatherWidgetProps {
  destination: string;
  dates: string[];
  className?: string;
}

export function WeatherWidget({ destination, dates, className = '' }: WeatherWidgetProps) {
  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateWeatherData();
  }, [destination, dates]);

  const generateWeatherData = async () => {
    setLoading(true);
    
    // Simulate weather API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const weatherData = dates.map((date, index) => ({
      date,
      temp: Math.floor(Math.random() * 15) + 15, // 15-30°C
      condition: ['sunny', 'partly-cloudy', 'cloudy', 'rainy'][Math.floor(Math.random() * 4)],
      humidity: Math.floor(Math.random() * 30) + 40, // 40-70%
      windSpeed: Math.floor(Math.random() * 10) + 5, // 5-15 km/h
      visibility: Math.floor(Math.random() * 5) + 8, // 8-12 km
      precipitation: Math.floor(Math.random() * 20) // 0-20%
    }));

    setWeather(weatherData);
    setLoading(false);
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'sunny': return <Sun className="w-6 h-6 text-yellow-500" />;
      case 'partly-cloudy': return <Cloud className="w-6 h-6 text-gray-500" />;
      case 'cloudy': return <Cloud className="w-6 h-6 text-gray-600" />;
      case 'rainy': return <CloudRain className="w-6 h-6 text-blue-500" />;
      default: return <Sun className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'sunny': return 'from-yellow-50 to-orange-50 border-yellow-200';
      case 'partly-cloudy': return 'from-gray-50 to-blue-50 border-gray-200';
      case 'cloudy': return 'from-gray-50 to-slate-50 border-gray-300';
      case 'rainy': return 'from-blue-50 to-cyan-50 border-blue-200';
      default: return 'from-yellow-50 to-orange-50 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 p-6 ${className}`}>
        <div className="flex items-center mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Weather Forecast</h3>
            <p className="text-sm text-gray-600">Loading weather data...</p>
          </div>
        </div>
        
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-16 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Weather Forecast</h3>
            <p className="text-blue-100 text-sm">{destination}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {weather?.map((day: any, index: number) => (
            <div
              key={index}
              className={`p-4 bg-gradient-to-r ${getConditionColor(day.condition)} rounded-xl border hover-lift transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="mr-4">
                    {getWeatherIcon(day.condition)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      Day {index + 1}
                    </div>
                    <div className="text-sm text-gray-600 capitalize">
                      {day.condition.replace('-', ' ')}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {day.temp}°C
                  </div>
                  <div className="text-xs text-gray-600">
                    {day.precipitation}% rain
                  </div>
                </div>
              </div>
              
              {/* Additional Details */}
              <div className="grid grid-cols-3 gap-4 mt-3 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Droplets className="w-3 h-3 text-blue-500 mr-1" />
                    <span className="text-xs text-gray-600">{day.humidity}%</span>
                  </div>
                  <div className="text-xs text-gray-500">Humidity</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Wind className="w-3 h-3 text-gray-500 mr-1" />
                    <span className="text-xs text-gray-600">{day.windSpeed} km/h</span>
                  </div>
                  <div className="text-xs text-gray-500">Wind</div>
                </div>
                
                <div className="text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Eye className="w-3 h-3 text-green-500 mr-1" />
                    <span className="text-xs text-gray-600">{day.visibility} km</span>
                  </div>
                  <div className="text-xs text-gray-500">Visibility</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Weather Tips */}
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <h4 className="text-sm font-semibold text-purple-800 mb-2">Weather Tips</h4>
          <ul className="text-xs text-purple-700 space-y-1">
            <li>• Pack layers for temperature changes</li>
            <li>• Bring an umbrella for potential rain</li>
            <li>• Comfortable walking shoes recommended</li>
            <li>• Check weather updates before heading out</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
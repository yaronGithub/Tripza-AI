import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Sparkles, MapPin, Calendar, Clock, Star, Lightbulb, List, Compass } from 'lucide-react';
import { openaiService } from '../services/openaiService';
import { Trip } from '../types';
import { useTrips } from '../hooks/useTrips';
import { useAuth } from '../hooks/useAuth';

interface AITravelCompanionProps {
  trip?: Trip;
  className?: string;
}

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  suggestions?: string[];
}

export function AITravelCompanion({ trip, className = '' }: AITravelCompanionProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showTripSelector, setShowTripSelector] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState<string | undefined>(trip?.id);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { trips } = useTrips(user?.id);

  useEffect(() => {
    // Initialize with a welcome message
    if (trip) {
      setSelectedTripId(trip.id);
      const welcomeMessage: Message = {
        id: 'welcome',
        type: 'ai',
        content: `Hi! I'm your AI Travel Companion for your ${trip.destination} trip! I've analyzed your itinerary and I'm here to help you make the most of your adventure. What would you like to know about your trip?`,
        timestamp: new Date(),
        suggestions: [
          'Tell me about my itinerary',
          'What should I pack?',
          'Give me local tips',
          'How can I optimize my route?',
          'What are the best photo spots?'
        ]
      };
      setMessages([welcomeMessage]);
    } else {
      const generalWelcome: Message = {
        id: 'general-welcome',
        type: 'ai',
        content: `Hello! I'm your AI Travel Companion. I can help you plan trips, answer travel questions, and provide personalized recommendations. What destination are you thinking about?`,
        timestamp: new Date(),
        suggestions: [
          'Help me plan a trip to Paris',
          'What are the best travel apps?',
          'Give me packing tips',
          'How do I find cheap flights?',
          'What should I know about travel insurance?'
        ]
      };
      setMessages([generalWelcome]);
    }
  }, [trip]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      // Get the current trip context
      const currentTrip = selectedTripId 
        ? trips.find(t => t.id === selectedTripId) || trip 
        : trip;

      const aiResponse = await openaiService.generateTravelCompanionResponse(message, currentTrip);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: "I'm having trouble connecting right now. Let me give you some general travel advice instead! What specific aspect of your trip would you like help with?",
        timestamp: new Date(),
        suggestions: [
          'Best time to visit',
          'Local customs',
          'Transportation tips',
          'Food recommendations'
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const handleTripSelect = (tripId: string) => {
    const selectedTrip = trips.find(t => t.id === tripId);
    if (selectedTrip) {
      setSelectedTripId(tripId);
      
      const tripChangeMessage: Message = {
        id: Date.now().toString(),
        type: 'ai',
        content: `I'm now focusing on your "${selectedTrip.title || `Trip to ${selectedTrip.destination}`}" itinerary. What would you like to know about this trip?`,
        timestamp: new Date(),
        suggestions: [
          'Analyze this itinerary',
          'What should I pack?',
          'Local tips for this trip',
          'Best time to visit attractions'
        ]
      };
      
      setMessages(prev => [...prev, tripChangeMessage]);
    }
    
    setShowTripSelector(false);
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4 pulse-glow">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">AI Travel Companion</h3>
              <p className="text-blue-100">Your intelligent travel assistant</p>
            </div>
          </div>
          
          {/* Trip Selector Button */}
          {trips.length > 0 && (
            <button 
              onClick={() => setShowTripSelector(!showTripSelector)}
              className="p-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              title="Select a trip to discuss"
            >
              <List className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Trip Selector Dropdown */}
        {showTripSelector && (
          <div className="mt-4 bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-semibold text-gray-700">Select a trip to discuss</h4>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {trips.length > 0 ? (
                <div className="divide-y divide-gray-100">
                  {trips.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => handleTripSelect(t.id)}
                      className={`w-full text-left p-3 hover:bg-blue-50 transition-colors ${
                        selectedTripId === t.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="font-medium text-gray-900">{t.title || `Trip to ${t.destination}`}</div>
                      <div className="text-xs text-gray-600 flex items-center mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span>{t.destination}</span>
                        <span className="mx-1">•</span>
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{new Date(t.startDate).toLocaleDateString()}</span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  <p>No saved trips found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs lg:max-w-md ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-2 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`rounded-2xl px-4 py-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  <p className={`text-xs mt-2 ${
                    message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>

              {/* Suggestions */}
              {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="block w-full text-left px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors border border-blue-200"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 text-white flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-gray-100 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 p-4">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputMessage);
          }}
          className="flex space-x-3"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything about your trip..."
            className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Quick Actions */}
        <div className="mt-3 flex flex-wrap gap-2">
          {selectedTripId && (
            <>
              <button
                onClick={() => handleSendMessage('Analyze my itinerary')}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
              >
                <Lightbulb className="w-3 h-3 inline mr-1" />
                Analyze Trip
              </button>
              <button
                onClick={() => handleSendMessage('Give me local tips')}
                className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs hover:bg-green-200 transition-colors"
              >
                <MapPin className="w-3 h-3 inline mr-1" />
                Local Tips
              </button>
              <button
                onClick={() => handleSendMessage('Optimize my schedule')}
                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs hover:bg-blue-200 transition-colors"
              >
                <Clock className="w-3 h-3 inline mr-1" />
                Optimize
              </button>
            </>
          )}
          {trips.length > 0 && !selectedTripId && (
            <button
              onClick={() => setShowTripSelector(true)}
              className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs hover:bg-orange-200 transition-colors"
            >
              <Compass className="w-3 h-3 inline mr-1" />
              Select a Trip
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
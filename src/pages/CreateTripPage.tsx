import React, { useState } from 'react';
import { AITripGenerator } from '../components/AITripGenerator';
import { EnhancedItineraryDisplay } from '../components/EnhancedItineraryDisplay';
import { AuthModal } from '../components/AuthModal';
import { TripFormData, Trip } from '../types';
import { generateItinerary } from '../utils/itinerary';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { useAttractions } from '../hooks/useAttractions';
import { useToast } from '../components/NotificationToast';
import { openaiService } from '../services/openaiService';
import { AIDestinationAnalysis } from '../components/AIDestinationAnalysis';
import { AICuisineGuide } from '../components/AICuisineGuide';
import { AILanguageAssistant } from '../components/AILanguageAssistant';
import { AIPhotoGenerator } from '../components/AIPhotoGenerator';
import { AICustomItinerary } from '../components/AICustomItinerary';
import { AITravelCompanion } from '../components/AITravelCompanion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { Brain, Utensils, Globe, Camera, Lightbulb, MessageCircle } from 'lucide-react';

export function CreateTripPage() {
  const [currentTrip, setCurrentTrip] = useState<Trip | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [saveLoading, setSaveLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');

  const { user } = useAuth();
  const { saveTrip } = useTrips(user?.id);
  const { searchAttractions } = useAttractions();
  const { showSuccess, showError, showInfo } = useToast();

  const handleFormSubmit = async (formData: TripFormData) => {
    setIsLoading(true);
    
    try {
      showInfo('AI Planning Started', `Creating your personalized ${formData.destination} experience with advanced AI...`);
      
      // Calculate trip duration
      const daysCount = Math.ceil((new Date(formData.endDate).getTime() - new Date(formData.startDate).getTime()) / (1000 * 3600 * 24)) + 1;
      
      // Generate AI-enhanced trip content and search attractions in parallel
      const [tripTitle, tripDescription, availableAttractions] = await Promise.all([
        openaiService.optimizeTripTitle(formData.destination, formData.preferences, daysCount),
        openaiService.generateTripDescription(formData.destination, formData.preferences, daysCount),
        searchAttractions(formData.destination, formData.preferences)
      ]);
      
      if (availableAttractions.length === 0) {
        showError('No Attractions Found', `We couldn't find attractions for ${formData.destination}. Please try a different destination.`);
        return;
      }

      showInfo('AI Enhancement', `Enhancing ${availableAttractions.length} attractions with personalized AI descriptions...`);
      
      // Enhance attraction descriptions with AI
      const enhancedAttractions = await openaiService.generateSmartAttractionDescriptions(
        availableAttractions, 
        formData.destination, 
        formData.preferences
      );
      
      showInfo('Route Optimization', `Using AI to create the perfect ${daysCount}-day itinerary with intelligent route optimization...`);
      
      // Generate optimized itinerary
      const itinerary = generateItinerary(formData, enhancedAttractions);
      
      if (itinerary.length === 0) {
        showError('Generation Failed', 'Failed to generate itinerary. Please try different dates or preferences.');
        return;
      }

      // Generate AI travel tips for the destination
      const travelTips = await openaiService.generateTravelTips(
        formData.destination, 
        formData.preferences, 
        daysCount
      );

      const newTrip: Trip = {
        id: Date.now().toString(),
        destination: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        preferences: formData.preferences,
        itinerary,
        isPublic: false,
        userId: user?.id || 'anonymous',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        title: tripTitle,
        description: tripDescription,
        aiTravelTips: travelTips
      };

      setCurrentTrip(newTrip);
      
      const totalAttractions = itinerary.reduce((sum, day) => sum + day.attractions.length, 0);
      const enhancedCount = enhancedAttractions.filter(a => a.aiEnhanced).length;
      
      showSuccess(
        'AI Trip Generated!', 
        `Your personalized ${itinerary.length}-day adventure with ${totalAttractions} attractions is ready! ${enhancedCount} descriptions enhanced by AI.`
      );
    } catch (error) {
      console.error('Error generating itinerary:', error);
      showError('Generation Failed', 'Failed to generate itinerary. Please try again or contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = async () => {
    if (!currentTrip) return;

    if (!user) {
      setShowAuthModal(true);
      return;
    }

    setSaveLoading(true);
    try {
      await saveTrip(currentTrip);
      showSuccess('Trip Saved!', 'Your AI-generated trip has been saved to your account.');
    } catch (error) {
      console.error('Error saving trip:', error);
      showError('Save Failed', 'Failed to save trip. Please try again.');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleEditTrip = () => {
    setCurrentTrip(null);
  };

  const handleTripUpdate = (updatedTrip: Trip) => {
    setCurrentTrip(updatedTrip);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      {currentTrip ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Trip Display */}
          <div className="lg:col-span-2">
            <EnhancedItineraryDisplay
              trip={currentTrip}
              onEdit={handleEditTrip}
              onSave={handleSaveTrip}
              saveLoading={saveLoading}
              onTripUpdate={handleTripUpdate}
            />
          </div>
          
          {/* AI Travel Companion Sidebar */}
          <div className="lg:col-span-1">
            <AITravelCompanion trip={currentTrip} className="sticky top-8" />
          </div>
        </div>
      ) : (
        <div>
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              AI-Powered Travel Planning
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Experience the future of travel planning. Our advanced AI creates personalized itineraries with Google Maps integration, 
              real-time optimization, and intelligent recommendations tailored to your unique interests and travel style.
            </p>
          </div>

          {/* Tabs for different AI tools */}
          <div className="max-w-6xl mx-auto mb-12">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-6 mb-8">
                <TabsTrigger value="generator" className="flex items-center">
                  <Brain className="w-5 h-5 mr-2" />
                  <span>Trip Generator</span>
                </TabsTrigger>
                <TabsTrigger value="companion" className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>AI Companion</span>
                </TabsTrigger>
                <TabsTrigger value="destination" className="flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  <span>Destination Guide</span>
                </TabsTrigger>
                <TabsTrigger value="cuisine" className="flex items-center">
                  <Utensils className="w-5 h-5 mr-2" />
                  <span>Cuisine Guide</span>
                </TabsTrigger>
                <TabsTrigger value="language" className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
                  <span>Language Assistant</span>
                </TabsTrigger>
                <TabsTrigger value="photos" className="flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  <span>Photo Generator</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="generator">
                <AITripGenerator onTripGenerated={handleFormSubmit} isLoading={isLoading} />
              </TabsContent>
              
              <TabsContent value="companion">
                <AITravelCompanion />
              </TabsContent>
              
              <TabsContent value="destination">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <AIDestinationAnalysis 
                    destination="Paris" 
                    preferences={['Art & Culture', 'Historical Sites', 'Restaurants & Foodie Spots']} 
                  />
                  <AICustomItinerary 
                    destination="Paris" 
                    preferences={['Art & Culture', 'Historical Sites', 'Restaurants & Foodie Spots']} 
                    duration={3}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="cuisine">
                <AICuisineGuide 
                  destination="Paris" 
                  preferences={['Restaurants & Foodie Spots']} 
                />
              </TabsContent>
              
              <TabsContent value="language">
                <AILanguageAssistant destination="Paris" />
              </TabsContent>
              
              <TabsContent value="photos">
                <AIPhotoGenerator 
                  destination="Paris" 
                  preferences={['Art & Culture', 'Historical Sites']} 
                />
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Enhanced Benefits Section */}
          <div className="mt-16 max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Tripza AI is Revolutionary</h2>
              <p className="text-lg text-gray-600">The world's first truly intelligent travel planning platform</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <span className="text-3xl">🤖</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Real AI Intelligence</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  OpenAI GPT-4o-mini powers personalized descriptions, smart recommendations, and intelligent content creation
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <span className="text-3xl">🗺️</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Maps Integration</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Real photos, professional directions, traffic data, and street view for the ultimate navigation experience
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <span className="text-3xl">⚡</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Complete personalized itineraries generated in under 30 seconds with advanced route optimization
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-2xl shadow-lg border border-gray-100 hover-lift">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center pulse-glow">
                  <span className="text-3xl">🌍</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Global Coverage</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Plan trips to any destination worldwide with real attraction data, local insights, and cultural recommendations
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
}

// Import missing component
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
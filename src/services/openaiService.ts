interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

interface TripAnalysis {
  personalityType: string;
  travelStyle: string;
  recommendations: string[];
  budgetTips: string[];
  localInsights: string[];
}

interface TravelCompanionResponse {
  content: string;
  suggestions: string[];
}

class OpenAIService {
  private apiKey: string | undefined;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  }

  async generateTravelCompanionResponse(userMessage: string, trip?: any): Promise<TravelCompanionResponse> {
    if (!this.apiKey) {
      return this.generateFallbackCompanionResponse(userMessage, trip);
    }

    try {
      const tripContext = trip ? `
        Current trip context:
        - Destination: ${trip.destination}
        - Duration: ${trip.itinerary?.length || 'Unknown'} days
        - Interests: ${trip.preferences?.join(', ') || 'General sightseeing'}
        - Attractions planned: ${trip.itinerary?.reduce((sum: number, day: any) => sum + (day.attractions?.length || 0), 0) || 0}
      ` : 'No specific trip context available.';

      const prompt = `You are an enthusiastic, knowledgeable AI travel companion. The user said: "${userMessage}"

      ${tripContext}

      Respond as a helpful travel expert who:
      - Provides specific, actionable advice
      - Shows enthusiasm for travel
      - Offers practical tips and insights
      - Suggests follow-up questions or actions
      - Keeps responses conversational and engaging
      - Focuses on enhancing the travel experience

      Provide your response in JSON format with:
      - content: Your main response (keep it conversational, max 150 words)
      - suggestions: Array of 3-4 follow-up questions/actions the user might want to ask

      Make it personal and helpful!`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert travel companion AI who provides personalized, enthusiastic, and practical travel advice. Always respond with valid JSON containing content and suggestions fields.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        const parsed = JSON.parse(content);
        return {
          content: parsed.content || "I'm here to help with your travel plans! What would you like to know?",
          suggestions: parsed.suggestions || ['Tell me more', 'Give me tips', 'What else should I know?']
        };
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return this.generateFallbackCompanionResponse(userMessage, trip);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackCompanionResponse(userMessage, trip);
    }
  }

  private generateFallbackCompanionResponse(userMessage: string, trip?: any): TravelCompanionResponse {
    const message = userMessage.toLowerCase();
    
    if (message.includes('itinerary') || message.includes('plan')) {
      return {
        content: trip 
          ? `Your ${trip.destination} itinerary looks great! You have ${trip.itinerary?.length || 0} days planned with ${trip.itinerary?.reduce((sum: number, day: any) => sum + (day.attractions?.length || 0), 0) || 0} attractions. The route is optimized to minimize travel time between locations.`
          : "I'd love to help you plan an itinerary! What destination are you thinking about?",
        suggestions: trip 
          ? ['How can I optimize my route?', 'What should I pack?', 'Give me local dining tips', 'Best photo spots?']
          : ['Plan a trip to Paris', 'Plan a trip to Tokyo', 'Plan a trip to New York', 'Help me choose a destination']
      };
    }

    if (message.includes('pack') || message.includes('bring')) {
      return {
        content: trip
          ? `For your ${trip.destination} trip, pack comfortable walking shoes, weather-appropriate clothing, and a portable charger. Check the local weather forecast before you go!`
          : "Packing smart is key to a great trip! The essentials include comfortable shoes, weather-appropriate clothes, and important documents.",
        suggestions: ['What about electronics?', 'Local weather tips', 'Cultural dress codes', 'Travel insurance advice']
      };
    }

    if (message.includes('tip') || message.includes('advice')) {
      return {
        content: trip
          ? `Here's a pro tip for ${trip.destination}: Visit popular attractions early morning or late afternoon to avoid crowds. Also, try to learn a few basic phrases in the local language - locals appreciate the effort!`
          : "Here's a universal travel tip: Always keep digital and physical copies of important documents, and notify your bank about travel plans to avoid card issues!",
        suggestions: ['More local tips', 'Transportation advice', 'Cultural etiquette', 'Money-saving tips']
      };
    }

    if (message.includes('food') || message.includes('eat') || message.includes('restaurant')) {
      return {
        content: trip
          ? `${trip.destination} has amazing local cuisine! I recommend trying authentic local dishes at neighborhood restaurants rather than tourist areas. Food markets are also great for experiencing local flavors.`
          : "Food is one of the best parts of traveling! Always try local specialties, visit food markets, and don't be afraid to eat where the locals eat.",
        suggestions: ['Best local dishes', 'Food safety tips', 'Dietary restrictions help', 'Street food recommendations']
      };
    }

    // Default response
    return {
      content: "I'm your AI travel companion, here to make your trip amazing! I can help with planning, local tips, packing advice, and answering any travel questions you have.",
      suggestions: ['Plan a new trip', 'Get packing tips', 'Local recommendations', 'Travel safety advice']
    };
  }

  async generateTripDescription(destination: string, preferences: string[], duration: number): Promise<string> {
    if (!this.apiKey) {
      return this.generateFallbackDescription(destination, preferences, duration);
    }

    try {
      const prompt = `Create an engaging, personalized trip description for a ${duration}-day trip to ${destination}. 
      The traveler is interested in: ${preferences.join(', ')}.
      
      Make it inspiring and specific to their interests. Keep it under 150 words and focus on what makes this trip special.
      Don't use generic language - be specific about ${destination} and the chosen interests.
      Include emotional language that makes them excited about the journey.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a travel expert who creates personalized, engaging trip descriptions that inspire travelers. Write in an enthusiastic, personal tone that makes people excited about their upcoming adventure.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || this.generateFallbackDescription(destination, preferences, duration);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackDescription(destination, preferences, duration);
    }
  }

  async generateSmartAttractionDescriptions(attractions: any[], destination: string, userPreferences: string[]): Promise<any[]> {
    if (!this.apiKey) {
      return attractions;
    }

    try {
      const enhancedAttractions = await Promise.all(
        attractions.map(async (attraction) => {
          const prompt = `Write a compelling, personalized description for ${attraction.name} in ${destination}. 
          The visitor is interested in: ${userPreferences.join(', ')}.
          
          Make it specific to their interests, highlighting aspects they'd find most appealing.
          Include insider tips, best times to visit, and what makes this place special.
          Keep it engaging and under 100 words.
          
          Current description: ${attraction.description}`;

          const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content: 'You are a local travel guide with deep knowledge of attractions. Write personalized, engaging descriptions that help travelers understand why they should visit and what to expect.'
                },
                {
                  role: 'user',
                  content: prompt
                }
              ],
              max_tokens: 150,
              temperature: 0.7,
            }),
          });

          if (response.ok) {
            const data: OpenAIResponse = await response.json();
            const enhancedDescription = data.choices[0]?.message?.content;
            if (enhancedDescription) {
              return {
                ...attraction,
                description: enhancedDescription,
                aiEnhanced: true
              };
            }
          }
          
          return attraction;
        })
      );

      return enhancedAttractions;
    } catch (error) {
      console.error('Error enhancing attraction descriptions:', error);
      return attractions;
    }
  }

  async generateTravelTips(destination: string, preferences: string[], duration: number): Promise<string[]> {
    if (!this.apiKey) {
      return this.generateFallbackTips(destination, preferences);
    }

    try {
      const prompt = `Generate 5 specific, actionable travel tips for a ${duration}-day trip to ${destination}.
      The traveler is interested in: ${preferences.join(', ')}.
      
      Make tips practical, insider knowledge that locals would know.
      Include specific recommendations for transportation, timing, local customs, and hidden gems.
      Each tip should be 1-2 sentences and immediately useful.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a seasoned local travel expert who knows insider secrets and practical tips that make trips amazing. Provide specific, actionable advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.6,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      const tips = content.split('\n').filter(line => line.trim().length > 0);
      
      return tips.length > 0 ? tips : this.generateFallbackTips(destination, preferences);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackTips(destination, preferences);
    }
  }

  async analyzeTravelPersonality(userTrips: any[], preferences: string[]): Promise<TripAnalysis> {
    if (!this.apiKey) {
      return this.generateFallbackAnalysis(preferences);
    }

    try {
      const tripSummary = userTrips.map(trip => 
        `${trip.destination} (${trip.preferences?.join(', ') || 'general'})`
      ).join('; ');

      const prompt = `Analyze this traveler's personality and style based on their trip history and preferences:
      
      Trip History: ${tripSummary}
      Current Preferences: ${preferences.join(', ')}
      
      Provide a JSON response with:
      - personalityType: One of "Explorer", "Culturalist", "Adventurer", "Relaxer", "Foodie", "Social"
      - travelStyle: Brief description of their travel approach
      - recommendations: 3 specific recommendations for future trips
      - budgetTips: 3 money-saving tips based on their style
      - localInsights: 3 ways to connect with local culture
      
      Make it personal and insightful.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a travel psychology expert who analyzes travel patterns to provide personalized insights. Always respond with valid JSON.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 400,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        const analysis = JSON.parse(content);
        return analysis;
      } catch (parseError) {
        console.error('Error parsing AI analysis:', parseError);
        return this.generateFallbackAnalysis(preferences);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackAnalysis(preferences);
    }
  }

  async analyzeDestination(destination: string, preferences: string[]): Promise<any> {
    if (!this.apiKey) {
      return this.generateFallbackDestinationAnalysis(destination);
    }

    try {
      const prompt = `Provide a comprehensive travel analysis for ${destination} focused on these interests: ${preferences.join(', ')}.
      
      Return a JSON object with these fields:
      - bestTimeToVisit: When to go and why
      - localCuisine: Array of 3 must-try foods or dining experiences
      - culturalInsights: Array of 3 important cultural norms or practices
      - hiddenGems: Array of 3 off-the-beaten-path attractions locals love
      - transportationTips: Best ways to get around
      - safetyInfo: Important safety information
      - packingRecommendations: What to bring based on climate and activities
      - languageTips: Essential phrases or communication advice
      
      Make it specific, practical, and focused on ${destination}.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a destination expert with deep local knowledge of cities worldwide. Provide specific, practical information that helps travelers have an authentic experience.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        const analysis = JSON.parse(content);
        return analysis;
      } catch (parseError) {
        console.error('Error parsing destination analysis:', parseError);
        return this.generateFallbackDestinationAnalysis(destination);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackDestinationAnalysis(destination);
    }
  }

  async generateCustomItinerary(destination: string, preferences: string[], duration: number, specialRequests: string): Promise<any> {
    if (!this.apiKey) {
      return null;
    }

    try {
      const prompt = `Create a personalized ${duration}-day itinerary for ${destination} focused on these interests: ${preferences.join(', ')}.
      
      Special requests: ${specialRequests}
      
      For each day, provide:
      - Day number and theme
      - Morning activities (2-3 specific attractions)
      - Afternoon activities (2-3 specific attractions)
      - Evening activities (1-2 specific attractions or dining)
      - Local tips for that day
      
      Make it realistic, considering geography and travel time between attractions.
      Include specific attraction names, not generic activities.
      Focus on the traveler's interests and special requests.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are an expert travel planner who creates detailed, personalized itineraries. You know the geography of destinations worldwide and can create realistic daily plans that minimize travel time and maximize experiences.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 1000,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI API error:', error);
      return null;
    }
  }

  async generateSocialPostCaption(trip: any, photos: string[]): Promise<string> {
    if (!this.apiKey) {
      return `Just completed an amazing trip to ${trip.destination}! ${trip.preferences?.join(' ') || ''} #TripzaAI #Travel`;
    }

    try {
      const prompt = `Create an engaging social media caption for a trip to ${trip.destination}.
      Trip details: ${trip.title || 'Amazing Adventure'}
      Interests: ${trip.preferences?.join(', ') || 'sightseeing'}
      Duration: ${trip.itinerary?.length || 3} days
      
      Make it personal, exciting, and include relevant hashtags.
      Mention specific highlights that would make others want to visit.
      Keep it under 200 characters and include emojis.
      End with #TripzaAI #SmartTravel`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a social media expert who creates engaging, authentic travel posts that inspire others to explore.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || `Amazing trip to ${trip.destination}! #TripzaAI #SmartTravel`;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return `Just explored ${trip.destination} with AI-powered planning! Every moment was perfectly optimized ✨ #TripzaAI #SmartTravel`;
    }
  }

  async optimizeTripTitle(destination: string, preferences: string[], duration: number): Promise<string> {
    if (!this.apiKey) {
      return `${duration}-Day ${destination} Adventure`;
    }

    try {
      const prompt = `Create a catchy, specific trip title for a ${duration}-day trip to ${destination} focusing on: ${preferences.join(', ')}.
      
      Make it engaging and specific. Examples:
      - "Paris Art & Culture Immersion"
      - "Tokyo Foodie & Temple Discovery"
      - "San Francisco Nature & History Explorer"
      
      Keep it under 6 words and avoid generic terms like "trip" or "vacation".
      Make it sound like an exciting adventure.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a creative travel marketing expert who creates memorable trip titles that capture the essence of an adventure.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 50,
          temperature: 0.8,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const title = data.choices[0]?.message?.content?.trim() || '';
      
      return title.length > 0 ? title : `${duration}-Day ${destination} Adventure`;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return `${duration}-Day ${destination} Adventure`;
    }
  }

  async generateWeatherAdvice(destination: string, dates: string[]): Promise<string> {
    if (!this.apiKey) {
      return `Check the weather forecast for ${destination} and pack accordingly. Bring layers for temperature changes.`;
    }

    try {
      const month = new Date(dates[0]).toLocaleDateString('en-US', { month: 'long' });
      const prompt = `Provide weather advice for visiting ${destination} in ${month}.
      Include what to pack, best times of day for activities, and any weather-related tips.
      Keep it practical and specific to the destination and season.
      Limit to 2-3 sentences.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a weather-savvy travel advisor who provides practical, location-specific advice.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 100,
          temperature: 0.5,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0]?.message?.content || `Pack layers for ${destination} in ${month}. Check local weather before departure.`;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return `Check the weather forecast for ${destination} and pack accordingly for the season.`;
    }
  }

  async generateLocalCuisineGuide(destination: string, preferences: string[]): Promise<any> {
    if (!this.apiKey) {
      return this.generateFallbackCuisineGuide(destination);
    }

    try {
      const prompt = `Create a local cuisine guide for ${destination}.
      
      Return a JSON object with:
      - mustTryDishes: Array of 5 must-try local dishes with brief descriptions
      - bestRestaurants: Array of 3 recommended restaurants (name, specialty, price range)
      - foodMarkets: Array of 2 local food markets or street food areas
      - diningTips: 3 local dining customs or tips
      - dietaryOptions: Information for travelers with dietary restrictions
      
      Make it specific to ${destination} with authentic local recommendations.`;

      const response = await fetch(`${this.baseURL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are a culinary expert with deep knowledge of local cuisines worldwide. Provide authentic, specific food recommendations that travelers would not find in typical tourist guides.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      
      try {
        return JSON.parse(content);
      } catch (parseError) {
        console.error('Error parsing cuisine guide:', parseError);
        return this.generateFallbackCuisineGuide(destination);
      }
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackCuisineGuide(destination);
    }
  }

  private generateFallbackDescription(destination: string, preferences: string[], duration: number): string {
    const preferenceText = preferences.length > 0 ? preferences.join(', ').toLowerCase() : 'sightseeing';
    
    return `Discover the best of ${destination} on this carefully crafted ${duration}-day journey. Experience authentic ${preferenceText} while exploring the city's most captivating attractions. This personalized itinerary combines must-see landmarks with hidden gems, optimized for maximum enjoyment and minimal travel time. Perfect for travelers who want to make the most of their time in ${destination}.`;
  }

  private generateFallbackTips(destination: string, preferences: string[]): string[] {
    return [
      `Download offline maps for ${destination} to navigate without data charges`,
      `Visit popular attractions early morning or late afternoon to avoid crowds`,
      `Try local transportation options for an authentic experience`,
      `Learn a few basic phrases in the local language`,
      `Pack comfortable walking shoes for exploring`
    ];
  }

  private generateFallbackAnalysis(preferences: string[]): TripAnalysis {
    const primaryInterest = preferences[0] || 'general travel';
    
    return {
      personalityType: 'Explorer',
      travelStyle: `You're an adventurous traveler who loves ${primaryInterest.toLowerCase()} and discovering new experiences.`,
      recommendations: [
        'Try destinations off the beaten path',
        'Mix popular attractions with local experiences',
        'Consider shoulder season travel for better prices'
      ],
      budgetTips: [
        'Book accommodations in advance for better rates',
        'Use public transportation when possible',
        'Look for free walking tours and local events'
      ],
      localInsights: [
        'Visit local markets and neighborhood cafes',
        'Ask locals for their favorite hidden spots',
        'Participate in cultural events and festivals'
      ]
    };
  }

  private generateFallbackDestinationAnalysis(destination: string): any {
    return {
      bestTimeToVisit: 'Spring and fall offer the most pleasant weather with fewer crowds',
      localCuisine: [
        'Try the regional specialty dishes',
        'Visit local markets for authentic flavors',
        'Don\'t miss the street food experience'
      ],
      culturalInsights: [
        'Respect local customs and traditions',
        'Learn basic greeting phrases',
        'Observe appropriate dress codes at religious sites'
      ],
      hiddenGems: [
        'Explore neighborhoods outside the tourist center',
        'Visit local parks and green spaces',
        'Check out small museums and galleries'
      ],
      transportationTips: 'Public transportation is efficient and affordable. Consider getting a transit pass for your stay.',
      safetyInfo: 'Generally safe for tourists. Keep valuables secure and be aware of your surroundings in crowded areas.',
      packingRecommendations: 'Pack layers for variable weather, comfortable walking shoes, and a universal power adapter.',
      languageTips: 'Learn basic phrases like "hello," "thank you," and "excuse me" in the local language.'
    };
  }

  private generateFallbackCuisineGuide(destination: string): any {
    return {
      mustTryDishes: [
        'Local Specialty 1 - A traditional dish with rich flavors',
        'Local Specialty 2 - Popular street food loved by locals',
        'Local Specialty 3 - Classic comfort food with regional ingredients',
        'Local Specialty 4 - Unique dessert with cultural significance',
        'Local Specialty 5 - Signature beverage or drink'
      ],
      bestRestaurants: [
        { name: 'Traditional Restaurant', specialty: 'Authentic local cuisine', priceRange: 'Moderate' },
        { name: 'Local Favorite', specialty: 'Family recipes', priceRange: 'Budget-friendly' },
        { name: 'Upscale Dining', specialty: 'Modern interpretations of classic dishes', priceRange: 'High-end' }
      ],
      foodMarkets: [
        'Central Market - Bustling food hall with various vendors',
        'Street Food District - Area known for authentic street food stalls'
      ],
      diningTips: [
        'Meal times may differ from what you\'re used to',
        'Tipping customs vary by location',
        'Reservations recommended for popular restaurants'
      ],
      dietaryOptions: 'Vegetarian options are increasingly available. Communicate dietary restrictions clearly, preferably in the local language.'
    };
  }
}

export const openaiService = new OpenAIService();
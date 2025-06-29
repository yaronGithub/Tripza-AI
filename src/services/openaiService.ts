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

class OpenAIService {
  private apiKey: string | undefined;
  private baseURL = 'https://api.openai.com/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
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
}

export const openaiService = new OpenAIService();
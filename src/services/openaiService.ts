interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
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
      Don't use generic language - be specific about ${destination} and the chosen interests.`;

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
              content: 'You are a travel expert who creates personalized, engaging trip descriptions that inspire travelers.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 200,
          temperature: 0.7,
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

  async generateAttractionRecommendations(destination: string, preferences: string[]): Promise<string[]> {
    if (!this.apiKey) {
      return this.generateFallbackRecommendations(destination, preferences);
    }

    try {
      const prompt = `Suggest 10 specific, real attractions in ${destination} that match these interests: ${preferences.join(', ')}.
      
      Return only the attraction names, one per line, no descriptions or numbers.
      Focus on well-known, accessible attractions that tourists can actually visit.
      Be specific with names (e.g., "Golden Gate Bridge" not "famous bridge").`;

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
              content: 'You are a local travel guide with extensive knowledge of tourist attractions worldwide.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data: OpenAIResponse = await response.json();
      const content = data.choices[0]?.message?.content || '';
      const attractions = content.split('\n').filter(line => line.trim().length > 0);
      
      return attractions.length > 0 ? attractions : this.generateFallbackRecommendations(destination, preferences);
    } catch (error) {
      console.error('OpenAI API error:', error);
      return this.generateFallbackRecommendations(destination, preferences);
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
      
      Keep it under 6 words and avoid generic terms like "trip" or "vacation".`;

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
              content: 'You are a creative travel marketing expert who creates memorable trip titles.'
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

  private generateFallbackDescription(destination: string, preferences: string[], duration: number): string {
    const preferenceText = preferences.length > 0 ? preferences.join(', ').toLowerCase() : 'sightseeing';
    
    return `Discover the best of ${destination} on this carefully crafted ${duration}-day journey. Experience authentic ${preferenceText} while exploring the city's most captivating attractions. This personalized itinerary combines must-see landmarks with hidden gems, optimized for maximum enjoyment and minimal travel time. Perfect for travelers who want to make the most of their time in ${destination}.`;
  }

  private generateFallbackRecommendations(destination: string, preferences: string[]): string[] {
    // Basic fallback recommendations based on common attractions
    const commonAttractions = [
      `${destination} City Center`,
      `${destination} Museum`,
      `${destination} Park`,
      `${destination} Historic District`,
      `${destination} Market`,
      `${destination} Cathedral`,
      `${destination} Viewpoint`,
      `${destination} Cultural Center`,
      `${destination} Gardens`,
      `${destination} Waterfront`
    ];

    return commonAttractions;
  }
}

export const openaiService = new OpenAIService();
import { Attraction } from '../types';
import { googleMapsService } from './googleMapsService';
import { imageService } from './imageService';

class EnhancedAttractionService {
  private cache = new Map<string, Attraction[]>();

  async searchAttractions(
    destination: string, 
    preferences: string[], 
    limit: number = 20
  ): Promise<Attraction[]> {
    const cacheKey = `${destination}-${preferences.join(',')}-${limit}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // First, get coordinates for the destination
      const coordinates = await this.geocodeDestination(destination);
      if (!coordinates) {
        console.warn(`Could not find coordinates for ${destination}, using fallback attractions`);
        return this.generateFallbackAttractions(destination, preferences, limit);
      }

      // Try Google Places first for the best results, but only if available
      let googleAttractions: Attraction[] = [];
      if (googleMapsService.isAvailable()) {
        try {
          googleAttractions = await this.searchGooglePlaces(coordinates, preferences, limit);
        } catch (error) {
          console.warn('Google Places search failed, falling back to generated attractions:', error);
          // Continue to fallback generation instead of throwing
        }
      }
      
      // If we don't have enough attractions, generate fallback ones
      if (googleAttractions.length < 10) {
        const fallbackAttractions = await this.generateFallbackAttractions(destination, preferences, limit - googleAttractions.length);
        const combined = [...googleAttractions, ...fallbackAttractions];
        
        // Cache the results
        this.cache.set(cacheKey, combined);
        
        return combined;
      }
      
      // Cache the results
      this.cache.set(cacheKey, googleAttractions);
      
      return googleAttractions;
    } catch (error) {
      console.error('Error fetching attractions:', error);
      // Fallback to generated attractions with images
      return this.generateFallbackAttractions(destination, preferences, limit);
    }
  }

  private async searchGooglePlaces(
    coordinates: {lat: number, lng: number}, 
    preferences: string[], 
    limit: number
  ): Promise<Attraction[]> {
    // Check if Google Maps is available first
    if (!googleMapsService.isAvailable()) {
      console.warn('Google Maps API key not configured, skipping Google Places search');
      return [];
    }

    try {
      // Initialize Google Maps service
      await googleMapsService.initialize();
      
      const attractions: Attraction[] = [];
      
      // Search for each preference type
      for (const preference of preferences) {
        try {
          const places = await googleMapsService.findNearbyAttractions(
            coordinates, 
            preference, 
            15000 // 15km radius
          );
          
          // Convert top places to attractions
          const topPlaces = places.slice(0, Math.ceil(limit / preferences.length));
          
          for (const place of topPlaces) {
            if (place.place_id) {
              try {
                // Get detailed information including photos
                const detailedPlace = await googleMapsService.getPlaceDetails(place.place_id);
                if (detailedPlace) {
                  const attraction = await googleMapsService.convertPlaceToAttraction(
                    detailedPlace, 
                    preference
                  );
                  attractions.push(attraction);
                }
              } catch (detailError) {
                console.error('Error getting place details:', detailError);
                // Use basic place info as fallback
                const attraction = await googleMapsService.convertPlaceToAttraction(place, preference);
                attractions.push(attraction);
              }
            }
          }
        } catch (preferenceError) {
          console.warn(`Error searching for ${preference}:`, preferenceError);
          // Continue with other preferences instead of failing completely
        }
      }

      return attractions.slice(0, limit);
    } catch (error) {
      console.error('Google Places search error:', error);
      // Return empty array instead of throwing to allow fallback
      return [];
    }
  }

  private async geocodeDestination(destination: string): Promise<{lat: number, lng: number} | null> {
    try {
      // Use Nominatim (OpenStreetMap) for free geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`
      );
      const data = await response.json();
      
      if (data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon)
        };
      }
      return null;
    } catch (error) {
      console.error('Geocoding error:', error);
      return null;
    }
  }

  private async generateFallbackAttractions(destination: string, preferences: string[], limit: number): Promise<Attraction[]> {
    // Generate realistic attractions based on destination and preferences
    const attractions: Attraction[] = [];
    const baseCoords = this.getApproximateCoordinates(destination);
    
    for (const preference of preferences) {
      const attractionsForType = await this.generateAttractionsForType(
        destination, 
        preference, 
        baseCoords, 
        Math.ceil(limit / preferences.length)
      );
      attractions.push(...attractionsForType);
    }

    return attractions.slice(0, limit);
  }

  private getApproximateCoordinates(destination: string): {lat: number, lng: number} {
    // Rough coordinates for major cities/regions
    const cityCoords: Record<string, {lat: number, lng: number}> = {
      'paris': {lat: 48.8566, lng: 2.3522},
      'london': {lat: 51.5074, lng: -0.1278},
      'tokyo': {lat: 35.6762, lng: 139.6503},
      'rome': {lat: 41.9028, lng: 12.4964},
      'barcelona': {lat: 41.3851, lng: 2.1734},
      'amsterdam': {lat: 52.3676, lng: 4.9041},
      'berlin': {lat: 52.5200, lng: 13.4050},
      'madrid': {lat: 40.4168, lng: -3.7038},
      'vienna': {lat: 48.2082, lng: 16.3738},
      'prague': {lat: 50.0755, lng: 14.4378},
      'san francisco': {lat: 37.7749, lng: -122.4194},
      'new york': {lat: 40.7128, lng: -74.0060},
      'los angeles': {lat: 34.0522, lng: -118.2437},
      'chicago': {lat: 41.8781, lng: -87.6298},
      'miami': {lat: 25.7617, lng: -80.1918}
    };

    const key = destination.toLowerCase().replace(/[^a-z\s]/g, '').trim();
    return cityCoords[key] || {lat: 40.7128, lng: -74.0060}; // Default to NYC
  }

  private async generateAttractionsForType(
    destination: string, 
    type: string, 
    baseCoords: {lat: number, lng: number}, 
    count: number
  ): Promise<Attraction[]> {
    const attractions: Attraction[] = [];
    
    for (let i = 0; i < count; i++) {
      const attraction: Attraction = {
        id: `generated-${Date.now()}-${Math.random()}`,
        name: this.generateAttractionName(destination, type, i),
        type,
        description: this.generateDescription(destination, type),
        latitude: baseCoords.lat + (Math.random() - 0.5) * 0.1, // Spread within ~5km
        longitude: baseCoords.lng + (Math.random() - 0.5) * 0.1,
        estimatedDuration: this.getTypicalDuration(type),
        rating: 3.5 + Math.random() * 1.5, // 3.5-5.0 rating
        address: `${destination}, ${this.generateAddress()}`,
        imageUrl: '' // Will be populated by imageService
      };

      // Get beautiful image for this attraction
      try {
        attraction.imageUrl = await imageService.getAttractionImage(attraction.name, destination, type);
      } catch (error) {
        console.error('Error getting image for generated attraction:', error);
      }

      attractions.push(attraction);
    }

    return attractions;
  }

  private generateAttractionName(destination: string, type: string, index: number): string {
    const templates = {
      'Parks & Nature': [`${destination} Central Park`, `${destination} Botanical Garden`, `${destination} Nature Reserve`, `${destination} Waterfront Park`, `${destination} Scenic Gardens`],
      'Museums & Galleries': [`${destination} Art Museum`, `${destination} History Museum`, `${destination} Modern Gallery`, `${destination} Cultural Center`, `${destination} Heritage Museum`],
      'Historical Sites': [`${destination} Cathedral`, `${destination} Old Town`, `${destination} Historic District`, `${destination} Ancient Quarter`, `${destination} Heritage Site`],
      'Shopping Districts': [`${destination} Shopping Center`, `${destination} Market Square`, `${destination} Fashion District`, `${destination} Artisan Quarter`, `${destination} Grand Bazaar`],
      'Restaurants & Foodie Spots': [`${destination} Food Market`, `Local ${destination} Cuisine`, `${destination} Culinary District`, `${destination} Gourmet Quarter`, `${destination} Food Hall`],
      'Nightlife': [`${destination} Entertainment District`, `${destination} Night Market`, `${destination} Cultural Quarter`, `${destination} Music District`, `${destination} Arts Quarter`],
      'Family-Friendly': [`${destination} Family Park`, `${destination} Adventure Center`, `${destination} Discovery Zone`, `${destination} Fun Center`, `${destination} Activity Park`],
      'Adventure & Outdoors': [`${destination} Adventure Park`, `${destination} Outdoor Center`, `${destination} Sports Complex`, `${destination} Recreation Area`, `${destination} Activity Hub`],
      'Art & Culture': [`${destination} Cultural Center`, `${destination} Arts District`, `${destination} Heritage Site`, `${destination} Creative Quarter`, `${destination} Cultural Hub`]
    };

    const options = templates[type] || [`${destination} Attraction`];
    return options[index % options.length] || `${destination} ${type} ${index + 1}`;
  }

  private generateDescription(destination: string, type: string): string {
    const descriptions = {
      'Parks & Nature': `Beautiful natural space in ${destination} perfect for relaxation and outdoor activities with stunning views and peaceful atmosphere.`,
      'Museums & Galleries': `Fascinating cultural institution showcasing the rich heritage and art of ${destination} with world-class exhibitions and collections.`,
      'Historical Sites': `Historic landmark that tells the captivating story of ${destination}'s fascinating past with architectural marvels and cultural significance.`,
      'Shopping Districts': `Vibrant shopping area featuring local and international brands in ${destination} with unique boutiques and artisan shops.`,
      'Restaurants & Foodie Spots': `Authentic local dining experience showcasing the best flavors of ${destination} with traditional cuisine and modern twists.`,
      'Nightlife': `Exciting entertainment venue offering the best of ${destination}'s vibrant nightlife scene with live music and cultural performances.`,
      'Family-Friendly': `Fun-filled attraction perfect for families visiting ${destination} with activities for all ages and memorable experiences.`,
      'Adventure & Outdoors': `Thrilling outdoor experience in the heart of ${destination} offering adventure activities and scenic exploration.`,
      'Art & Culture': `Cultural hub celebrating the artistic spirit of ${destination} with local artists, performances, and creative expressions.`
    };

    return descriptions[type] || `Popular attraction in ${destination} offering unique experiences and memorable moments.`;
  }

  private getTypicalDuration(type: string): number {
    const durations = {
      'Parks & Nature': 120,
      'Museums & Galleries': 90,
      'Historical Sites': 60,
      'Shopping Districts': 180,
      'Restaurants & Foodie Spots': 90,
      'Nightlife': 120,
      'Family-Friendly': 180,
      'Adventure & Outdoors': 240,
      'Art & Culture': 90
    };

    return durations[type] || 90;
  }

  private generateAddress(): string {
    const streets = ['Main St', 'Central Ave', 'Park Rd', 'Heritage Blvd', 'Cultural Way', 'Historic Lane', 'Grand Plaza', 'Royal Street', 'Market Square', 'Arts District'];
    const numbers = Math.floor(Math.random() * 999) + 1;
    return `${numbers} ${streets[Math.floor(Math.random() * streets.length)]}`;
  }

  // Get enhanced attraction details with Google data
  async getAttractionDetails(attractionId: string): Promise<any> {
    try {
      if (!googleMapsService.isAvailable()) {
        return null;
      }

      // If it's a Google place, get fresh details
      if (attractionId.startsWith('google-') || attractionId.includes('ChIJ')) {
        const placeDetails = await googleMapsService.getPlaceDetails(attractionId);
        if (placeDetails) {
          return {
            ...placeDetails,
            photos: googleMapsService.getPlacePhotos(placeDetails, 10),
            reviews: placeDetails.reviews?.slice(0, 5) || []
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error('Error getting enhanced attraction details:', error);
      return null;
    }
  }
}

export const enhancedAttractionService = new EnhancedAttractionService();
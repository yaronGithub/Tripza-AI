import { Attraction } from '../types';
import { imageService } from './imageService';

// External APIs for attraction data
const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY;
const GOOGLE_PLACES_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

// Mapping of our preference types to external API categories
const PREFERENCE_TO_FOURSQUARE_CATEGORY = {
  'Parks & Nature': '16000',
  'Museums & Galleries': '10027',
  'Historical Sites': '10019',
  'Shopping Districts': '17000',
  'Restaurants & Foodie Spots': '13000',
  'Nightlife': '10032',
  'Family-Friendly': '10000',
  'Adventure & Outdoors': '16000',
  'Art & Culture': '10027'
};

const PREFERENCE_TO_GOOGLE_TYPES = {
  'Parks & Nature': ['park', 'natural_feature'],
  'Museums & Galleries': ['museum', 'art_gallery'],
  'Historical Sites': ['tourist_attraction', 'point_of_interest'],
  'Shopping Districts': ['shopping_mall', 'store'],
  'Restaurants & Foodie Spots': ['restaurant', 'food'],
  'Nightlife': ['night_club', 'bar'],
  'Family-Friendly': ['amusement_park', 'zoo'],
  'Adventure & Outdoors': ['park', 'natural_feature'],
  'Art & Culture': ['museum', 'art_gallery', 'cultural_center']
};

export class AttractionService {
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
        throw new Error(`Could not find coordinates for ${destination}`);
      }

      // Try multiple sources and combine results
      const attractions = await Promise.all([
        this.searchFoursquare(coordinates, preferences, limit),
        this.searchGooglePlaces(coordinates, preferences, limit),
        this.searchOpenStreetMap(coordinates, preferences, limit)
      ]);

      // Combine and deduplicate results
      let combined = this.combineAndDeduplicate(attractions.flat());
      
      // If we don't have enough attractions, generate fallback ones
      if (combined.length < 10) {
        const fallbackAttractions = await this.generateFallbackAttractions(destination, preferences, limit - combined.length);
        combined = [...combined, ...fallbackAttractions];
      }

      // Enhance all attractions with beautiful images
      const enhancedAttractions = await Promise.all(
        combined.map(async (attraction) => {
          if (!attraction.imageUrl) {
            try {
              attraction.imageUrl = await imageService.getAttractionImage(
                attraction.name, 
                destination, 
                attraction.type
              );
            } catch (error) {
              console.error('Error getting image for attraction:', error);
            }
          }
          return attraction;
        })
      );
      
      // Cache the results
      this.cache.set(cacheKey, enhancedAttractions);
      
      return enhancedAttractions;
    } catch (error) {
      console.error('Error fetching attractions:', error);
      // Fallback to generated attractions with images
      return this.generateFallbackAttractions(destination, preferences, limit);
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

  private async searchFoursquare(
    coordinates: {lat: number, lng: number}, 
    preferences: string[], 
    limit: number
  ): Promise<Attraction[]> {
    if (!FOURSQUARE_API_KEY) return [];

    try {
      const categories = preferences.map(p => PREFERENCE_TO_FOURSQUARE_CATEGORY[p]).filter(Boolean);
      
      const response = await fetch(
        `https://api.foursquare.com/v3/places/search?ll=${coordinates.lat},${coordinates.lng}&radius=10000&categories=${categories.join(',')}&limit=${limit}`,
        {
          headers: {
            'Authorization': FOURSQUARE_API_KEY,
            'Accept': 'application/json'
          }
        }
      );

      const data = await response.json();
      return this.convertFoursquareToAttractions(data.results || []);
    } catch (error) {
      console.error('Foursquare API error:', error);
      return [];
    }
  }

  private async searchGooglePlaces(
    coordinates: {lat: number, lng: number}, 
    preferences: string[], 
    limit: number
  ): Promise<Attraction[]> {
    if (!GOOGLE_PLACES_API_KEY) return [];

    try {
      const types = preferences.flatMap(p => PREFERENCE_TO_GOOGLE_TYPES[p] || []);
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${coordinates.lat},${coordinates.lng}&radius=10000&type=${types[0]}&key=${GOOGLE_PLACES_API_KEY}`
      );

      const data = await response.json();
      return this.convertGooglePlacesToAttractions(data.results || []);
    } catch (error) {
      console.error('Google Places API error:', error);
      return [];
    }
  }

  private async searchOpenStreetMap(
    coordinates: {lat: number, lng: number}, 
    preferences: string[], 
    limit: number
  ): Promise<Attraction[]> {
    try {
      // Use Overpass API for OpenStreetMap data
      const query = this.buildOverpassQuery(coordinates, preferences, limit);
      
      const response = await fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        body: query
      });

      const data = await response.json();
      return this.convertOverpassToAttractions(data.elements || []);
    } catch (error) {
      console.error('OpenStreetMap API error:', error);
      return [];
    }
  }

  private buildOverpassQuery(coordinates: {lat: number, lng: number}, preferences: string[], limit: number): string {
    const bbox = this.getBoundingBox(coordinates, 10); // 10km radius
    
    const amenityTypes = preferences.flatMap(pref => {
      switch (pref) {
        case 'Parks & Nature': return ['park', 'garden', 'nature_reserve'];
        case 'Museums & Galleries': return ['museum', 'gallery', 'arts_centre'];
        case 'Historical Sites': return ['monument', 'memorial', 'castle', 'ruins'];
        case 'Shopping Districts': return ['marketplace', 'shopping_centre'];
        case 'Restaurants & Foodie Spots': return ['restaurant', 'cafe', 'food_court'];
        case 'Nightlife': return ['bar', 'pub', 'nightclub'];
        case 'Family-Friendly': return ['zoo', 'aquarium', 'theme_park'];
        case 'Adventure & Outdoors': return ['climbing', 'sports_centre'];
        case 'Art & Culture': return ['theatre', 'cinema', 'cultural_centre'];
        default: return [];
      }
    });

    return `
      [out:json][timeout:25];
      (
        ${amenityTypes.map(type => `node["amenity"="${type}"](${bbox});`).join('')}
        ${amenityTypes.map(type => `way["amenity"="${type}"](${bbox});`).join('')}
        ${amenityTypes.map(type => `relation["amenity"="${type}"](${bbox});`).join('')}
      );
      out center meta;
    `;
  }

  private getBoundingBox(center: {lat: number, lng: number}, radiusKm: number): string {
    const lat = center.lat;
    const lng = center.lng;
    const latDelta = radiusKm / 111; // Rough conversion
    const lngDelta = radiusKm / (111 * Math.cos(lat * Math.PI / 180));
    
    return `${lat - latDelta},${lng - lngDelta},${lat + latDelta},${lng + lngDelta}`;
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

  private combineAndDeduplicate(attractions: Attraction[]): Attraction[] {
    const seen = new Set<string>();
    return attractions.filter(attraction => {
      const key = `${attraction.name}-${attraction.latitude.toFixed(4)}-${attraction.longitude.toFixed(4)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  private convertFoursquareToAttractions(places: any[]): Attraction[] {
    return places.map(place => ({
      id: place.fsq_id,
      name: place.name,
      type: this.mapFoursquareCategoryToType(place.categories?.[0]?.name),
      description: place.description || `Popular attraction in the area`,
      latitude: place.geocodes?.main?.latitude || 0,
      longitude: place.geocodes?.main?.longitude || 0,
      estimatedDuration: 90,
      rating: place.rating || 4.0,
      address: place.location?.formatted_address || 'Address not available',
      imageUrl: place.photos?.[0]?.prefix + '300x300' + place.photos?.[0]?.suffix
    }));
  }

  private convertGooglePlacesToAttractions(places: any[]): Attraction[] {
    return places.map(place => ({
      id: place.place_id,
      name: place.name,
      type: this.mapGoogleTypeToType(place.types?.[0]),
      description: `Popular ${place.types?.[0]?.replace(/_/g, ' ')} in the area`,
      latitude: place.geometry?.location?.lat || 0,
      longitude: place.geometry?.location?.lng || 0,
      estimatedDuration: 90,
      rating: place.rating || 4.0,
      address: place.vicinity || 'Address not available',
      imageUrl: place.photos?.[0] ? 
        `https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_PLACES_API_KEY}` : 
        undefined
    }));
  }

  private convertOverpassToAttractions(elements: any[]): Attraction[] {
    return elements.map(element => ({
      id: `osm-${element.id}`,
      name: element.tags?.name || 'Local Attraction',
      type: this.mapOSMTagsToType(element.tags),
      description: element.tags?.description || 'Local point of interest',
      latitude: element.lat || element.center?.lat || 0,
      longitude: element.lon || element.center?.lon || 0,
      estimatedDuration: 90,
      rating: 4.0,
      address: this.formatOSMAddress(element.tags),
      imageUrl: undefined
    }));
  }

  private mapFoursquareCategoryToType(category: string): string {
    // Map Foursquare categories back to our types
    if (!category) return 'Art & Culture';
    
    const mapping: Record<string, string> = {
      'Park': 'Parks & Nature',
      'Museum': 'Museums & Galleries',
      'Historic Site': 'Historical Sites',
      'Shopping': 'Shopping Districts',
      'Restaurant': 'Restaurants & Foodie Spots',
      'Nightlife': 'Nightlife',
      'Entertainment': 'Family-Friendly',
      'Outdoors': 'Adventure & Outdoors',
      'Arts': 'Art & Culture'
    };

    for (const [key, value] of Object.entries(mapping)) {
      if (category.toLowerCase().includes(key.toLowerCase())) {
        return value;
      }
    }

    return 'Art & Culture';
  }

  private mapGoogleTypeToType(type: string): string {
    const mapping: Record<string, string> = {
      'park': 'Parks & Nature',
      'museum': 'Museums & Galleries',
      'tourist_attraction': 'Historical Sites',
      'shopping_mall': 'Shopping Districts',
      'restaurant': 'Restaurants & Foodie Spots',
      'night_club': 'Nightlife',
      'amusement_park': 'Family-Friendly',
      'natural_feature': 'Adventure & Outdoors',
      'art_gallery': 'Art & Culture'
    };

    return mapping[type] || 'Art & Culture';
  }

  private mapOSMTagsToType(tags: any): string {
    if (!tags) return 'Art & Culture';

    if (tags.leisure === 'park' || tags.natural) return 'Parks & Nature';
    if (tags.amenity === 'museum' || tags.tourism === 'museum') return 'Museums & Galleries';
    if (tags.historic || tags.tourism === 'attraction') return 'Historical Sites';
    if (tags.shop || tags.amenity === 'marketplace') return 'Shopping Districts';
    if (tags.amenity === 'restaurant' || tags.amenity === 'cafe') return 'Restaurants & Foodie Spots';
    if (tags.amenity === 'bar' || tags.amenity === 'pub') return 'Nightlife';
    if (tags.tourism === 'zoo' || tags.leisure === 'amusement_park') return 'Family-Friendly';
    if (tags.sport || tags.leisure === 'sports_centre') return 'Adventure & Outdoors';

    return 'Art & Culture';
  }

  private formatOSMAddress(tags: any): string {
    if (!tags) return 'Address not available';
    
    const parts = [
      tags['addr:housenumber'],
      tags['addr:street'],
      tags['addr:city'],
      tags['addr:country']
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }
}

export const attractionService = new AttractionService();
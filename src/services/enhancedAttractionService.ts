import { Attraction } from '../types';
import { googleMapsService } from './googleMapsService';
import { attractionService } from './attractionService';

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
      // Check if Google Maps is available
      if (!googleMapsService.isAvailable()) {
        console.warn('Google Maps not available, using fallback attraction service');
        return attractionService.searchAttractions(destination, preferences, limit);
      }

      // First, get coordinates for the destination
      const coordinates = await this.geocodeDestination(destination);
      if (!coordinates) {
        console.warn(`Could not find coordinates for ${destination}, using fallback`);
        return attractionService.searchAttractions(destination, preferences, limit);
      }

      // Try Google Places first for the best results
      const googleAttractions = await this.searchGooglePlaces(coordinates, preferences, limit);
      
      // If we have enough from Google, use those
      if (googleAttractions.length >= Math.min(limit, 15)) {
        this.cache.set(cacheKey, googleAttractions);
        return googleAttractions;
      }

      // Otherwise, supplement with our existing service
      const fallbackAttractions = await attractionService.searchAttractions(
        destination, 
        preferences, 
        limit - googleAttractions.length
      );

      const combined = [...googleAttractions, ...fallbackAttractions];
      const unique = this.removeDuplicates(combined);
      
      this.cache.set(cacheKey, unique);
      return unique;
    } catch (error) {
      console.error('Error in enhanced attraction search:', error);
      // Fallback to original service
      return attractionService.searchAttractions(destination, preferences, limit);
    }
  }

  private async searchGooglePlaces(
    coordinates: {lat: number, lng: number}, 
    preferences: string[], 
    limit: number
  ): Promise<Attraction[]> {
    try {
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
          console.warn(`Error searching for ${preference}:`, preferenceError.message);
          // Continue with other preferences instead of failing completely
        }
      }

      return attractions.slice(0, limit);
    } catch (error) {
      console.error('Google Places search error:', error);
      return [];
    }
  }

  private async geocodeDestination(destination: string): Promise<{lat: number, lng: number} | null> {
    try {
      // Use Google Geocoding API if available
      if (googleMapsService.isAvailable() && import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(destination)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          
          if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return {
              lat: location.lat,
              lng: location.lng
            };
          }
        } catch (googleError) {
          console.warn('Google Geocoding failed, trying fallback:', googleError);
        }
      }

      // Fallback to Nominatim
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

  private removeDuplicates(attractions: Attraction[]): Attraction[] {
    const seen = new Set<string>();
    return attractions.filter(attraction => {
      const key = `${attraction.name.toLowerCase()}-${attraction.latitude.toFixed(4)}-${attraction.longitude.toFixed(4)}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
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
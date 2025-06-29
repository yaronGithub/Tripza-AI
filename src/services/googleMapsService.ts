import { Loader } from '@googlemaps/js-api-loader';

class GoogleMapsService {
  private apiKey: string | undefined;
  private placesService: google.maps.places.PlacesService | null = null;
  private map: google.maps.Map | null = null;
  private initialized: boolean = false;
  private initializationPromise: Promise<void> | null = null;
  private loader: Loader | null = null;

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (this.apiKey) {
      this.initializeLoader();
    }
  }

  private initializeLoader() {
    this.loader = new Loader({
      apiKey: this.apiKey!,
      version: 'weekly',
      libraries: ['places', 'geometry']
    });
  }

  // Check if Google Maps is available
  isAvailable(): boolean {
    return !!this.apiKey;
  }

  // Initialize Google Maps services
  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    if (!this.apiKey) {
      console.warn('Google Maps API key not found. Google Maps features will be disabled.');
      return Promise.reject(new Error('Google Maps API key not found'));
    }

    this.initializationPromise = new Promise(async (resolve, reject) => {
      try {
        if (!this.loader) {
          this.initializeLoader();
        }

        // Load Google Maps API
        await this.loader!.load();

        // Create a hidden map element for Places service
        const mapElement = document.createElement('div');
        mapElement.style.display = 'none';
        document.body.appendChild(mapElement);

        this.map = new google.maps.Map(mapElement, {
          center: { lat: 0, lng: 0 },
          zoom: 1
        });

        this.placesService = new google.maps.places.PlacesService(this.map);
        this.initialized = true;
        resolve();
      } catch (error) {
        console.error('Failed to initialize Google Maps services:', error);
        reject(error);
      }
    });

    return this.initializationPromise;
  }

  // Search for places using Google Places API
  async searchPlaces(query: string, location?: { lat: number; lng: number }): Promise<google.maps.places.PlaceResult[]> {
    if (!this.isAvailable()) {
      throw new Error('Google Maps API not available');
    }

    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.placesService) {
      throw new Error('Google Places service not available');
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.TextSearchRequest = {
        query,
        location: location ? new google.maps.LatLng(location.lat, location.lng) : undefined,
        radius: location ? 50000 : undefined, // 50km radius
      };

      this.placesService!.textSearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  // Get detailed place information including photos
  async getPlaceDetails(placeId: string): Promise<google.maps.places.PlaceResult> {
    if (!this.isAvailable()) {
      throw new Error('Google Maps API not available');
    }

    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.placesService) {
      throw new Error('Google Places service not available');
    }

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceDetailsRequest = {
        placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'photos',
          'rating',
          'user_ratings_total',
          'types',
          'website',
          'formatted_phone_number',
          'opening_hours',
          'price_level',
          'reviews'
        ]
      };

      this.placesService!.getDetails(request, (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place) {
          resolve(place);
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    });
  }

  // Get high-quality photos from Google Places
  getPlacePhotoUrl(photo: google.maps.places.PlacePhoto, maxWidth: number = 800): string {
    return photo.getUrl({ maxWidth });
  }

  // Get multiple photos for a place
  getPlacePhotos(place: google.maps.places.PlaceResult, maxPhotos: number = 5): string[] {
    if (!place.photos || place.photos.length === 0) return [];
    
    return place.photos
      .slice(0, maxPhotos)
      .map(photo => this.getPlacePhotoUrl(photo, 800));
  }

  // Search for attractions near a location
  async findNearbyAttractions(
    location: { lat: number; lng: number },
    type: string,
    radius: number = 10000
  ): Promise<google.maps.places.PlaceResult[]> {
    if (!this.isAvailable()) {
      throw new Error('Google Maps API not available');
    }

    if (!this.initialized) {
      await this.initialize();
    }
    
    if (!this.placesService) {
      throw new Error('Google Places service not available');
    }

    const typeMapping: Record<string, string[]> = {
      'Parks & Nature': ['park', 'natural_feature', 'zoo'],
      'Museums & Galleries': ['museum', 'art_gallery'],
      'Historical Sites': ['tourist_attraction', 'church', 'cemetery'],
      'Shopping Districts': ['shopping_mall', 'store'],
      'Restaurants & Foodie Spots': ['restaurant', 'food', 'meal_takeaway'],
      'Nightlife': ['night_club', 'bar'],
      'Family-Friendly': ['amusement_park', 'aquarium', 'zoo'],
      'Adventure & Outdoors': ['gym', 'park', 'stadium'],
      'Art & Culture': ['museum', 'art_gallery', 'library']
    };

    const googleTypes = typeMapping[type] || ['tourist_attraction'];

    return new Promise((resolve, reject) => {
      const request: google.maps.places.PlaceSearchRequest = {
        location: new google.maps.LatLng(location.lat, location.lng),
        radius,
        type: googleTypes[0] as any,
      };

      this.placesService!.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          reject(new Error(`Nearby search failed: ${status}`));
        }
      });
    });
  }

  // Convert Google Place to our Attraction format
  async convertPlaceToAttraction(place: google.maps.places.PlaceResult, type: string): Promise<any> {
    const photos = place.photos ? this.getPlacePhotos(place, 3) : [];
    
    return {
      id: place.place_id || `google-${Date.now()}`,
      name: place.name || 'Unknown Place',
      type,
      description: this.generateDescription(place),
      latitude: place.geometry?.location?.lat() || 0,
      longitude: place.geometry?.location?.lng() || 0,
      estimatedDuration: this.estimateDuration(type),
      rating: place.rating || 4.0,
      address: place.formatted_address || 'Address not available',
      imageUrl: photos[0] || undefined,
      photos: photos,
      googlePlaceId: place.place_id,
      website: place.website,
      phoneNumber: place.formatted_phone_number,
      priceLevel: place.price_level,
      userRatingsTotal: place.user_ratings_total
    };
  }

  private generateDescription(place: google.maps.places.PlaceResult): string {
    const types = place.types || [];
    const rating = place.rating || 0;
    const ratingsCount = place.user_ratings_total || 0;
    
    let description = `Popular ${types[0]?.replace(/_/g, ' ')} in the area`;
    
    if (rating > 0) {
      description += ` with a ${rating} star rating`;
      if (ratingsCount > 0) {
        description += ` from ${ratingsCount} reviews`;
      }
    }
    
    if (place.price_level !== undefined) {
      const priceText = ['Free', 'Inexpensive', 'Moderate', 'Expensive', 'Very Expensive'];
      description += `. ${priceText[place.price_level]} pricing.`;
    }
    
    return description;
  }

  private estimateDuration(type: string): number {
    const durations: Record<string, number> = {
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

  // Get directions between two points
  async getDirections(
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number },
    waypoints?: { lat: number; lng: number }[]
  ): Promise<google.maps.DirectionsResult> {
    if (!this.isAvailable()) {
      throw new Error('Google Maps API not available');
    }

    if (!this.initialized) {
      await this.initialize();
    }

    return new Promise((resolve, reject) => {
      const directionsService = new google.maps.DirectionsService();
      
      const request: google.maps.DirectionsRequest = {
        origin: new google.maps.LatLng(origin.lat, origin.lng),
        destination: new google.maps.LatLng(destination.lat, destination.lng),
        travelMode: google.maps.TravelMode.WALKING
      };
      
      if (waypoints && waypoints.length > 0) {
        request.waypoints = waypoints.map(wp => ({
          location: new google.maps.LatLng(wp.lat, wp.lng),
          stopover: true
        }));
      }

      directionsService.route(request, (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          resolve(result);
        } else {
          reject(new Error(`Directions request failed: ${status}`));
        }
      });
    });
  }
}

export const googleMapsService = new GoogleMapsService();
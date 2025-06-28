export class ImageService {
  private cache = new Map<string, string>();
  private unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  private pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

  // High-quality curated images for popular destinations
  private curatedImages: Record<string, Record<string, string[]>> = {
    'san francisco': {
      'Parks & Nature': [
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Golden Gate Bridge
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', // Golden Gate Park
        'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80', // Crissy Field
      ],
      'Museums & Galleries': [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', // SFMOMA
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // De Young Museum
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', // Legion of Honor
      ],
      'Historical Sites': [
        'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80', // Alcatraz
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Golden Gate
        'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', // Lombard Street
      ],
      'Restaurants & Foodie Spots': [
        'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80', // Fisherman's Wharf
        'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80', // Restaurant interior
        'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80', // Food market
      ],
      'Art & Culture': [
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Chinatown
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Cultural district
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', // Arts district
      ]
    },
    'new york': {
      'Parks & Nature': [
        'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=800&q=80', // Central Park
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // Central Park aerial
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', // High Line
      ],
      'Museums & Galleries': [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', // MoMA
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Met Museum
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', // Guggenheim
      ],
      'Historical Sites': [
        'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80', // Statue of Liberty
        'https://images.unsplash.com/photo-1546436836-07a91091f160?w=800&q=80', // Brooklyn Bridge
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', // 9/11 Memorial
      ],
      'Nightlife': [
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // Times Square
        'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80', // Broadway
        'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80', // NYC nightlife
      ]
    },
    'paris': {
      'Historical Sites': [
        'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80', // Eiffel Tower
        'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80', // Louvre
        'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&q=80', // Notre Dame
      ],
      'Museums & Galleries': [
        'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80', // Louvre
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', // Musée d'Orsay
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Centre Pompidou
      ],
      'Parks & Nature': [
        'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&q=80', // Trocadéro Gardens
        'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&q=80', // Luxembourg Gardens
        'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80', // Tuileries
      ]
    },
    'london': {
      'Historical Sites': [
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // Big Ben
        'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80', // Tower Bridge
        'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80', // Westminster
      ],
      'Museums & Galleries': [
        'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80', // British Museum
        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80', // Tate Modern
        'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80', // National Gallery
      ],
      'Parks & Nature': [
        'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // Hyde Park
        'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80', // Regent's Park
        'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?w=800&q=80', // Greenwich Park
      ]
    },
    'tokyo': {
      'Historical Sites': [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Senso-ji Temple
        'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80', // Meiji Shrine
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', // Imperial Palace
      ],
      'Art & Culture': [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Traditional culture
        'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80', // Modern Tokyo
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', // Shibuya
      ],
      'Parks & Nature': [
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Cherry blossoms
        'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?w=800&q=80', // Ueno Park
        'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=800&q=80', // Shinjuku Gyoen
      ]
    }
  };

  // Fallback images by category
  private categoryImages: Record<string, string[]> = {
    'Parks & Nature': [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80'
    ],
    'Museums & Galleries': [
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&q=80'
    ],
    'Historical Sites': [
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&q=80',
      'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?w=800&q=80',
      'https://images.unsplash.com/photo-1546436836-07a91091f160?w=800&q=80',
      'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      'https://images.unsplash.com/photo-1520986606214-8b456906c813?w=800&q=80'
    ],
    'Shopping Districts': [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=800&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
      'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80',
      'https://images.unsplash.com/photo-1519201945132-7b9e46fa1db4?w=800&q=80'
    ],
    'Restaurants & Foodie Spots': [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80',
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80'
    ],
    'Nightlife': [
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&q=80',
      'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80'
    ],
    'Family-Friendly': [
      'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?w=800&q=80',
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      'https://images.unsplash.com/photo-1520637736862-4d197d17c93a?w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    ],
    'Adventure & Outdoors': [
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80',
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
      'https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?w=800&q=80'
    ],
    'Art & Culture': [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&q=80',
      'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800&q=80',
      'https://images.unsplash.com/photo-1549144511-f099e773c147?w=800&q=80',
      'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&q=80'
    ]
  };

  async getAttractionImage(attractionName: string, city: string, category: string): Promise<string> {
    const cacheKey = `${city}-${attractionName}-${category}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // First try to get from curated images
      const curatedImage = this.getCuratedImage(city, category);
      if (curatedImage) {
        this.cache.set(cacheKey, curatedImage);
        return curatedImage;
      }

      // Try Unsplash API if available
      if (this.unsplashAccessKey) {
        const unsplashImage = await this.searchUnsplash(attractionName, city, category);
        if (unsplashImage) {
          this.cache.set(cacheKey, unsplashImage);
          return unsplashImage;
        }
      }

      // Try Pexels API if available
      if (this.pexelsApiKey) {
        const pexelsImage = await this.searchPexels(attractionName, city, category);
        if (pexelsImage) {
          this.cache.set(cacheKey, pexelsImage);
          return pexelsImage;
        }
      }

      // Fallback to category images
      const fallbackImage = this.getCategoryImage(category);
      this.cache.set(cacheKey, fallbackImage);
      return fallbackImage;
    } catch (error) {
      console.error('Error fetching image:', error);
      const fallbackImage = this.getCategoryImage(category);
      this.cache.set(cacheKey, fallbackImage);
      return fallbackImage;
    }
  }

  private getCuratedImage(city: string, category: string): string | null {
    const cityKey = city.toLowerCase().replace(/[^a-z]/g, '');
    const cityImages = this.curatedImages[cityKey];
    
    if (cityImages && cityImages[category]) {
      const images = cityImages[category];
      return images[Math.floor(Math.random() * images.length)];
    }
    
    return null;
  }

  private getCategoryImage(category: string): string {
    const images = this.categoryImages[category] || this.categoryImages['Parks & Nature'];
    return images[Math.floor(Math.random() * images.length)];
  }

  private async searchUnsplash(attractionName: string, city: string, category: string): Promise<string | null> {
    try {
      const query = `${attractionName} ${city} ${category}`.replace(/[^a-zA-Z0-9\s]/g, '');
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': `Client-ID ${this.unsplashAccessKey}`
          }
        }
      );

      if (!response.ok) throw new Error('Unsplash API error');

      const data = await response.json();
      if (data.results && data.results.length > 0) {
        return data.results[0].urls.regular;
      }
    } catch (error) {
      console.error('Unsplash search error:', error);
    }
    
    return null;
  }

  private async searchPexels(attractionName: string, city: string, category: string): Promise<string | null> {
    try {
      const query = `${attractionName} ${city} ${category}`.replace(/[^a-zA-Z0-9\s]/g, '');
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
        {
          headers: {
            'Authorization': this.pexelsApiKey!
          }
        }
      );

      if (!response.ok) throw new Error('Pexels API error');

      const data = await response.json();
      if (data.photos && data.photos.length > 0) {
        return data.photos[0].src.large;
      }
    } catch (error) {
      console.error('Pexels search error:', error);
    }
    
    return null;
  }

  async getDestinationHeroImage(destination: string): Promise<string> {
    const cacheKey = `hero-${destination}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      // Try to get a beautiful hero image for the destination
      if (this.unsplashAccessKey) {
        const response = await fetch(
          `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination + ' cityscape skyline')}&per_page=1&orientation=landscape`,
          {
            headers: {
              'Authorization': `Client-ID ${this.unsplashAccessKey}`
            }
          }
        );

        if (response.ok) {
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            const imageUrl = data.results[0].urls.regular;
            this.cache.set(cacheKey, imageUrl);
            return imageUrl;
          }
        }
      }

      // Fallback to curated destination images
      const destinationImages = {
        'san francisco': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80',
        'new york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1200&q=80',
        'paris': 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=1200&q=80',
        'london': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=80',
        'tokyo': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&q=80',
        'rome': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
        'barcelona': 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=1200&q=80',
        'amsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=1200&q=80'
      };

      const cityKey = destination.toLowerCase().replace(/[^a-z]/g, '');
      const fallbackImage = destinationImages[cityKey] || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80';
      
      this.cache.set(cacheKey, fallbackImage);
      return fallbackImage;
    } catch (error) {
      console.error('Error fetching destination image:', error);
      const fallbackImage = 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80';
      this.cache.set(cacheKey, fallbackImage);
      return fallbackImage;
    }
  }

  // Preload images for better performance
  preloadImage(url: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = url;
    });
  }

  // Get multiple images for a gallery
  async getImageGallery(attractionName: string, city: string, category: string, count: number = 3): Promise<string[]> {
    const images: string[] = [];
    
    try {
      // Get primary image
      const primaryImage = await this.getAttractionImage(attractionName, city, category);
      images.push(primaryImage);

      // Get additional images from category
      const categoryImages = this.categoryImages[category] || this.categoryImages['Parks & Nature'];
      const additionalImages = categoryImages
        .filter(img => img !== primaryImage)
        .slice(0, count - 1);
      
      images.push(...additionalImages);
      
      return images.slice(0, count);
    } catch (error) {
      console.error('Error creating image gallery:', error);
      const fallbackImages = this.categoryImages[category] || this.categoryImages['Parks & Nature'];
      return fallbackImages.slice(0, count);
    }
  }
}

export const imageService = new ImageService();
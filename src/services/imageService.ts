export class ImageService {
  private cache = new Map<string, string>();
  private unsplashAccessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  private pexelsApiKey = import.meta.env.VITE_PEXELS_API_KEY;

  // High-quality curated images for popular destinations
  private curatedImages: Record<string, Record<string, string[]>> = {
    'san francisco': {
      'Parks & Nature': [
        'https://images.pexels.com/photos/1141853/pexels-photo-1141853.jpeg?auto=compress&cs=tinysrgb&w=800', // Golden Gate Bridge
        'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800', // Golden Gate Park
        'https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg?auto=compress&cs=tinysrgb&w=800', // Crissy Field
      ],
      'Museums & Galleries': [
        'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=800', // SFMOMA
        'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800', // De Young Museum
        'https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800', // Legion of Honor
      ],
      'Historical Sites': [
        'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&w=800', // Alcatraz
        'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800', // Golden Gate
        'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800', // Lombard Street
      ],
      'Restaurants & Foodie Spots': [
        'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800', // Fisherman's Wharf
        'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800', // Restaurant interior
        'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800', // Food market
      ],
      'Art & Culture': [
        'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=800', // Chinatown
        'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=800', // Cultural district
        'https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800', // Arts district
      ]
    },
    'new york': {
      'Parks & Nature': [
        'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800', // Central Park
        'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=800', // Central Park aerial
        'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800', // High Line
      ],
      'Museums & Galleries': [
        'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=800', // MoMA
        'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800', // Met Museum
        'https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800', // Guggenheim
      ],
      'Historical Sites': [
        'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg?auto=compress&cs=tinysrgb&w=800', // Statue of Liberty
        'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800', // Brooklyn Bridge
        'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=800', // 9/11 Memorial
      ],
      'Nightlife': [
        'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=800', // Times Square
        'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800', // Broadway
        'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800', // NYC nightlife
      ]
    },
    'paris': {
      'Historical Sites': [
        'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=800', // Eiffel Tower
        'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800', // Louvre
        'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=800', // Notre Dame
      ],
      'Museums & Galleries': [
        'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800', // Louvre
        'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=800', // Musée d'Orsay
        'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800', // Centre Pompidou
      ],
      'Parks & Nature': [
        'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=800', // Trocadéro Gardens
        'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=800', // Luxembourg Gardens
        'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800', // Tuileries
      ]
    },
    'london': {
      'Historical Sites': [
        'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800', // Big Ben
        'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800', // Tower Bridge
        'https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&w=800', // Westminster
      ],
      'Museums & Galleries': [
        'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=800', // British Museum
        'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800', // Tate Modern
        'https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800', // National Gallery
      ],
      'Parks & Nature': [
        'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800', // Hyde Park
        'https://images.pexels.com/photos/672532/pexels-photo-672532.jpeg?auto=compress&cs=tinysrgb&w=800', // Regent's Park
        'https://images.pexels.com/photos/726484/pexels-photo-726484.jpeg?auto=compress&cs=tinysrgb&w=800', // Greenwich Park
      ]
    },
    'tokyo': {
      'Historical Sites': [
        'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800', // Senso-ji Temple
        'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=800', // Meiji Shrine
        'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=800', // Imperial Palace
      ],
      'Art & Culture': [
        'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800', // Traditional culture
        'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=800', // Modern Tokyo
        'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=800', // Shibuya
      ],
      'Parks & Nature': [
        'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800', // Cherry blossoms
        'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=800', // Ueno Park
        'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=800', // Shinjuku Gyoen
      ]
    },
    'rome': {
      'Historical Sites': [
        'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800', // Colosseum
        'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800', // Roman Forum
        'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&w=800', // Pantheon
      ],
      'Art & Culture': [
        'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800', // Vatican Museums
        'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800', // Sistine Chapel
        'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&w=800', // Galleria Borghese
      ]
    },
    'barcelona': {
      'Historical Sites': [
        'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=800', // Sagrada Familia
        'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800', // Park Güell
        'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&w=800', // Casa Batlló
      ],
      'Art & Culture': [
        'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=800', // Picasso Museum
        'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800', // MACBA
        'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&w=800', // Joan Miró Foundation
      ]
    }
  };

  // Fallback images by category
  private categoryImages: Record<string, string[]> = {
    'Parks & Nature': [
      'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Museums & Galleries': [
      'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Historical Sites': [
      'https://images.pexels.com/photos/1010657/pexels-photo-1010657.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2225442/pexels-photo-2225442.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Shopping Districts': [
      'https://images.pexels.com/photos/1050244/pexels-photo-1050244.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1884582/pexels-photo-1884582.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1884583/pexels-photo-1884583.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Restaurants & Foodie Spots': [
      'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Nightlife': [
      'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/801863/pexels-photo-801863.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1540319/pexels-photo-1540319.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Family-Friendly': [
      'https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1179229/pexels-photo-1179229.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Adventure & Outdoors': [
      'https://images.pexels.com/photos/1659438/pexels-photo-1659438.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1271619/pexels-photo-1271619.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1834399/pexels-photo-1834399.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1770809/pexels-photo-1770809.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    'Art & Culture': [
      'https://images.pexels.com/photos/1509534/pexels-photo-1509534.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1674049/pexels-photo-1674049.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2123337/pexels-photo-2123337.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/2570059/pexels-photo-2570059.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg?auto=compress&cs=tinysrgb&w=800'
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

      // Try Pexels API if available
      if (this.pexelsApiKey) {
        const pexelsImage = await this.searchPexels(attractionName, city, category);
        if (pexelsImage) {
          this.cache.set(cacheKey, pexelsImage);
          return pexelsImage;
        }
      }
      
      // Try Unsplash API if available
      if (this.unsplashAccessKey) {
        const unsplashImage = await this.searchUnsplash(attractionName, city, category);
        if (unsplashImage) {
          this.cache.set(cacheKey, unsplashImage);
          return unsplashImage;
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
    
    // Try exact city match
    if (this.curatedImages[cityKey]?.[category]) {
      const images = this.curatedImages[cityKey][category];
      return images[Math.floor(Math.random() * images.length)];
    }
    
    // Try partial city match
    for (const [key, categories] of Object.entries(this.curatedImages)) {
      if (cityKey.includes(key) || key.includes(cityKey)) {
        if (categories[category]) {
          const images = categories[category];
          return images[Math.floor(Math.random() * images.length)];
        }
      }
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
      // Try Pexels API first if available
      if (this.pexelsApiKey) {
        try {
          const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(destination + ' skyline landmark')}&per_page=1&orientation=landscape`,
            {
              headers: {
                'Authorization': this.pexelsApiKey
              }
            }
          );
          
          if (response.ok) {
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
              const imageUrl = data.photos[0].src.large2x || data.photos[0].src.large;
              this.cache.set(cacheKey, imageUrl);
              return imageUrl;
            }
          }
        } catch (error) {
          console.error('Pexels API error:', error);
        }
      }
      
      // Try Unsplash API if available
      if (this.unsplashAccessKey) {
        try {
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
        } catch (error) {
          console.error('Unsplash API error:', error);
        }
      }

      // Fallback to curated destination images
      const destinationLower = destination.toLowerCase();
      const destinationImages: Record<string, string> = {
        'san francisco': 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'new york': 'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'paris': 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'london': 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'tokyo': 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'rome': 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'barcelona': 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'amsterdam': 'https://images.pexels.com/photos/967292/pexels-photo-967292.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'berlin': 'https://images.pexels.com/photos/2570063/pexels-photo-2570063.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'sydney': 'https://images.pexels.com/photos/995764/pexels-photo-995764.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'venice': 'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'kyoto': 'https://images.pexels.com/photos/1440476/pexels-photo-1440476.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'dubai': 'https://images.pexels.com/photos/823696/pexels-photo-823696.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'singapore': 'https://images.pexels.com/photos/1842332/pexels-photo-1842332.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'hong kong': 'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'bangkok': 'https://images.pexels.com/photos/1031659/pexels-photo-1031659.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'istanbul': 'https://images.pexels.com/photos/2042109/pexels-photo-2042109.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'prague': 'https://images.pexels.com/photos/2346216/pexels-photo-2346216.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'vienna': 'https://images.pexels.com/photos/3254729/pexels-photo-3254729.jpeg?auto=compress&cs=tinysrgb&w=1200',
        'budapest': 'https://images.pexels.com/photos/1757433/pexels-photo-1757433.jpeg?auto=compress&cs=tinysrgb&w=1200'
      };
      
      // Try exact match first
      if (destinationImages[destinationLower]) {
        const imageUrl = destinationImages[destinationLower];
        this.cache.set(cacheKey, imageUrl);
        return imageUrl;
      }
      
      // Try partial match
      for (const [key, url] of Object.entries(destinationImages)) {
        if (destinationLower.includes(key) || key.includes(destinationLower)) {
          this.cache.set(cacheKey, url);
          return url;
        }
      }
      
      // Default fallback
      const fallbackImage = 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200';
      this.cache.set(cacheKey, fallbackImage);
      return fallbackImage;
    } catch (error) {
      console.error('Error fetching destination image:', error);
      const fallbackImage = 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200';
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

      // Try Pexels API for additional images if available
      if (this.pexelsApiKey && images.length < count) {
        try {
          const query = `${attractionName} ${city} ${category}`.replace(/[^a-zA-Z0-9\s]/g, '');
          const response = await fetch(
            `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${count - images.length}&orientation=landscape`,
            {
              headers: {
                'Authorization': this.pexelsApiKey
              }
            }
          );

          if (response.ok) {
            const data = await response.json();
            if (data.photos && data.photos.length > 0) {
              const pexelsImages = data.photos.map((photo: any) => photo.src.large);
              images.push(...pexelsImages);
            }
          }
        } catch (error) {
          console.error('Pexels gallery error:', error);
        }
      }

      // Get additional images from category if needed
      if (images.length < count) {
        const categoryImages = this.categoryImages[category] || this.categoryImages['Parks & Nature'];
        const additionalImages = categoryImages
          .filter(img => img !== primaryImage)
          .slice(0, count - images.length);
        
        images.push(...additionalImages);
      }
      
      return images.slice(0, count);
    } catch (error) {
      console.error('Error creating image gallery:', error);
      const fallbackImages = this.categoryImages[category] || this.categoryImages['Parks & Nature'];
      return fallbackImages.slice(0, count);
    }
  }
}

export const imageService = new ImageService();
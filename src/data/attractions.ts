import { Attraction } from '../types';

// Mock attraction data for different cities
export const ATTRACTIONS_DB: Record<string, Attraction[]> = {
  'san francisco': [
    {
      id: '1',
      name: 'Golden Gate Bridge',
      type: 'Parks & Nature',
      description: 'Iconic suspension bridge and symbol of San Francisco',
      latitude: 37.8199,
      longitude: -122.4783,
      estimatedDuration: 90,
      rating: 4.7,
      address: 'Golden Gate Bridge, San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg'
    },
    {
      id: '2',
      name: 'Alcatraz Island',
      type: 'Historical Sites',
      description: 'Former federal prison on an island in San Francisco Bay',
      latitude: 37.8267,
      longitude: -122.4230,
      estimatedDuration: 180,
      rating: 4.5,
      address: 'Alcatraz Island, San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/208745/pexels-photo-208745.jpeg'
    },
    {
      id: '3',
      name: 'Fisherman\'s Wharf',
      type: 'Restaurants & Foodie Spots',
      description: 'Waterfront area with seafood restaurants and shops',
      latitude: 37.8080,
      longitude: -122.4177,
      estimatedDuration: 120,
      rating: 4.2,
      address: 'Fisherman\'s Wharf, San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/161663/san-francisco-california-fishermans-wharf-161663.jpeg'
    },
    {
      id: '4',
      name: 'Lombard Street',
      type: 'Historical Sites',
      description: 'The most crooked street in the world',
      latitude: 37.8021,
      longitude: -122.4187,
      estimatedDuration: 45,
      rating: 4.0,
      address: 'Lombard Street, San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg'
    },
    {
      id: '5',
      name: 'Golden Gate Park',
      type: 'Parks & Nature',
      description: 'Large urban park with gardens, museums, and recreational areas',
      latitude: 37.7694,
      longitude: -122.4862,
      estimatedDuration: 180,
      rating: 4.6,
      address: 'Golden Gate Park, San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/1006293/pexels-photo-1006293.jpeg'
    },
    {
      id: '6',
      name: 'Museum of Modern Art',
      type: 'Museums & Galleries',
      description: 'Premier modern and contemporary art museum',
      latitude: 37.7857,
      longitude: -122.4011,
      estimatedDuration: 150,
      rating: 4.4,
      address: '151 3rd St, San Francisco, CA 94103',
      imageUrl: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'
    },
    {
      id: '7',
      name: 'Chinatown',
      type: 'Art & Culture',
      description: 'Historic neighborhood with authentic Chinese culture',
      latitude: 37.7941,
      longitude: -122.4078,
      estimatedDuration: 120,
      rating: 4.3,
      address: 'Chinatown, San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/2412603/pexels-photo-2412603.jpeg'
    },
    {
      id: '8',
      name: 'Union Square',
      type: 'Shopping Districts',
      description: 'Central shopping and hotel district',
      latitude: 37.7880,
      longitude: -122.4074,
      estimatedDuration: 90,
      rating: 4.1,
      address: 'Union Square, San Francisco, CA',
      imageUrl: 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg'
    }
  ],
  'new york': [
    {
      id: '9',
      name: 'Central Park',
      type: 'Parks & Nature',
      description: 'Large public park in Manhattan',
      latitude: 40.7829,
      longitude: -73.9654,
      estimatedDuration: 180,
      rating: 4.7,
      address: 'Central Park, New York, NY',
      imageUrl: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg'
    },
    {
      id: '10',
      name: 'Statue of Liberty',
      type: 'Historical Sites',
      description: 'Symbol of freedom and democracy',
      latitude: 40.6892,
      longitude: -74.0445,
      estimatedDuration: 240,
      rating: 4.6,
      address: 'Liberty Island, New York, NY',
      imageUrl: 'https://images.pexels.com/photos/64271/queen-of-liberty-statue-of-liberty-new-york-liberty-statue-64271.jpeg'
    },
    {
      id: '11',
      name: 'Times Square',
      type: 'Nightlife',
      description: 'Bright lights and Broadway theaters',
      latitude: 40.7580,
      longitude: -73.9855,
      estimatedDuration: 90,
      rating: 4.2,
      address: 'Times Square, New York, NY',
      imageUrl: 'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg'
    },
    {
      id: '12',
      name: 'Metropolitan Museum',
      type: 'Museums & Galleries',
      description: 'World-renowned art museum',
      latitude: 40.7794,
      longitude: -73.9632,
      estimatedDuration: 180,
      rating: 4.8,
      address: '1000 5th Ave, New York, NY 10028',
      imageUrl: 'https://images.pexels.com/photos/247676/pexels-photo-247676.jpeg'
    }
  ]
};

export function searchAttractions(city: string, preferences: string[]): Attraction[] {
  const cityKey = city.toLowerCase();
  const attractions = ATTRACTIONS_DB[cityKey] || [];
  
  if (preferences.length === 0) {
    return attractions;
  }
  
  return attractions.filter(attraction => 
    preferences.includes(attraction.type)
  );
}
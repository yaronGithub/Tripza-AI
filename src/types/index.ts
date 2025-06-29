// Core application types

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface Attraction {
  id: string;
  name: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  estimatedDuration: number; // in minutes
  rating: number;
  imageUrl?: string;
  address: string;
  // Enhanced Google Maps fields
  photos?: string[];
  googlePlaceId?: string;
  website?: string;
  phoneNumber?: string;
  priceLevel?: number;
  userRatingsTotal?: number;
  // AI Enhancement
  aiEnhanced?: boolean;
}

export interface DayPlan {
  date: string;
  attractions: Attraction[];
  estimatedTravelTime: number; // total travel time in minutes
  totalDuration: number; // total time including attractions and travel
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  preferences: string[];
  itinerary: DayPlan[];
  isPublic: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  title?: string;
  description?: string;
  aiTravelTips?: string[];
}

export interface TripFormData {
  destination: string;
  startDate: string;
  endDate: string;
  preferences: string[];
}

export const ATTRACTION_TYPES = [
  'Parks & Nature',
  'Museums & Galleries',
  'Historical Sites',
  'Shopping Districts',
  'Restaurants & Foodie Spots',
  'Nightlife',
  'Family-Friendly',
  'Adventure & Outdoors',
  'Art & Culture'
] as const;

export type AttractionType = typeof ATTRACTION_TYPES[number];
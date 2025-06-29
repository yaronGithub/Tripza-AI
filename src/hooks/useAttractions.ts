import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Attraction } from '../types';
import { Database } from '../types/database';
import { enhancedAttractionService } from '../services/enhancedAttractionService';

type DbAttraction = Database['public']['Tables']['attractions']['Row'];

export function useAttractions() {
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAttractions();
  }, []);

  const fetchAttractions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attractions')
        .select('*')
        .order('name');

      if (error) throw error;

      const convertedAttractions = data.map(convertDbAttractionToAttraction);
      setAttractions(convertedAttractions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attractions');
    } finally {
      setLoading(false);
    }
  };

  const searchAttractions = async (city: string, preferences: string[]): Promise<Attraction[]> => {
    try {
      // Use enhanced service that prioritizes Google Maps data
      console.log(`Searching for attractions in ${city} with preferences:`, preferences);
      const attractions = await enhancedAttractionService.searchAttractions(
        city, 
        preferences.length > 0 ? preferences : ['Parks & Nature', 'Museums & Galleries', 'Historical Sites'], 
        20
      );

      return attractions;
    } catch (error) {
      console.error('Error searching attractions:', error);
      
      // Fallback to database results
      let filtered = attractions;

      // Filter by city (simple text matching)
      if (city) {
        const cityLower = city.toLowerCase();
        filtered = filtered.filter(attraction => 
          attraction.address.toLowerCase().includes(cityLower) ||
          attraction.name.toLowerCase().includes(cityLower)
        );
      }

      // Filter by preferences
      if (preferences.length > 0) {
        filtered = filtered.filter(attraction => 
          preferences.includes(attraction.type)
        );
      }

      return filtered;
    }
  };

  return {
    attractions,
    loading,
    error,
    searchAttractions,
    refetch: fetchAttractions,
  };
}

function convertDbAttractionToAttraction(dbAttraction: DbAttraction): Attraction {
  return {
    id: dbAttraction.id,
    name: dbAttraction.name,
    type: dbAttraction.type,
    description: dbAttraction.description,
    latitude: dbAttraction.latitude,
    longitude: dbAttraction.longitude,
    estimatedDuration: dbAttraction.estimated_duration,
    rating: dbAttraction.rating,
    address: dbAttraction.address,
    imageUrl: dbAttraction.image_url,
  };
}
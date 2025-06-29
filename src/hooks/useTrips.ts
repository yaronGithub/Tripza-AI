import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Trip, DayPlan, Attraction } from '../types';
import { Database } from '../types/database';

type DbTrip = Database['public']['Tables']['trips']['Row'];
type DbDayPlan = Database['public']['Tables']['day_plans']['Row'];
type DbAttraction = Database['public']['Tables']['attractions']['Row'];

export function useTrips(userId?: string) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchTrips();
    } else {
      setTrips([]);
      setLoading(false);
    }
  }, [userId]);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const tripsWithItinerary = await Promise.all(
        data.map(async (trip) => await convertDbTripToTrip(trip))
      );

      setTrips(tripsWithItinerary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const saveTrip = async (trip: Trip): Promise<string> => {
    try {
      // Check if trip already exists
      const isUpdate = trip.id && !trip.id.toString().startsWith('local-');
      
      if (isUpdate) {
        // Update existing trip
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .update({
            title: trip.title || `Trip to ${trip.destination}`,
            destination: trip.destination,
            start_date: trip.startDate,
            end_date: trip.endDate,
            preferences: trip.preferences,
            is_public: trip.isPublic,
            description: trip.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', trip.id)
          .select()
          .single();

        if (tripError) throw tripError;
        
        // Delete existing day plans to recreate them
        const { error: deleteDayPlansError } = await supabase
          .from('day_plans')
          .delete()
          .eq('trip_id', trip.id);
          
        if (deleteDayPlansError) throw deleteDayPlansError;
        
        // Insert new day plans and attractions
        await createDayPlansAndAttractions(trip.id, trip.itinerary);
        
        await fetchTrips(); // Refresh trips list
        return trip.id;
      } else {
        // Insert new trip
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .insert({
            user_id: trip.userId,
            title: trip.title || `Trip to ${trip.destination}`,
            destination: trip.destination,
            start_date: trip.startDate,
            end_date: trip.endDate,
            preferences: trip.preferences,
            is_public: trip.isPublic,
            description: trip.description,
          })
          .select()
          .single();

        if (tripError) throw tripError;

        // Insert day plans and attractions
        await createDayPlansAndAttractions(tripData.id, trip.itinerary);

        await fetchTrips(); // Refresh trips list
        return tripData.id;
      }
    } catch (err) {
      console.error('Error saving trip:', err);
      throw new Error(err instanceof Error ? err.message : 'Failed to save trip');
    }
  };

  const createDayPlansAndAttractions = async (tripId: string, itinerary: DayPlan[]) => {
    // Insert day plans and attractions
    for (let i = 0; i < itinerary.length; i++) {
      const dayPlan = itinerary[i];
      
      const { data: dayPlanData, error: dayPlanError } = await supabase
        .from('day_plans')
        .insert({
          trip_id: tripId,
          date: dayPlan.date,
          estimated_travel_time: dayPlan.estimatedTravelTime,
          total_duration: dayPlan.totalDuration,
          day_order: i,
        })
        .select()
        .single();

      if (dayPlanError) throw dayPlanError;

      // Insert day plan attractions
      for (let j = 0; j < dayPlan.attractions.length; j++) {
        const attraction = dayPlan.attractions[j];
        
        // First, ensure attraction exists in database
        let attractionId = attraction.id;
        
        // Check if this is a generated ID (not a UUID)
        if (attraction.id.startsWith('generated-') || attraction.id.startsWith('google-')) {
          // Insert new attraction
          const { data: newAttraction, error: attractionError } = await supabase
            .from('attractions')
            .insert({
              name: attraction.name,
              type: attraction.type,
              description: attraction.description,
              latitude: attraction.latitude,
              longitude: attraction.longitude,
              estimated_duration: attraction.estimatedDuration,
              rating: attraction.rating,
              address: attraction.address,
              image_url: attraction.imageUrl,
            })
            .select()
            .single();

          if (attractionError) throw attractionError;
          attractionId = newAttraction.id;
        } else {
          // Check if attraction exists
          const { data: existingAttraction } = await supabase
            .from('attractions')
            .select('id')
            .eq('id', attraction.id)
            .single();
            
          if (!existingAttraction) {
            // Insert new attraction with the existing ID
            const { data: newAttraction, error: attractionError } = await supabase
              .from('attractions')
              .insert({
                id: attraction.id,
                name: attraction.name,
                type: attraction.type,
                description: attraction.description,
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                estimated_duration: attraction.estimatedDuration,
                rating: attraction.rating,
                address: attraction.address,
                image_url: attraction.imageUrl,
              })
              .select()
              .single();

            if (attractionError) throw attractionError;
            attractionId = newAttraction.id;
          }
        }

        // Link attraction to day plan
        const { error: linkError } = await supabase
          .from('day_plan_attractions')
          .insert({
            day_plan_id: dayPlanData.id,
            attraction_id: attractionId,
            order_index: j,
          });

        if (linkError) throw linkError;
      }
    }
  };

  const deleteTrip = async (tripId: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);

      if (error) throw error;
      await fetchTrips(); // Refresh trips list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete trip');
    }
  };

  const updateTripPublicStatus = async (tripId: string, isPublic: boolean) => {
    try {
      const { error } = await supabase
        .from('trips')
        .update({ is_public: isPublic })
        .eq('id', tripId);

      if (error) throw error;
      await fetchTrips(); // Refresh trips list
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update trip visibility');
    }
  };

  const fetchPublicTrips = async (limit = 20): Promise<Trip[]> => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      const publicTrips = await Promise.all(
        data.map(async (trip) => await convertDbTripToTrip(trip))
      );

      return publicTrips;
    } catch (err) {
      console.error('Error fetching public trips:', err);
      return [];
    }
  };

  return {
    trips,
    loading,
    error,
    saveTrip,
    deleteTrip,
    updateTripPublicStatus,
    fetchPublicTrips,
    refetch: fetchTrips,
  };
}

// Helper function to convert database trip to application Trip type
async function convertDbTripToTrip(dbTrip: DbTrip): Promise<Trip> {
  // Fetch day plans for this trip
  const { data: dayPlans, error: dayPlansError } = await supabase
    .from('day_plans')
    .select(`
      *,
      day_plan_attractions (
        order_index,
        attractions (*)
      )
    `)
    .eq('trip_id', dbTrip.id)
    .order('day_order');

  if (dayPlansError) throw dayPlansError;

  const itinerary: DayPlan[] = dayPlans.map((dayPlan: any) => {
    // Sort attractions by order_index
    const sortedAttractions = [...dayPlan.day_plan_attractions]
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((dpa: any) => convertDbAttractionToAttraction(dpa.attractions));

    return {
      date: dayPlan.date,
      estimatedTravelTime: dayPlan.estimated_travel_time,
      totalDuration: dayPlan.total_duration,
      attractions: sortedAttractions,
    };
  });

  return {
    id: dbTrip.id,
    destination: dbTrip.destination,
    startDate: dbTrip.start_date,
    endDate: dbTrip.end_date,
    preferences: dbTrip.preferences,
    itinerary,
    isPublic: dbTrip.is_public,
    userId: dbTrip.user_id,
    createdAt: dbTrip.created_at,
    updatedAt: dbTrip.updated_at,
    title: dbTrip.title,
    description: dbTrip.description,
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
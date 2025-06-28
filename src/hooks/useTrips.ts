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
      // Insert trip
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
      for (let i = 0; i < trip.itinerary.length; i++) {
        const dayPlan = trip.itinerary[i];
        
        const { data: dayPlanData, error: dayPlanError } = await supabase
          .from('day_plans')
          .insert({
            trip_id: tripData.id,
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
          const { data: existingAttraction } = await supabase
            .from('attractions')
            .select('id')
            .eq('name', attraction.name)
            .eq('latitude', attraction.latitude)
            .eq('longitude', attraction.longitude)
            .single();

          let attractionId = existingAttraction?.id;

          if (!attractionId) {
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

      await fetchTrips(); // Refresh trips list
      return tripData.id;
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to save trip');
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

  return {
    trips,
    loading,
    error,
    saveTrip,
    deleteTrip,
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

  const itinerary: DayPlan[] = dayPlans.map((dayPlan: any) => ({
    date: dayPlan.date,
    estimatedTravelTime: dayPlan.estimated_travel_time,
    totalDuration: dayPlan.total_duration,
    attractions: dayPlan.day_plan_attractions
      .sort((a: any, b: any) => a.order_index - b.order_index)
      .map((dpa: any) => convertDbAttractionToAttraction(dpa.attractions)),
  }));

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
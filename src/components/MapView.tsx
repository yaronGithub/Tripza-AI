import React from 'react';
import { RealMapView } from './RealMapView';
import { GoogleMapView } from './GoogleMapView';
import { DayPlan } from '../types';

interface MapViewProps {
  dayPlans: DayPlan[];
  selectedDay?: number;
  onDaySelect?: (dayIndex: number) => void;
}

export function MapView({ dayPlans, selectedDay = 0, onDaySelect }: MapViewProps) {
  const hasGoogleMapsKey = !!import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Use Google Maps if API key is available, otherwise fall back to OpenStreetMap
  if (hasGoogleMapsKey) {
    return (
      <GoogleMapView 
        dayPlans={dayPlans} 
        selectedDay={selectedDay} 
        onDaySelect={onDaySelect} 
      />
    );
  }

  return (
    <RealMapView 
      dayPlans={dayPlans} 
      selectedDay={selectedDay} 
      onDaySelect={onDaySelect} 
    />
  );
}
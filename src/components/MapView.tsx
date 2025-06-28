import React from 'react';
import { RealMapView } from './RealMapView';
import { DayPlan } from '../types';

interface MapViewProps {
  dayPlans: DayPlan[];
  selectedDay?: number;
  onDaySelect?: (dayIndex: number) => void;
}

export function MapView({ dayPlans, selectedDay = 0, onDaySelect }: MapViewProps) {
  // Use the new real map component
  return (
    <RealMapView 
      dayPlans={dayPlans} 
      selectedDay={selectedDay} 
      onDaySelect={onDaySelect} 
    />
  );
}
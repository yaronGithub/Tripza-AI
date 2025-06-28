import { Attraction, DayPlan, TripFormData } from '../types';

// Calculate distance between two points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Estimate travel time between two attractions (in minutes)
function estimateTravelTime(attraction1: Attraction, attraction2: Attraction): number {
  const distance = calculateDistance(
    attraction1.latitude, attraction1.longitude,
    attraction2.latitude, attraction2.longitude
  );
  // Assume average speed of 20 km/h in city (including walking, traffic, etc.)
  return Math.round(distance * 3); // 3 minutes per km
}

// Advanced clustering algorithm using k-means-like approach
function clusterAttractions(attractions: Attraction[], daysCount: number): Attraction[][] {
  if (attractions.length === 0) return Array(daysCount).fill(null).map(() => []);
  if (daysCount === 1) return [attractions];
  
  // Initialize clusters with attractions spread across the area
  const clusters: Attraction[][] = Array(daysCount).fill(null).map(() => []);
  
  // Find the geographic bounds
  const bounds = {
    minLat: Math.min(...attractions.map(a => a.latitude)),
    maxLat: Math.max(...attractions.map(a => a.latitude)),
    minLng: Math.min(...attractions.map(a => a.longitude)),
    maxLng: Math.max(...attractions.map(a => a.longitude))
  };

  // Create initial cluster centers distributed across the area
  const centers = [];
  for (let i = 0; i < daysCount; i++) {
    centers.push({
      lat: bounds.minLat + (bounds.maxLat - bounds.minLat) * (i / (daysCount - 1 || 1)),
      lng: bounds.minLng + (bounds.maxLng - bounds.minLng) * (i / (daysCount - 1 || 1))
    });
  }

  // Assign each attraction to the nearest cluster center
  attractions.forEach(attraction => {
    let nearestCluster = 0;
    let minDistance = Infinity;

    centers.forEach((center, index) => {
      const distance = calculateDistance(
        attraction.latitude, attraction.longitude,
        center.lat, center.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCluster = index;
      }
    });

    clusters[nearestCluster].push(attraction);
  });

  // Balance clusters - ensure no cluster is empty and none is too large
  const maxAttractionsPerDay = Math.ceil(attractions.length / daysCount) + 2;
  
  for (let i = 0; i < clusters.length; i++) {
    // If cluster is empty, take from the largest cluster
    if (clusters[i].length === 0) {
      const largestClusterIndex = clusters.reduce((maxIndex, cluster, index) => 
        cluster.length > clusters[maxIndex].length ? index : maxIndex, 0);
      
      if (clusters[largestClusterIndex].length > 1) {
        clusters[i].push(clusters[largestClusterIndex].pop()!);
      }
    }
    
    // If cluster is too large, distribute excess to smaller clusters
    while (clusters[i].length > maxAttractionsPerDay) {
      const smallestClusterIndex = clusters.reduce((minIndex, cluster, index) => 
        cluster.length < clusters[minIndex].length ? index : minIndex, 0);
      
      if (smallestClusterIndex !== i) {
        clusters[smallestClusterIndex].push(clusters[i].pop()!);
      } else {
        break; // All clusters are equally large
      }
    }
  }

  // Optimize order within each cluster using nearest neighbor
  return clusters.map(cluster => optimizeClusterOrder(cluster));
}

// Optimize the order of attractions within a cluster using nearest neighbor algorithm
function optimizeClusterOrder(attractions: Attraction[]): Attraction[] {
  if (attractions.length <= 1) return attractions;

  const optimized: Attraction[] = [];
  const remaining = [...attractions];

  // Start with the attraction closest to the cluster center
  const centerLat = attractions.reduce((sum, a) => sum + a.latitude, 0) / attractions.length;
  const centerLng = attractions.reduce((sum, a) => sum + a.longitude, 0) / attractions.length;

  let startIndex = 0;
  let minDistanceToCenter = Infinity;
  
  remaining.forEach((attraction, index) => {
    const distance = calculateDistance(attraction.latitude, attraction.longitude, centerLat, centerLng);
    if (distance < minDistanceToCenter) {
      minDistanceToCenter = distance;
      startIndex = index;
    }
  });

  optimized.push(remaining.splice(startIndex, 1)[0]);

  // Use nearest neighbor to order the rest
  while (remaining.length > 0) {
    const current = optimized[optimized.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    remaining.forEach((attraction, index) => {
      const distance = calculateDistance(
        current.latitude, current.longitude,
        attraction.latitude, attraction.longitude
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    optimized.push(remaining.splice(nearestIndex, 1)[0]);
  }

  return optimized;
}

// Generate optimized itinerary based on form data and available attractions
export function generateItinerary(formData: TripFormData, availableAttractions: Attraction[]): DayPlan[] {
  const { startDate, endDate, preferences } = formData;
  
  // If no attractions available, return empty itinerary
  if (availableAttractions.length === 0) {
    console.warn('No attractions available for itinerary generation');
    return [];
  }

  // Filter attractions based on preferences
  let filteredAttractions = availableAttractions;
  if (preferences.length > 0) {
    filteredAttractions = availableAttractions.filter(attraction => 
      preferences.includes(attraction.type)
    );
    
    // If filtering by preferences results in too few attractions, include some others
    if (filteredAttractions.length < 5) {
      const additionalAttractions = availableAttractions
        .filter(attraction => !preferences.includes(attraction.type))
        .slice(0, Math.max(0, 10 - filteredAttractions.length));
      filteredAttractions = [...filteredAttractions, ...additionalAttractions];
    }
  }

  // Calculate number of days
  const start = new Date(startDate);
  const end = new Date(endDate);
  const timeDiff = end.getTime() - start.getTime();
  const daysCount = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

  // Limit attractions per day to reasonable number (3-6 attractions per day)
  const maxAttractionsPerDay = 6;
  const totalAttractions = Math.min(filteredAttractions.length, daysCount * maxAttractionsPerDay);
  const selectedAttractions = filteredAttractions.slice(0, totalAttractions);

  // Cluster attractions by day
  const clusters = clusterAttractions(selectedAttractions, daysCount);
  
  // Create day plans
  const itinerary: DayPlan[] = [];
  
  for (let i = 0; i < daysCount; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    const dayAttractions = clusters[i] || [];
    
    // Calculate total travel time for the day
    let totalTravelTime = 0;
    for (let j = 1; j < dayAttractions.length; j++) {
      totalTravelTime += estimateTravelTime(dayAttractions[j - 1], dayAttractions[j]);
    }
    
    // Calculate total duration (attractions + travel)
    const attractionTime = dayAttractions.reduce((sum, attr) => sum + attr.estimatedDuration, 0);
    const totalDuration = attractionTime + totalTravelTime;
    
    itinerary.push({
      date: currentDate.toISOString().split('T')[0],
      attractions: dayAttractions,
      estimatedTravelTime: totalTravelTime,
      totalDuration
    });
  }
  
  return itinerary;
}
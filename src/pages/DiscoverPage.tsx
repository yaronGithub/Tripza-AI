import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Calendar, Users, Star, Copy, Eye, Heart, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { Trip } from '../types';
import { ItineraryDisplay } from '../components/ItineraryDisplay';

export function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [publicTrips, setPublicTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedTrips, setLikedTrips] = useState<Set<string>>(new Set());
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  const { user } = useAuth();
  const { saveTrip } = useTrips(user?.id);

  // Mock public trips data - in real app, this would come from Supabase
  useEffect(() => {
    // Simulate loading public trips
    setTimeout(() => {
      const mockPublicTrips: Trip[] = [
        {
          id: 'public-1',
          title: 'San Francisco Food & Culture Tour',
          destination: 'San Francisco, CA',
          startDate: '2024-07-15',
          endDate: '2024-07-17',
          preferences: ['Restaurants & Foodie Spots', 'Art & Culture', 'Historical Sites'],
          itinerary: [],
          isPublic: true,
          userId: 'user-1',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-15T10:00:00Z',
          description: 'A perfect 3-day culinary journey through San Francisco\'s best neighborhoods, featuring iconic restaurants, local markets, and cultural landmarks.'
        },
        {
          id: 'public-2',
          title: 'NYC Museums & Parks Adventure',
          destination: 'New York, NY',
          startDate: '2024-08-01',
          endDate: '2024-08-04',
          preferences: ['Museums & Galleries', 'Parks & Nature', 'Historical Sites'],
          itinerary: [],
          isPublic: true,
          userId: 'user-2',
          createdAt: '2024-01-10T14:30:00Z',
          updatedAt: '2024-01-10T14:30:00Z',
          description: 'Explore the best of NYC\'s cultural scene with world-class museums, beautiful parks, and iconic landmarks.'
        },
        {
          id: 'public-3',
          title: 'Golden Gate to Alcatraz',
          destination: 'San Francisco, CA',
          startDate: '2024-06-20',
          endDate: '2024-06-22',
          preferences: ['Historical Sites', 'Parks & Nature', 'Adventure & Outdoors'],
          itinerary: [],
          isPublic: true,
          userId: 'user-3',
          createdAt: '2024-01-05T09:15:00Z',
          updatedAt: '2024-01-05T09:15:00Z',
          description: 'Experience San Francisco\'s most iconic attractions with optimized routes and insider tips.'
        }
      ];
      setPublicTrips(mockPublicTrips);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTrips = publicTrips.filter(trip => {
    const matchesSearch = trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && trip.preferences.includes(selectedFilter);
  });

  const handleCopyTrip = async (trip: Trip) => {
    if (!user) {
      alert('Please sign in to copy trips');
      return;
    }

    try {
      const copiedTrip: Trip = {
        ...trip,
        id: Date.now().toString(),
        userId: user.id,
        isPublic: false,
        title: `${trip.title} (Copy)`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveTrip(copiedTrip);
      alert('Trip copied to your account!');
    } catch (error) {
      alert('Failed to copy trip. Please try again.');
    }
  };

  const handleLikeTrip = (tripId: string) => {
    const newLikedTrips = new Set(likedTrips);
    if (likedTrips.has(tripId)) {
      newLikedTrips.delete(tripId);
    } else {
      newLikedTrips.add(tripId);
    }
    setLikedTrips(newLikedTrips);
  };

  const handleViewTrip = (trip: Trip) => {
    setSelectedTrip(trip);
  };

  const handleBackToDiscover = () => {
    setSelectedTrip(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} day${days !== 1 ? 's' : ''}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Discovering amazing trips...</p>
        </div>
      </div>
    );
  }

  // If a trip is selected, show the detailed view
  if (selectedTrip) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto mb-6">
          <button
            onClick={handleBackToDiscover}
            className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
          >
            <X className="w-4 h-4 mr-2" />
            Back to Discover
          </button>
        </div>
        <ItineraryDisplay trip={selectedTrip} />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Trips
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore handcrafted itineraries from fellow travelers and find inspiration for your next adventure
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destinations, activities, or trip names..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filter */}
            <div className="lg:w-64">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Categories</option>
                  <option value="Parks & Nature">Parks & Nature</option>
                  <option value="Museums & Galleries">Museums & Galleries</option>
                  <option value="Historical Sites">Historical Sites</option>
                  <option value="Restaurants & Foodie Spots">Food & Dining</option>
                  <option value="Art & Culture">Art & Culture</option>
                  <option value="Adventure & Outdoors">Adventure</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Trip Grid */}
        {filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 group"
              >
                {/* Trip Header */}
                <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-xl font-bold text-white mb-1 line-clamp-2">
                      {trip.title}
                    </h3>
                    <p className="text-blue-100 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {trip.destination}
                    </p>
                  </div>
                  
                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeTrip(trip.id)}
                    className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
                  >
                    <Heart 
                      className={`w-5 h-5 ${
                        likedTrips.has(trip.id) 
                          ? 'text-red-500 fill-current' 
                          : 'text-white'
                      }`} 
                    />
                  </button>
                </div>

                {/* Trip Details */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-1" />
                      {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getDuration(trip.startDate, trip.endDate)}
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {trip.description}
                  </p>

                  {/* Preferences */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {trip.preferences.slice(0, 2).map((pref) => (
                        <span
                          key={pref}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {pref}
                        </span>
                      ))}
                      {trip.preferences.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                          +{trip.preferences.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        <Star className="w-4 h-4 inline mr-1" />
                        4.8
                      </div>
                      <div className="text-xs text-gray-600">Rating</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        <Users className="w-4 h-4 inline mr-1" />
                        {Math.floor(Math.random() * 50) + 10}
                      </div>
                      <div className="text-xs text-gray-600">Travelers</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button 
                      onClick={() => handleViewTrip(trip)}
                      className="flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleCopyTrip(trip)}
                      className="flex items-center text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy Trip
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No trips found</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Try adjusting your search terms or filters to discover more amazing trips.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
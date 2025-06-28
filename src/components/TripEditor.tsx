import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { GripVertical, Plus, Trash2, Search, Clock, Star, MapPin } from 'lucide-react';
import { Trip, Attraction, DayPlan } from '../types';
import { useAttractions } from '../hooks/useAttractions';

interface TripEditorProps {
  trip: Trip;
  onTripUpdate: (updatedTrip: Trip) => void;
  onSave: () => void;
  onCancel: () => void;
}

export function TripEditor({ trip, onTripUpdate, onSave, onCancel }: TripEditorProps) {
  const [selectedDay, setSelectedDay] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { searchAttractions } = useAttractions();

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const dayIndex = parseInt(result.destination.droppableId.split('-')[1]);
    const sourceIndex = result.source.index;
    const destIndex = result.destination.index;

    const updatedTrip = { ...trip };
    const dayPlan = updatedTrip.itinerary[dayIndex];
    const [removed] = dayPlan.attractions.splice(sourceIndex, 1);
    dayPlan.attractions.splice(destIndex, 0, removed);

    // Recalculate day totals
    updateDayTotals(dayPlan);
    onTripUpdate(updatedTrip);
  };

  const updateDayTotals = (dayPlan: DayPlan) => {
    const attractionTime = dayPlan.attractions.reduce((sum, attr) => sum + attr.estimatedDuration, 0);
    const travelTime = dayPlan.attractions.length > 1 ? (dayPlan.attractions.length - 1) * 15 : 0; // Simplified
    dayPlan.totalDuration = attractionTime + travelTime;
    dayPlan.estimatedTravelTime = travelTime;
  };

  const removeAttraction = (dayIndex: number, attractionIndex: number) => {
    const updatedTrip = { ...trip };
    updatedTrip.itinerary[dayIndex].attractions.splice(attractionIndex, 1);
    updateDayTotals(updatedTrip.itinerary[dayIndex]);
    onTripUpdate(updatedTrip);
  };

  const addAttraction = (dayIndex: number, attraction: Attraction) => {
    const updatedTrip = { ...trip };
    updatedTrip.itinerary[dayIndex].attractions.push(attraction);
    updateDayTotals(updatedTrip.itinerary[dayIndex]);
    onTripUpdate(updatedTrip);
    setShowSearch(false);
    setSearchQuery('');
  };

  const searchResults = searchQuery.length > 2 
    ? searchAttractions(trip.destination, []).filter(attr => 
        attr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        attr.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Edit Trip to {trip.destination}
              </h1>
              <p className="text-purple-100">Customize your itinerary by reordering or adding attractions</p>
            </div>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 bg-white/20 text-white rounded-lg hover:bg-white/30 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onSave}
                className="px-4 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Day Selector & Search */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Day</h3>
            
            {/* Day Tabs */}
            <div className="space-y-2 mb-6">
              {trip.itinerary.map((day, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedDay(index)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedDay === index
                      ? 'bg-purple-100 text-purple-700 border border-purple-200'
                      : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="font-medium">Day {index + 1}</div>
                  <div className="text-sm opacity-75">
                    {day.attractions.length} attractions • {formatDuration(day.totalDuration)}
                  </div>
                </button>
              ))}
            </div>

            {/* Add Attraction */}
            <div>
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Attraction
              </button>

              {showSearch && (
                <div className="mt-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search attractions..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                      {searchResults.map((attraction) => (
                        <button
                          key={attraction.id}
                          onClick={() => addAttraction(selectedDay, attraction)}
                          className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <div className="font-medium text-gray-900 text-sm">{attraction.name}</div>
                          <div className="text-xs text-gray-600 flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {formatDuration(attraction.estimatedDuration)}
                            <Star className="w-3 h-3 ml-2 mr-1 text-yellow-400" />
                            {attraction.rating}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Day Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                Day {selectedDay + 1} - {new Date(trip.itinerary[selectedDay].date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric'
                })}
              </h2>
              <div className="text-sm text-gray-600 mt-1">
                {trip.itinerary[selectedDay].attractions.length} attractions • 
                {formatDuration(trip.itinerary[selectedDay].totalDuration)} total time
              </div>
            </div>

            <div className="p-6">
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId={`day-${selectedDay}`}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {trip.itinerary[selectedDay].attractions.map((attraction, index) => (
                        <Draggable
                          key={attraction.id}
                          draggableId={attraction.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-start space-x-4 p-4 rounded-xl border-2 transition-all ${
                                snapshot.isDragging
                                  ? 'border-purple-300 bg-purple-50 shadow-lg'
                                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                              }`}
                            >
                              {/* Drag Handle */}
                              <div
                                {...provided.dragHandleProps}
                                className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 cursor-grab"
                              >
                                <GripVertical className="w-5 h-5" />
                              </div>

                              {/* Order Number */}
                              <div className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {index + 1}
                              </div>

                              {/* Attraction Image */}
                              <div className="flex-shrink-0">
                                {attraction.imageUrl ? (
                                  <img
                                    src={attraction.imageUrl}
                                    alt={attraction.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                  />
                                ) : (
                                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-400 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-8 h-8 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* Attraction Details */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                  {attraction.name}
                                </h3>
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {attraction.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500">
                                  <span className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {formatDuration(attraction.estimatedDuration)}
                                  </span>
                                  <span className="flex items-center">
                                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                                    {attraction.rating}
                                  </span>
                                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                    {attraction.type}
                                  </span>
                                </div>
                              </div>

                              {/* Remove Button */}
                              <button
                                onClick={() => removeAttraction(selectedDay, index)}
                                className="flex-shrink-0 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {trip.itinerary[selectedDay].attractions.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                          <MapPin className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                          <p className="text-lg font-medium mb-2">No attractions planned</p>
                          <p className="text-sm">Use the search above to add attractions to this day</p>
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
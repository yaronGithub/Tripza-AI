import React, { useState, useEffect } from 'react';
import { Camera, MapPin, Smile, X, Image as ImageIcon, Calendar, Users, Eye } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTrips } from '../hooks/useTrips';
import { useSocial } from '../hooks/useSocial';
import { Trip } from '../types';
import { useToast } from './NotificationToast';

interface CreatePostProps {
  onClose: () => void;
  selectedTrip?: Trip;
}

export function CreatePost({ onClose, selectedTrip }: CreatePostProps) {
  const [caption, setCaption] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [trip, setTrip] = useState<Trip | null>(selectedTrip || null);
  const [isPosting, setIsPosting] = useState(false);
  
  const { user } = useAuth();
  const { trips } = useTrips(user?.id);
  const { createPost } = useSocial();
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (selectedTrip) {
      setTrip(selectedTrip);
      // Generate a suggested caption based on the trip
      const suggestedCaption = `Just planned an amazing trip to ${selectedTrip.destination}! ${
        selectedTrip.preferences.length > 0 
          ? `Can't wait to explore the ${selectedTrip.preferences.slice(0, 2).join(' and ')}!` 
          : ''
      } #TripzaAI #Travel`;
      setCaption(suggestedCaption);
    }
  }, [selectedTrip]);

  const handlePost = async () => {
    if (!caption.trim()) return;

    setIsPosting(true);
    
    try {
      await createPost(caption, trip?.id || null, selectedImages);
      showSuccess('Post Created', 'Your trip has been shared successfully!');
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      showError('Post Failed', 'There was an error sharing your trip. Please try again.');
    } finally {
      setIsPosting(false);
    }
  };

  const addSampleImages = () => {
    // Use destination-specific images if available
    let sampleImages = [
      'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=800'
    ];
    
    if (trip) {
      const destination = trip.destination.toLowerCase();
      if (destination.includes('paris')) {
        sampleImages = [
          'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1850619/pexels-photo-1850619.jpeg?auto=compress&cs=tinysrgb&w=800'
        ];
      } else if (destination.includes('tokyo')) {
        sampleImages = [
          'https://images.pexels.com/photos/2506923/pexels-photo-2506923.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/2187605/pexels-photo-2187605.jpeg?auto=compress&cs=tinysrgb&w=800'
        ];
      } else if (destination.includes('new york')) {
        sampleImages = [
          'https://images.pexels.com/photos/802024/pexels-photo-802024.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800',
          'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800'
        ];
      }
    }
    
    setSelectedImages(sampleImages);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Share Your Trip</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {/* User Info */}
          <div className="flex items-center mb-6">
            <img
              src={user?.user_metadata?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.user_metadata?.name || 'User')}&background=6366f1&color=fff`}
              alt={user?.user_metadata?.name || 'User'}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
            />
            <div className="ml-3">
              <div className="font-bold text-gray-900">{user?.user_metadata?.name || 'Your Name'}</div>
              <div className="text-sm text-gray-600">Sharing to your followers</div>
            </div>
          </div>

          {/* Trip Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <MapPin className="w-4 h-4 inline mr-2" />
              Select a trip to share (optional)
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <button
                onClick={() => setTrip(null)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                  !trip
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-gray-900">No trip selected</div>
                <div className="text-sm text-gray-600">Share a general travel post</div>
              </button>
              
              {trips.map((tripOption) => (
                <button
                  key={tripOption.id}
                  onClick={() => setTrip(tripOption)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    trip?.id === tripOption.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900">{tripOption.title || `Trip to ${tripOption.destination}`}</div>
                  <div className="text-sm text-gray-600 flex items-center mt-1">
                    <MapPin className="w-3 h-3 mr-1" />
                    <span>{tripOption.destination}</span>
                    <span className="mx-2">•</span>
                    <Calendar className="w-3 h-3 mr-1" />
                    <span>{new Date(tripOption.startDate).toLocaleDateString()}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Caption */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              What's your story?
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Share your travel experience, tips, or favorite moments from this trip..."
              className="w-full h-32 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              maxLength={500}
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {caption.length}/500
            </div>
          </div>

          {/* Photos */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              <Camera className="w-4 h-4 inline mr-2" />
              Add photos
            </label>
            
            {selectedImages.length > 0 ? (
              <div className="grid grid-cols-3 gap-3 mb-4">
                {selectedImages.map((image, index) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Selected ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => setSelectedImages(selectedImages.filter((_, i) => i !== index))}
                      className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600 mb-4">Add photos from your trip</p>
                <button
                  onClick={addSampleImages}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Sample Photos
                </button>
              </div>
            )}
          </div>

          {/* Additional Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-gray-600 mr-3" />
                <span className="font-medium text-gray-900">Share with followers</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-gray-600 mr-3" />
                <span className="font-medium text-gray-900">Add to public discovery</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 rounded-full hover:bg-blue-50 transition-colors">
                <MapPin className="w-5 h-5" />
              </button>
            </div>
            
            <button
              onClick={handlePost}
              disabled={!caption.trim() || isPosting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isPosting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Posting...
                </>
              ) : (
                'Share Trip'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
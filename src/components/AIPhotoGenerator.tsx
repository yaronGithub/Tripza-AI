import React, { useState } from 'react';
import { Camera, Sparkles, Image as ImageIcon, Loader2, X, Download, Share2, Copy } from 'lucide-react';

interface AIPhotoGeneratorProps {
  destination: string;
  preferences: string[];
  className?: string;
}

export function AIPhotoGenerator({ destination, preferences, className = '' }: AIPhotoGeneratorProps) {
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPromptInput, setShowPromptInput] = useState(false);

  const generateImages = async (customPrompt?: string) => {
    setLoading(true);
    
    try {
      // In a real implementation, this would call an AI image generation API
      // For demo purposes, we'll use placeholder images
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Use travel-related placeholder images
      const placeholderImages = [
        'https://images.pexels.com/photos/1796715/pexels-photo-1796715.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/3889843/pexels-photo-3889843.jpeg?auto=compress&cs=tinysrgb&w=800',
        'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=800'
      ];
      
      setGeneratedImages(placeholderImages);
      setShowPromptInput(false);
    } catch (error) {
      console.error('Error generating images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      generateImages(prompt);
    }
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-4">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mr-3">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Travel Photos</h3>
            <p className="text-purple-100 text-sm">Generate stunning images of {destination}</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Prompt Input */}
        {showPromptInput ? (
          <form onSubmit={handlePromptSubmit} className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Describe the travel photo you want to generate
            </label>
            <div className="flex">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`A beautiful scene of ${destination} featuring ${preferences[0] || 'nature'}`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-purple-600 text-white rounded-r-lg hover:bg-purple-700 transition-colors"
                disabled={loading}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-2 text-right">
              <button
                type="button"
                onClick={() => setShowPromptInput(false)}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="mb-6">
            <button
              onClick={() => generateImages()}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Generating images...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate AI Travel Photos
                </>
              )}
            </button>
            <button
              onClick={() => setShowPromptInput(true)}
              className="w-full mt-2 text-sm text-purple-600 hover:text-purple-700"
            >
              Customize prompt
            </button>
          </div>
        )}

        {/* Generated Images */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg animate-pulse flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-gray-400" />
              </div>
            ))}
          </div>
        ) : generatedImages.length > 0 ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {generatedImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Generated travel image of ${destination} ${index + 1}`}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <Download className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <Share2 className="w-5 h-5 text-white" />
                      </button>
                      <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                        <Copy className="w-5 h-5 text-white" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <button
                onClick={() => generateImages()}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Generate More
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">No images generated yet</h4>
            <p className="text-gray-600 mb-4">Generate AI travel photos to visualize your trip</p>
          </div>
        )}

        {/* AI Features */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="p-3 bg-purple-50 rounded-lg border border-purple-100">
            <div className="flex items-center mb-1">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-purple-800">AI Generated</span>
            </div>
            <p className="text-xs text-purple-700">Beautiful travel photos created by AI</p>
          </div>
          
          <div className="p-3 bg-pink-50 rounded-lg border border-pink-100">
            <div className="flex items-center mb-1">
              <Camera className="w-4 h-4 text-pink-600 mr-2" />
              <span className="text-sm font-medium text-pink-800">Custom Prompts</span>
            </div>
            <p className="text-xs text-pink-700">Create exactly what you imagine</p>
          </div>
        </div>
      </div>
    </div>
  );
}
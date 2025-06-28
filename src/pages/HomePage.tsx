import React from 'react';
import { ArrowRight, Sparkles, Map, Users, Clock } from 'lucide-react';

interface HomePageProps {
  onNavigateToCreate: () => void;
}

export function HomePage({ onNavigateToCreate }: HomePageProps) {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Planning',
      description: 'Intelligent algorithms create personalized itineraries based on your interests and travel style.'
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: 'Route Optimization',
      description: 'Geographic clustering minimizes travel time and maximizes your experience at each destination.'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Social Sharing',
      description: 'Share your trips with friends or discover amazing itineraries from fellow travelers.'
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Time Savings',
      description: 'From 8 hours of planning to 5 minutes of intelligent itinerary generation.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      location: 'San Francisco, CA',
      text: 'TripCraft planned my entire European adventure in minutes. The route optimization saved me hours of travel time!',
      rating: 5
    },
    {
      name: 'Mike Rodriguez',
      location: 'Austin, TX',
      text: 'As someone who hates planning, this app is a game-changer. Smart, intuitive, and beautifully designed.',
      rating: 5
    },
    {
      name: 'Emma Thompson',
      location: 'London, UK',
      text: 'The collaborative features made planning our group trip so easy. Everyone could contribute and see updates in real-time.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Turn
              <span className="bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
                {' '}8 hours{' '}
              </span>
              of planning into
              <span className="bg-gradient-to-r from-orange-500 to-blue-600 bg-clip-text text-transparent">
                {' '}5 minutes{' '}
              </span>
              of adventure
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              TripCraft uses intelligent algorithms to create personalized travel itineraries with optimized routes, 
              turning overwhelming trip planning into a delightful 5-minute experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onNavigateToCreate}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-orange-500 text-white text-lg font-semibold rounded-xl hover:from-blue-700 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl group"
              >
                Start Planning Your Trip
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-semibold rounded-xl hover:border-blue-400 hover:text-blue-600 transition-all duration-200">
                Watch Demo
              </button>
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-orange-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-green-200/30 rounded-full blur-3xl"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why TripCraft Changes Everything
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Intelligent travel planning that adapts to your preferences and optimizes your experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-2xl bg-gradient-to-b from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-orange-500 rounded-xl flex items-center justify-center text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Three Simple Steps to Your Perfect Trip
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tell Us Your Dream</h3>
              <p className="text-gray-600">
                Enter your destination, travel dates, and select what interests you most from our curated categories.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI Creates Magic</h3>
              <p className="text-gray-600">
                Our intelligent algorithms generate a personalized itinerary with geographically optimized daily plans.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-green-600 to-green-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Explore & Enjoy</h3>
              <p className="text-gray-600">
                Customize your itinerary, view it on interactive maps, and share with friends. Your perfect trip awaits!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Loved by Travelers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-gradient-to-b from-gray-50 to-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.location}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-orange-500">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Travel Planning?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who've discovered the joy of effortless trip planning
          </p>
          <button
            onClick={onNavigateToCreate}
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 text-lg font-semibold rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl group"
          >
            Start Your Free Trip Plan
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
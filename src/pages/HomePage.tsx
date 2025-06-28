import React from 'react';
import { ArrowRight, Sparkles, Map, Users, Clock, Star, Globe, Zap, Heart, Award } from 'lucide-react';

interface HomePageProps {
  onNavigateToCreate: () => void;
}

export function HomePage({ onNavigateToCreate }: HomePageProps) {
  const features = [
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: 'AI-Powered Intelligence',
      description: 'Advanced OpenAI integration creates personalized itineraries that understand your unique travel style and preferences.',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: <Map className="w-6 h-6" />,
      title: 'Real-Time Maps & Directions',
      description: 'Google Maps integration with live traffic data, turn-by-turn directions, and optimized routing for maximum efficiency.',
      color: 'from-green-500 to-blue-600'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Destination Coverage',
      description: 'Plan trips to any destination worldwide with real attraction data, local insights, and cultural recommendations.',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning-Fast Generation',
      description: 'Complete personalized itineraries generated in under 30 seconds using advanced algorithms and real-time data.',
      color: 'from-orange-500 to-red-600'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      location: 'San Francisco, CA',
      text: 'TripCraft planned my entire European adventure in minutes. The AI recommendations were spot-on and the route optimization saved me hours!',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Mike Rodriguez',
      location: 'Austin, TX',
      text: 'As someone who hates planning, this app is a game-changer. The Google Maps integration and real-time directions made navigation effortless.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
    },
    {
      name: 'Emma Thompson',
      location: 'London, UK',
      text: 'The collaborative features made planning our group trip so easy. Beautiful interface, smart suggestions, and flawless execution.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Trips Planned', icon: <Map className="w-5 h-5" /> },
    { number: '98%', label: 'User Satisfaction', icon: <Heart className="w-5 h-5" /> },
    { number: '200+', label: 'Cities Covered', icon: <Globe className="w-5 h-5" /> },
    { number: '4.9★', label: 'Average Rating', icon: <Star className="w-5 h-5" /> }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-blue-800 mb-8 border border-blue-200">
              <Award className="w-4 h-4 mr-2" />
              #1 AI-Powered Trip Planner
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Turn
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 bg-clip-text text-transparent">
                {' '}8 hours{' '}
              </span>
              of planning into
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-blue-600 bg-clip-text text-transparent">
                {' '}30 seconds{' '}
              </span>
              of magic
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Experience the future of travel planning with AI-powered itineraries, real-time Google Maps integration, 
              and intelligent route optimization that creates perfect trips in seconds, not hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <button
                onClick={onNavigateToCreate}
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 text-white text-lg font-bold rounded-2xl hover:from-blue-700 hover:via-purple-700 hover:to-orange-600 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
              >
                <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
                Start Planning with AI
                <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-2 transition-transform" />
              </button>
              
              <button className="inline-flex items-center px-8 py-4 border-2 border-gray-300 text-gray-700 text-lg font-bold rounded-2xl hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 hover:shadow-lg">
                <Globe className="w-6 h-6 mr-3" />
                Watch Demo
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl mb-3">
                    <div className="text-blue-600">{stat.icon}</div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-orange-200/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-white rounded-full text-sm font-medium text-blue-800 mb-6 shadow-lg">
              <Zap className="w-4 h-4 mr-2" />
              Powered by Advanced AI
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Why TripCraft Changes Everything
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the next generation of travel planning with cutting-edge AI technology and real-time integrations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 rounded-3xl bg-white border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
                <div className={`w-16 h-16 mb-6 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Three Simple Steps to Your Perfect Trip
            </h2>
            <p className="text-xl text-gray-600">
              Our AI does the heavy lifting while you focus on the excitement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: 1,
                title: 'Tell Us Your Dream',
                description: 'Enter your destination, travel dates, and select what interests you most from our curated categories.',
                color: 'from-blue-500 to-blue-600',
                icon: '🎯'
              },
              {
                step: 2,
                title: 'AI Creates Magic',
                description: 'Our advanced AI analyzes millions of data points to generate a personalized itinerary with optimized routes.',
                color: 'from-purple-500 to-purple-600',
                icon: '🤖'
              },
              {
                step: 3,
                title: 'Explore & Enjoy',
                description: 'Get real-time directions, beautiful images, and seamless navigation. Your perfect trip awaits!',
                color: 'from-orange-500 to-orange-600',
                icon: '✨'
              }
            ].map((item, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 mx-auto mb-8 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Loved by Travelers Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of happy travelers who've discovered the joy of effortless planning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-gray-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex items-center mb-6">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-bold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-8">
            Ready to Transform Your Travel Planning?
          </h2>
          <p className="text-xl text-blue-100 mb-12 leading-relaxed">
            Join the AI revolution in travel planning. Create your first intelligent itinerary in under 30 seconds.
          </p>
          <button
            onClick={onNavigateToCreate}
            className="group inline-flex items-center px-10 py-5 bg-white text-blue-600 text-xl font-bold rounded-2xl hover:bg-blue-50 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2"
          >
            <Sparkles className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
            Start Your AI-Powered Trip
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
}
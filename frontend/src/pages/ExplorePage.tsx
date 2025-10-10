import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, MapPin, Sparkles, ArrowRight, Clock, Compass } from 'lucide-react';

const mockDestinations = [
  {
    id: '1',
    name: 'Tropical Bali',
    description: 'Perfect beaches and cultural temples',
    theme: 'Beach',
    season: 'Best in April-September',
    distance: '12 hours from home',
    color: 'from-blue-500/20 to-cyan-500/20'
  },
  {
    id: '2', 
    name: 'Mountain Japan',
    description: 'Cherry blossoms and ancient traditions',
    theme: 'Cultural',
    season: 'Best in March-May',
    distance: '14 hours from home',
    color: 'from-pink-500/20 to-rose-500/20'
  },
  {
    id: '3',
    name: 'Coastal Goa',
    description: 'Vibrant beaches and Portuguese heritage', 
    theme: 'Beach',
    season: 'Best in November-March',
    distance: '8 hours from home',
    color: 'from-purple-500/20 to-indigo-500/20'
  }
];

export const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const filteredDestinations = mockDestinations.filter((dest) =>
    dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dest.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDestinationPress = (destination: any) => {
    const countryName = destination.name.split(' ')[1];
    navigate(`/organize/${encodeURIComponent(countryName)}`);
  };

  const filters = [
    { id: 'distance', label: 'Distance', icon: MapPin },
    { id: 'season', label: 'Season', icon: Clock },
    { id: 'theme', label: 'Theme', icon: Sparkles },
    { id: 'lucky', label: "I'm feeling lucky", icon: Compass }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Static grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Gradient orbs */}
      <div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          opacity: 0.12,
        }}
      />
      <div
        className="absolute bottom-0 left-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)',
          opacity: 0.12,
        }}
      />

      {/* Header */}
      <motion.div 
        className="relative z-10 p-4 md:p-6 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10">
            <Compass className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Explore
            </h1>
          </div>
        </div>
        <p className="text-gray-400 text-base md:text-lg ml-14">Discover your next adventure</p>
      </motion.div>

      {/* Search Bar */}
      <motion.div 
        className="relative z-10 px-4 md:px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 text-white pl-12 pr-4 py-4 rounded-2xl placeholder-gray-400 focus:outline-none focus:border-white/30 transition-colors"
            placeholder="Where do you want to go?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </motion.div>

      {/* Filter Buttons */}
      <motion.div 
        className="relative z-10 px-4 md:px-6 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((filter) => (
            <motion.button
              key={filter.id}
              onClick={() => setActiveFilter(activeFilter === filter.id ? null : filter.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-all duration-300 ${
                activeFilter === filter.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border border-indigo-400/50'
                  : 'bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 text-gray-300 hover:border-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <filter.icon size={16} />
              {filter.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Map Placeholder */}
      <motion.div 
        className="relative z-10 mx-4 md:mx-6 mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="relative h-48 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden group hover:border-white/20 transition-colors">
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className="p-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 mb-3"
              whileHover={{ scale: 1.1 }}
            >
              <MapPin className="text-indigo-400" size={32} />
            </motion.div>
            <span className="text-gray-400 font-medium">Interactive Map</span>
            <span className="text-gray-500 text-sm mt-1">Coming Soon</span>
          </div>
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </motion.div>

      {/* Destinations Section */}
      <div className="relative z-10 px-4 md:px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h2 className="text-xl md:text-2xl font-bold text-white">Recommended Destinations</h2>
          </div>
          
          <div className="space-y-4">
            {filteredDestinations.map((destination, index) => (
              <motion.button
                key={destination.id}
                onClick={() => handleDestinationPress(destination)}
                className="group w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                whileHover={{ y: -4, scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-start gap-4 p-5">
                  {/* Destination Icon/Image */}
                  <div className={`relative flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br ${destination.color} border border-white/20 flex items-center justify-center overflow-hidden`}>
                    <span className="text-white font-bold text-xl z-10">
                      {destination.name.split(' ')[1]?.slice(0, 2).toUpperCase() || destination.name.slice(0, 2).toUpperCase()}
                    </span>
                    {/* Subtle pattern overlay */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1)_0%,transparent_100%)]" />
                  </div>

                  {/* Destination Info */}
                  <div className="flex-1 text-left min-w-0">
                    <h3 className="text-white text-lg md:text-xl font-bold mb-1 group-hover:text-indigo-300 transition-colors">
                      {destination.name}
                    </h3>
                    <p className="text-gray-400 text-sm md:text-base mb-3 line-clamp-2">
                      {destination.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/10">
                        <Clock size={12} />
                        {destination.season}
                      </span>
                      <span className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 backdrop-blur-sm rounded-full text-xs text-gray-300 border border-white/10">
                        <MapPin size={12} />
                        {destination.distance}
                      </span>
                    </div>
                  </div>

                  {/* Arrow Icon */}
                  <div className="flex-shrink-0 self-center">
                    <div className="w-10 h-10 rounded-full bg-white/5 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-purple-500 flex items-center justify-center transition-all duration-300">
                      <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-300" />
                    </div>
                  </div>
                </div>

                {/* Hover gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${destination.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Plane, Car, Calendar, Users, Clock, Hotel, Coffee, CheckCircle2, Sparkles } from 'lucide-react';

export const ItineraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const country = searchParams.get('country') || 'Destination';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const travelers = searchParams.get('travelers') || '2';
  const homeLocation = searchParams.get('homeLocation') || 'Your City';
  const duration = searchParams.get('duration') || '7';

  const mockItinerary = [
    {
      day: 1,
      city: country,
      activities: ['Arrive at airport', 'Check into hotel', 'Explore local area'],
      transport: 'flight',
      color: 'from-blue-500/20 to-cyan-500/20'
    },
    {
      day: 2,
      city: country,
      activities: ['Cultural tour', 'Local cuisine tasting', 'Evening leisure'],
      transport: 'car',
      color: 'from-purple-500/20 to-pink-500/20'
    },
    {
      day: 3,
      city: `${country} - Day Trip`,
      activities: ['Adventure activity', 'Scenic views', 'Traditional experience'],
      transport: 'car',
      color: 'from-indigo-500/20 to-purple-500/20'
    }
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
        className="relative z-10 p-4 md:p-6 border-b border-white/10 backdrop-blur-sm bg-black/50"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-4">
          <motion.button 
            onClick={() => navigate(-1)} 
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowLeft size={24} />
          </motion.button>
          
          <div className="flex-1">
            <motion.h1 
              className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your {country} Itinerary
            </motion.h1>
            <motion.div 
              className="flex items-center gap-3 mt-1 text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <span className="flex items-center gap-1">
                <Clock size={14} />
                {duration} days
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users size={14} />
                {travelers} travelers
              </span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Trip Summary Card */}
      <motion.div 
        className="relative z-10 m-4 md:m-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6 md:p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
              <Calendar className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Trip Overview</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">From</p>
                  <p className="text-white font-medium">{homeLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">To</p>
                  <p className="text-white font-medium">{country}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Dates</p>
                  <p className="text-white font-medium">{startDate || 'Not set'} - {endDate || 'Not set'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-white font-medium">{duration} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Journey Timeline */}
      <div className="relative z-10 p-4 md:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
              <Sparkles className="w-5 h-5 text-purple-400" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">Your Journey</h2>
          </div>
          
          <div className="space-y-6">
            {mockItinerary.map((day, index) => (
              <motion.div
                key={day.day}
                className="flex items-start gap-4 md:gap-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
              >
                {/* Transport Icon Timeline */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <motion.div 
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${day.color} border border-white/20 flex items-center justify-center relative overflow-hidden`}
                    whileHover={{ scale: 1.1 }}
                  >
                    {day.transport === 'flight' ? (
                      <Plane className="w-6 h-6 text-white z-10" />
                    ) : (
                      <Car className="w-6 h-6 text-white z-10" />
                    )}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.2)_0%,transparent_100%)]" />
                  </motion.div>
                  
                  {index < mockItinerary.length - 1 && (
                    <div className="w-0.5 h-20 bg-gradient-to-b from-white/20 to-transparent mt-2" />
                  )}
                </div>

                {/* Day Content Card */}
                <motion.div 
                  className="flex-1 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-5 md:p-6 hover:border-white/20 transition-colors group"
                  whileHover={{ y: -2 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full text-xs font-medium text-indigo-300 border border-white/10 mb-2">
                        Day {day.day}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {day.city}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {day.activities.map((activity, actIndex) => (
                      <div 
                        key={actIndex}
                        className="flex items-start gap-2 text-sm text-gray-300"
                      >
                        <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
                        <span>{activity}</span>
                      </div>
                    ))}
                  </div>

                  {/* Subtle gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${day.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="relative z-10 p-4 md:p-6 space-y-3 pb-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <motion.button 
          onClick={() => navigate(`/trip/hotels?country=${country}`)}
          className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-medium py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Hotel className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
          <span>Find Hotels</span>
        </motion.button>
        
        <motion.button 
          onClick={() => navigate(`/trip/cafes?country=${country}`)}
          className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 text-white font-medium py-4 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 group"
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <Coffee className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>Discover Cafes & Food</span>
        </motion.button>
        
        <motion.button 
          className="w-full bg-white hover:bg-gray-100 text-black font-bold py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] flex items-center justify-center gap-2 relative overflow-hidden group"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="relative z-10">Confirm Itinerary</span>
          
          {/* Shimmer effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '200%' }}
            transition={{ duration: 0.6, ease: 'easeInOut' }}
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

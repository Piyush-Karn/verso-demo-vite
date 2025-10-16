import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, MapPin, Plane, Car, Calendar, Users, Clock, Hotel, Coffee,
  CheckCircle2, Sparkles, Download, Share2, TrendingUp, Train, Bus, Ship
} from 'lucide-react';

export const ItineraryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const country = searchParams.get('country') || 'Destination';
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';
  const travelers = searchParams.get('travelers') || '2';
  const homeLocation = searchParams.get('homeLocation') || 'Your City';
  const duration = searchParams.get('duration') || '7';

  // Rotate through a diverse icon set so day icons don't repeat
  const dayIcons = [Plane, Car, Train, Bus, Ship, MapPin];

  const mockItinerary = [
    {
      day: 1,
      city: country,
      activities: ['Arrive at airport', 'Check into hotel', 'Explore local area'],
      color: 'from-blue-500/20 to-cyan-500/20',
      highlight: 'from-blue-500/30 to-cyan-500/30',
      iconColor: 'text-cyan-400'
    },
    {
      day: 2,
      city: country,
      activities: ['Cultural tour', 'Local cuisine tasting', 'Evening leisure'],
      color: 'from-purple-500/20 to-pink-500/20',
      highlight: 'from-purple-500/30 to-pink-500/30',
      iconColor: 'text-pink-400'
    },
    {
      day: 3,
      city: `${country} - Day Trip`,
      activities: ['Adventure activity', 'Scenic views', 'Traditional experience'],
      color: 'from-indigo-500/20 to-purple-500/20',
      highlight: 'from-indigo-500/30 to-purple-500/30',
      iconColor: 'text-indigo-400'
    }
  ];

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Subtle background pulses (kept lightweight) */}
      <motion.div
        className="absolute top-0 right-1/4 w-[480px] h-[480px] sm:w-[700px] sm:h-[700px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)', opacity: 0.15 }}
        animate={{ scale: [1, 1.1, 1], x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-0 left-1/4 w-[540px] h-[540px] sm:w-[800px] sm:h-[800px] rounded-full blur-[160px] pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)', opacity: 0.15 }}
        animate={{ scale: [1, 1.08, 1], x: [0, -30, 0], y: [0, 28, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Sticky header */}
        <motion.header
          className="sticky top-0 z-50 backdrop-blur-2xl bg-black/80 border-b border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
          initial={{ y: -60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center justify-between p-3 sm:p-4 md:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <motion.button
                onClick={() => navigate(-1)}
                className="relative p-2 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/[0.08] hover:border-white/20 group overflow-hidden"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                <ArrowLeft size={20} className="relative z-10" />
              </motion.button>

              <div>
                <motion.h1
                  className="text-lg sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  {country} Journey
                </motion.h1>
                <motion.div
                  className="flex items-center gap-2 sm:gap-3 mt-1 text-[11px] sm:text-xs text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.15 }}
                >
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/[0.08]">
                    <Clock size={13} />
                    {duration} days
                  </span>
                  <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/[0.08]">
                    <Users size={13} />
                    {travelers} travelers
                  </span>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <motion.button
                className="relative p-2 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/[0.08] hover:border-white/20 group overflow-hidden"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 transition-all duration-300" />
                <Share2 size={18} className="relative z-10" />
              </motion.button>
              <motion.button
                className="relative p-2 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all duration-300 border border-white/[0.08] hover:border-white/20 group overflow-hidden"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all duration-300" />
                <Download size={18} className="relative z-10" />
              </motion.button>
            </div>
          </div>
        </motion.header>

        <div className="p-3 sm:p-4 md:p-8 space-y-6 sm:space-y-8">
          {/* Trip Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative overflow-hidden bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-2xl rounded-[24px] sm:rounded-[40px] border border-white/[0.15] p-6 sm:p-8 md:p-10 shadow-[0_8px_64px_rgba(0,0,0,0.4)]">
              <motion.div
                className="absolute top-0 right-0 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full blur-[100px]"
                animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.div
                className="absolute bottom-0 left-0 w-64 h-64 sm:w-80 sm:h-80 bg-gradient-to-tr from-pink-500/15 to-cyan-500/15 rounded-full blur-[90px]"
                animate={{ scale: [1, 1.08, 1], rotate: [0, -90, 0] }}
                transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                  <div className="flex items-center gap-3">
                    <motion.div
                      className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 backdrop-blur-sm border border-white/20 shadow-lg"
                      whileHover={{ rotate: 180, scale: 1.08 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-200" />
                    </motion.div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">Trip Overview</h2>
                  </div>
                  {/* Premium badge removed */}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-8">
                  <motion.div
                    className="space-y-4 sm:space-y-5"
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <motion.div
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                      whileHover={{ x: 3 }}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex-shrink-0">
                        <MapPin className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] sm:text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Departure From</p>
                        <p className="text-white font-semibold text-base sm:text-lg">{homeLocation}</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/30 hover:from-indigo-500/20 hover:to-purple-500/20 hover:border-indigo-400/50 transition-all duration-300 group"
                      whileHover={{ x: 3 }}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-400/30 flex-shrink-0">
                        <MapPin className="w-5 h-5 text-indigo-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] sm:text-xs font-bold text-indigo-300 mb-1 uppercase tracking-wider">Destination</p>
                        <p className="text-white font-semibold text-base sm:text-lg">{country}</p>
                      </div>
                    </motion.div>
                  </motion.div>

                  <motion.div
                    className="space-y-4 sm:space-y-5"
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <motion.div
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                      whileHover={{ x: 3 }}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex-shrink-0">
                        <Calendar className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] sm:text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Travel Dates</p>
                        <p className="text-white font-semibold text-sm sm:text-base leading-relaxed">
                          {startDate || 'Not set'} - {endDate || 'Not set'}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group"
                      whileHover={{ x: 3 }}
                    >
                      <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex-shrink-0">
                        <Clock className="w-5 h-5 text-gray-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[11px] sm:text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Total Duration</p>
                        <p className="text-white font-semibold text-base sm:text-lg">{duration} days</p>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Daily Itinerary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <div className="flex items-center gap-3">
                <motion.div
                  className="p-2.5 sm:p-3 rounded-2xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm border border-white/20 shadow-lg"
                  whileHover={{ rotate: -180, scale: 1.08 }}
                  transition={{ duration: 0.4 }}
                >
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-purple-200" />
                </motion.div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Daily Itinerary</h2>
              </div>
              <motion.div
                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-white/10"
                whileHover={{ scale: 1.03 }}
              >
                <TrendingUp className="w-4 h-4 text-pink-400" />
                <span className="text-xs sm:text-sm font-semibold text-gray-300">{mockItinerary.length} Days</span>
              </motion.div>
            </div>

            <div className="space-y-5 sm:space-y-6">
              {mockItinerary.map((day, index) => {
                const Icon = dayIcons[index % dayIcons.length];
                return (
                  <motion.div
                    key={day.day}
                    className="flex items-start gap-4 sm:gap-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: 0.15 + index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Day Icon + connector */}
                    <div className="flex flex-col items-center flex-shrink-0 pt-1 sm:pt-2">
                      <motion.div
                        className={`w-12 h-12 sm:w-16 sm:h-16 rounded-[16px] sm:rounded-[20px] bg-gradient-to-br ${day.color} border-2 border-white/20 flex items-center justify-center relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]`}
                        whileHover={{ scale: 1.08, rotate: 6 }}
                        transition={{ type: "spring", stiffness: 300, damping: 18 }}
                      >
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white z-10" />
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.28)_0%,transparent_100%)] opacity-60" />
                      </motion.div>

                      {index < mockItinerary.length - 1 && (
                        <div className={`w-1 h-full min-h-[80px] sm:min-h-[100px] bg-gradient-to-b ${day.color} rounded-full mt-3 sm:mt-4 shadow-lg`} />
                      )}
                    </div>

                    {/* Day Card */}
                    <motion.div
                      className={`flex-1 bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-2xl rounded-[22px] sm:rounded-[32px] border border-white/[0.15] p-5 sm:p-7 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]`}
                      whileHover={{ y: -6, scale: 1.01 }}
                      transition={{ type: "spring", stiffness: 280, damping: 20 }}
                    >
                      <motion.div
                        className={`pointer-events-none absolute inset-0 rounded-[22px] sm:rounded-[32px] bg-gradient-to-br ${day.highlight}`}
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4 sm:mb-5">
                          <div>
                            <span className={`inline-block px-3 sm:px-4 py-1.5 bg-gradient-to-r ${day.color} backdrop-blur-sm rounded-full text-[11px] sm:text-xs font-bold text-white border border-white/20 mb-2 sm:mb-3 shadow-lg`}>
                              Day {day.day}
                            </span>
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-0.5">{day.city}</h3>
                            <p className={`text-xs sm:text-sm ${day.iconColor} font-medium`}>
                              Curated experiences
                            </p>
                          </div>
                        </div>

                        <div className="space-y-2.5 sm:space-y-3">
                          {day.activities.map((activity, actIndex) => (
                            <motion.div
                              key={actIndex}
                              className="flex items-start gap-3 text-xs sm:text-sm text-gray-200 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                              initial={{ opacity: 0, x: -12 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true, amount: 0.2 }}
                              transition={{ duration: 0.35, delay: 0.1 + actIndex * 0.06 }}
                            >
                              <CheckCircle2 className={`w-4 h-4 sm:w-5 sm:h-5 ${day.iconColor} flex-shrink-0 mt-0.5`} />
                              <span className="leading-relaxed font-medium">{activity}</span>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* CTA buttons (continuous shimmer removed) */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 pt-4 sm:pt-6"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.button
              onClick={() => navigate(`/app/trip/hotels?country=${country}`)}
              className="relative group bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-2xl border border-white/[0.15] hover:border-indigo-400/50 text-white font-bold py-5 sm:py-6 rounded-[22px] sm:rounded-[28px] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(99,102,241,0.3)]"
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/15 to-purple-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-400/30">
                  <Hotel className="w-5 h-5 text-indigo-300" />
                </div>
                <span className="text-sm sm:text-base">Find Hotels</span>
              </div>
            </motion.button>

            <motion.button
              onClick={() => navigate(`/app/trip/cafes?country=${country}`)}
              className="relative group bg-gradient-to-br from-white/[0.12] to-white/[0.04] backdrop-blur-2xl border border-white/[0.15] hover:border-amber-400/50 text-white font-bold py-5 sm:py-6 rounded-[22px] sm:rounded-[28px] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(245,158,11,0.3)]"
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 to-orange-500/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-400/30">
                  <Coffee className="w-5 h-5 text-amber-300" />
                </div>
                <span className="text-sm sm:text-base">Discover Cafes & Food</span>
              </div>
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="pb-10 sm:pb-12 pt-4 sm:pt-6"
          >
            <motion.button
              className="w-full relative group bg-gradient-to-r from-white via-gray-50 to-white text-black font-bold py-5 sm:py-6 rounded-[22px] sm:rounded-[28px] transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden shadow-[0_12px_48px_rgba(255,255,255,0.15)] hover:shadow-[0_16px_64px_rgba(255,255,255,0.25)]"
              whileHover={{ scale: 1.01, y: -3 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-black/10">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <span className="text-sm sm:text-base">Confirm Itinerary & Continue</span>
              </div>
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

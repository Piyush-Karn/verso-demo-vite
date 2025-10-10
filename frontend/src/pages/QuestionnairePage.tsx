import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, MapPin, Plane, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const QuestionnairePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCountry = searchParams.get('country');

  const [formData, setFormData] = useState({
    destination: preSelectedCountry || '',
    startDate: '',
    endDate: '',
    travelers: '2',
    homeLocation: '',
    tripDuration: '7'
  });

  const countries = ['Japan', 'Bali', 'Goa', 'Thailand', 'Italy', 'France'];
  const travelerOptions = ['1', '2', '3', '4', '5+'];
  const durationOptions = ['3', '5', '7', '10', '14', '21'];

  const handleSubmit = () => {
    if (formData.destination && formData.startDate && formData.endDate) {
      const params = new URLSearchParams({
        country: formData.destination,
        startDate: formData.startDate,
        endDate: formData.endDate,
        travelers: formData.travelers,
        homeLocation: formData.homeLocation || 'Not specified',
        duration: formData.tripDuration
      });
      navigate(`/trip/itinerary?${params.toString()}`);
    }
  };

  const isFormValid = formData.destination && formData.startDate && formData.endDate;

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Static grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          opacity: 0.12,
        }}
      />
      <div
        className="absolute bottom-0 right-1/4 w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none"
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
              Plan Your Trip
            </motion.h1>
            <motion.p 
              className="text-sm md:text-base text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Tell us about your travel plans
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <div className="relative z-10 p-4 md:p-6 pb-32 max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="space-y-6"
        >
          {/* Destination */}
          {!preSelectedCountry && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className="flex items-center gap-2 text-base font-semibold mb-3 text-white">
                <Plane className="w-5 h-5 text-indigo-400" />
                Where would you like to go? *
              </label>
              <select
                value={formData.destination}
                onChange={(e) => setFormData({...formData, destination: e.target.value})}
                className="w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl px-4 py-4 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none cursor-pointer"
              >
                <option value="" className="bg-gray-900">Select a destination</option>
                {countries.map(country => (
                  <option key={country} value={country} className="bg-gray-900">{country}</option>
                ))}
              </select>
            </motion.div>
          )}

          {/* Travel Dates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-6"
          >
            <label className="flex items-center gap-2 text-base font-semibold mb-4 text-white">
              <Calendar className="w-5 h-5 text-purple-400" />
              When are you traveling? *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400 mb-2 font-medium">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2 font-medium">End Date</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  required
                />
              </div>
            </div>
          </motion.div>

          {/* Optional Details Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-2 pt-4">
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
              <span className="text-sm font-medium text-gray-400">Optional Details</span>
              <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent flex-1" />
            </div>
            
            {/* Trip Duration */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-white">
                <Clock className="w-4 h-4 text-cyan-400" />
                Trip Duration
              </label>
              <select
                value={formData.tripDuration}
                onChange={(e) => setFormData({...formData, tripDuration: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
              >
                {durationOptions.map(duration => (
                  <option key={duration} value={duration} className="bg-gray-900">{duration} days</option>
                ))}
              </select>
            </div>

            {/* Number of Travelers */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-white">
                <Users className="w-4 h-4 text-pink-400" />
                Number of Travelers
              </label>
              <select
                value={formData.travelers}
                onChange={(e) => setFormData({...formData, travelers: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer"
              >
                {travelerOptions.map(option => (
                  <option key={option} value={option} className="bg-gray-900">
                    {option} {option === '1' ? 'person' : 'people'}
                  </option>
                ))}
              </select>
            </div>

            {/* Home Location */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 p-5">
              <label className="flex items-center gap-2 text-sm font-semibold mb-3 text-white">
                <MapPin className="w-4 h-4 text-emerald-400" />
                Traveling From
              </label>
              <input
                type="text"
                value={formData.homeLocation}
                onChange={(e) => setFormData({...formData, homeLocation: e.target.value})}
                placeholder="Enter your home city"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-white/20 transition-colors"
              />
            </div>
          </motion.div>

          {/* Form Progress Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="flex items-center justify-center gap-2 pt-4"
          >
            {[formData.destination, formData.startDate, formData.endDate].map((field, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all duration-300 ${
                  field ? 'w-8 bg-gradient-to-r from-indigo-500 to-purple-500' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Continue Button */}
      <motion.div 
        className="fixed bottom-20 left-4 right-4 z-20"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30, delay: 0.5 }}
      >
        <motion.button 
          onClick={handleSubmit}
          disabled={!isFormValid}
          className={`w-full font-bold py-4 rounded-full transition-all duration-300 flex items-center justify-center gap-2 relative overflow-hidden ${
            isFormValid 
              ? 'bg-white text-black hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] cursor-pointer' 
              : 'bg-white/10 text-gray-500 cursor-not-allowed border border-white/10'
          }`}
          whileHover={isFormValid ? { scale: 1.02 } : {}}
          whileTap={isFormValid ? { scale: 0.98 } : {}}
        >
          {isFormValid ? (
            <>
              <span className="relative z-10">Continue to Itinerary</span>
              <ArrowRight className="relative z-10 w-5 h-5" />
              
              {/* Shimmer effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '200%' }}
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              />
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>Complete Required Fields</span>
            </>
          )}
        </motion.button>
      </motion.div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, Sparkles, MapPin, ArrowRight } from 'lucide-react';
import { fetchImage } from '../services/imageService';

interface Country {
  country: string;
  count: number;
  imageUrl?: string;
}

const mockCountries = [
  { country: 'Japan', count: 12 },
  { country: 'Bali', count: 8 },
  { country: 'Goa', count: 5 }
];

export const TripPage: React.FC = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCountryImages = async () => {
      setLoading(true);
      
      const countriesWithImages = await Promise.all(
        mockCountries.map(async (country) => {
          const imageUrl = await fetchImage(country.country);
          return { ...country, imageUrl };
        })
      );

      setCountries(countriesWithImages);
      setLoading(false);
    };

    loadCountryImages();
  }, []);

  const handleCountrySelect = (country: string) => {
    navigate(`/trip/questionnaire?country=${encodeURIComponent(country)}`);
  };

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
        className="relative z-10 pt-6 px-4 md:px-6 pb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10">
            <Plane className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Plan?
            </h1>
          </div>
        </div>
        <p className="text-gray-400 text-base md:text-lg ml-14">
          Choose a collection to build your trip from saved inspirations
        </p>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 px-4 md:px-6 pb-24">
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
              <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-gray-300">Loading destinations...</span>
            </div>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-7xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {countries.map((c, index) => (
              <motion.button
                key={c.country}
                onClick={() => handleCountrySelect(c.country)}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Country Image */}
                <div className="relative w-full h-56 md:h-64 bg-gray-900 overflow-hidden">
                  {c.imageUrl ? (
                    <>
                      <img 
                        src={c.imageUrl} 
                        alt={c.country} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                      <span className="text-6xl font-bold text-white/30">
                        {c.country.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                  
                  {/* Country Badge */}
                  <div className="absolute top-4 right-4 w-16 h-16 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center">
                    <span className="text-white font-bold text-xl">
                      {c.country.slice(0, 2).toUpperCase()}
                    </span>
                  </div>

                  {/* Inspiration Count Badge */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-300" />
                    <span className="text-white text-sm font-medium">{c.count} inspirations</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-left flex-1">
                      <h2 className="text-2xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">
                        {c.country}
                      </h2>
                      <p className="text-gray-400 text-sm flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        Plan your adventure
                      </p>
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-full font-semibold flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/50 transition-all duration-300">
                    <Plane className="w-5 h-5" />
                    <span>Plan Trip</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </div>

                {/* Gradient glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                />

                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

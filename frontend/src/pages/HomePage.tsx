import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, MapPin, Compass } from 'lucide-react';
import { InteractiveMap } from '../components/InteractiveMap';
import { fetchImage } from '../services/imageService';

// --- Type Definition ---
interface Country {
  country: string;
  count: number;
  imageUrl?: string;
}

const mockCountries: Country[] = [
  { country: 'Japan', count: 12 },
  { country: 'Bali', count: 8 },
  { country: 'Goa', count: 5 },
];

// --- Main Component ---
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  // Memoize total collections to prevent recalculation
  const totalCollections = useMemo(
    () => mockCountries.reduce((a, c) => a + c.count, 0),
    []
  );

  useEffect(() => {
    const loadCountryData = async () => {
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

    loadCountryData();
  }, []);

  const onNavigate = () => {
    if (picked) navigate(`/organize/${encodeURIComponent(picked)}?focus=1`);
  };

  const onCardPress = (countryName: string) => {
    if (picked === countryName) {
      setPicked(null);
    } else {
      setPicked(countryName);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Static grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Optimized gradient orbs */}
      <div
        className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[150px] pointer-events-none"
        style={{ 
          background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)',
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

      {/* Header Section */}
      <motion.div 
        className="relative z-10 pt-6 px-4 md:px-6 pb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10">
            <Sparkles className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-white text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hello, Explorer
            </h1>
          </div>
        </div>
        
        <motion.p 
          className="text-gray-400 text-base md:text-lg ml-14"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="font-semibold text-white">{totalCollections}</span> Collections saved
        </motion.p>
      </motion.div>

      {/* Interactive Map */}
      <div className="relative z-10">
        <InteractiveMap selectedCountry={picked} />
      </div>

      {/* Collections Section */}
      {loading ? (
        <div className="relative z-10 text-center p-10">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-300">Loading Collections...</span>
          </div>
        </div>
      ) : (
        <div className="relative z-10 px-4 md:px-6 pb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10">
                  <Compass className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h2 className="text-white text-xl md:text-2xl font-bold">Your Collections</h2>
                  <p className="text-gray-500 text-sm">Tap to explore destinations</p>
                </div>
              </div>
            </div>
            
            {/* Collection Cards */}
            <div className="space-y-4">
              {countries.map((c, index) => {
                const dim = picked && c.country !== picked;
                const isSelected = c.country === picked;
                
                return (
                  <motion.button
                    key={c.country}
                    onClick={() => onCardPress(c.country)}
                    className={`group relative w-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl border overflow-hidden transition-all duration-300 ${
                      isSelected 
                        ? 'border-indigo-500/50 shadow-xl shadow-indigo-500/20' 
                        : 'border-white/10 hover:border-white/20'
                    } ${dim ? 'opacity-40 scale-95' : 'opacity-100'}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: dim ? 0.4 : 1, y: 0, scale: dim ? 0.95 : 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: dim ? 0.95 : 1.02, y: dim ? 0 : -4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center p-5 gap-5">
                      {/* Country Image - Larger & Better */}
                      <div className="relative flex-shrink-0">
                        {c.imageUrl ? (
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-white/10">
                            <img 
                              src={c.imageUrl} 
                              alt={c.country} 
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                            {/* Count badge on image */}
                            <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 backdrop-blur-sm rounded-full text-xs font-semibold text-white border border-white/20">
                              {c.count}
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 flex items-center justify-center text-white font-bold text-2xl border border-white/20">
                            {c.country.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        {/* Selection indicator */}
                        {isSelected && (
                          <motion.div
                            className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 opacity-50 blur-md"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </div>

                      {/* Country Info - Enhanced */}
                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`text-xl md:text-2xl font-bold transition-colors ${
                            dim ? 'text-gray-600' : 'text-white'
                          }`}>
                            {c.country}
                          </h3>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-400 to-purple-400"
                            />
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className={`w-4 h-4 ${dim ? 'text-gray-700' : 'text-gray-500'}`} />
                          <p className={`text-base transition-colors ${
                            dim ? 'text-gray-700' : 'text-gray-400'
                          }`}>
                            {c.count} Saved Inspirations
                          </p>
                        </div>
                      </div>

                      {/* Arrow Icon - Enhanced */}
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isSelected 
                            ? 'bg-gradient-to-br from-indigo-500 to-purple-500' 
                            : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                          <ArrowRight className={`w-5 h-5 transition-all duration-300 ${
                            dim ? 'text-gray-700' : isSelected ? 'text-white translate-x-0.5' : 'text-gray-400'
                          }`} />
                        </div>
                      </div>
                    </div>

                    {/* Selection overlay */}
                    {isSelected && (
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 pointer-events-none" />
                    )}

                    {/* Bottom accent line */}
                    {isSelected && (
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>
      )}
      
      {/* Fixed CTA Button */}
      {picked && (
        <motion.div 
          className="fixed bottom-20 left-4 right-4 z-20"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <motion.button 
            onClick={onNavigate} 
            className="group relative w-full bg-white text-black font-bold py-4 rounded-full transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] overflow-hidden flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10">Take me to {picked}</span>
            <ArrowRight className="relative z-10 w-5 h-5" />
            
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '200%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

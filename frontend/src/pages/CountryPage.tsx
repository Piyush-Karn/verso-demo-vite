import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, ImageIcon, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { fetchImage } from '../services/imageService';

// --- Mock Data ---
const mockCountryDetails: Record<string, any> = {
  Japan: {
    cities: ['Tokyo', 'Kyoto', 'Osaka'],
    categories: ['Temples', 'Gardens', 'Sushi', 'Hot Springs'],
    seasons: [
      { month: 'March', highlight: 'Cherry Blossoms', activities: ['Temple visits', 'Hanami parties'] },
      { month: 'June', highlight: 'Rainy Season', activities: ['Indoor museums', 'Traditional crafts'] },
      { month: 'October', highlight: 'Autumn Colors', activities: ['Hiking', 'Photography'] }
    ]
  },
  Bali: {
    cities: ['Ubud', 'Seminyak', 'Canggu'],
    categories: ['Beaches', 'Temples', 'Yoga', 'Surfing'],
    seasons: [
      { month: 'April', highlight: 'Dry Season', activities: ['Beach days', 'Temple tours'] },
      { month: 'July', highlight: 'Peak Season', activities: ['Surfing', 'Yoga retreats'] },
      { month: 'October', highlight: 'Perfect Weather', activities: ['Island hopping', 'Volcano hiking'] }
    ]
  },
  Goa: {
    cities: ['Panaji', 'Anjuna', 'Arambol'],
    categories: ['Beaches', 'Nightlife', 'Seafood', 'Markets'],
    seasons: [
      { month: 'November', highlight: 'Cool Weather', activities: ['Beach relaxing', 'Market shopping'] },
      { month: 'December', highlight: 'Peak Tourism', activities: ['Nightlife', 'Water sports'] },
      { month: 'February', highlight: 'Carnival', activities: ['Festivals', 'Cultural events'] }
    ]
  }
};

// --- Interfaces ---
interface City {
  name: string;
  imageUrl?: string;
}
interface Category {
  name: string;
  imageUrl?: string;
}
interface Season {
  month: string;
  highlight: string;
  activities: string[];
  imageUrl?: string;
}

export const CountryPage: React.FC = () => {
  const { country } = useParams<{ country: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'cities' | 'categories' | 'seasons'>('cities');
  const [countryData, setCountryData] = useState<any>(country ? mockCountryDetails[country] : null);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      if (!country || !countryData) return;

      setLoadingImages(true);
      const initialData = mockCountryDetails[country];

      const citiesWithImages = await Promise.all(
        initialData.cities.map(async (cityName: string): Promise<City> => ({
          name: cityName,
          imageUrl: await fetchImage(`${cityName} ${country}`),
        }))
      );

      const categoriesWithImages = await Promise.all(
        initialData.categories.map(async (categoryName: string): Promise<Category> => ({
          name: categoryName,
          imageUrl: await fetchImage(`${categoryName} ${country}`),
        }))
      );

      const seasonsWithImages = await Promise.all(
        initialData.seasons.map(async (season: any): Promise<Season> => ({
          ...season,
          imageUrl: await fetchImage(`${season.highlight} ${country}`),
        }))
      );

      setCountryData({
        ...initialData,
        cities: citiesWithImages,
        categories: categoriesWithImages,
        seasons: seasonsWithImages,
      });
      setLoadingImages(false);
    };

    if (country && mockCountryDetails[country]) {
      loadImages();
    }
  }, [country]);

  if (!country || !countryData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-red-400 text-lg">Country not found</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      {/* Static grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

      {/* Gradient orbs */}
      <motion.div
        className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full blur-[150px]"
        style={{ 
          background: 'radial-gradient(circle, #6366f1 0%, transparent 70%)',
          opacity: 0.12,
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.12, 0.15, 0.12] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
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
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {country}
            </motion.h1>
            <motion.p 
              className="text-sm md:text-base text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Discover your perfect experience
            </motion.p>
          </div>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="relative z-10 flex border-b border-white/10 bg-black/30 backdrop-blur-sm">
        {[
          { id: 'cities', label: 'Cities', icon: MapPin },
          { id: 'categories', label: 'Things to do', icon: Sparkles },
          { id: 'seasons', label: 'Seasons', icon: Calendar }
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`relative flex-1 py-4 px-4 text-sm md:text-base font-medium transition-colors ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="flex items-center justify-center gap-2">
              <tab.icon size={18} />
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </motion.button>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 p-4 md:p-6 pb-24">
        {activeTab === 'cities' && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {countryData.cities.map((city: City, index: number) => (
              <motion.button
                key={city.name}
                onClick={() => navigate(`/organize/${country}/${city.name}`)}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative w-full h-40 md:h-48 bg-gray-900 overflow-hidden">
                  {loadingImages ? (
                    <div className="animate-pulse bg-gradient-to-br from-gray-800 to-gray-900 w-full h-full" />
                  ) : city.imageUrl ? (
                    <>
                      <img 
                        src={city.imageUrl} 
                        alt={city.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <MapPin className="text-gray-600" size={40} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white">{city.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Explore destinations</p>
                </div>

                {/* Gradient glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                />
              </motion.button>
            ))}
          </motion.div>
        )}

        {activeTab === 'categories' && (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {countryData.categories.map((category: Category, index: number) => (
              <motion.button
                key={category.name}
                onClick={() => navigate(`/organize/${country}/category/${category.name}`)}
                className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative w-full h-40 md:h-48 bg-gray-900 overflow-hidden">
                  {loadingImages ? (
                    <div className="animate-pulse bg-gradient-to-br from-gray-800 to-gray-900 w-full h-full" />
                  ) : category.imageUrl ? (
                    <>
                      <img 
                        src={category.imageUrl} 
                        alt={category.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <ImageIcon className="text-gray-600" size={40} />
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-lg text-white">{category.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">Discover experiences</p>
                </div>

                {/* Gradient glow on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-30 transition-opacity duration-300 pointer-events-none"
                />
              </motion.button>
            ))}
          </motion.div>
        )}

        {activeTab === 'seasons' && (
          <motion.div 
            className="space-y-4 md:space-y-6 max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {countryData.seasons.map((season: Season, index: number) => (
              <motion.div
                key={season.month}
                className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-2xl overflow-hidden border border-white/10"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="relative w-full h-48 md:h-56 bg-gray-900 overflow-hidden">
                  {loadingImages ? (
                    <div className="animate-pulse bg-gradient-to-br from-gray-800 to-gray-900 w-full h-full" />
                  ) : season.imageUrl ? (
                    <>
                      <img 
                        src={season.imageUrl} 
                        alt={season.highlight} 
                        className="w-full h-full object-cover" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Calendar className="text-gray-600" size={40} />
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                      <Calendar size={20} className="text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-white">{season.month}</h3>
                      <p className="text-sm text-gray-400">{season.highlight}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {season.activities.map((activity: string) => (
                      <span 
                        key={activity} 
                        className="px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-sm text-gray-300 border border-white/10 hover:bg-white/20 transition-colors"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500/60 via-purple-500/60 to-pink-500/60" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

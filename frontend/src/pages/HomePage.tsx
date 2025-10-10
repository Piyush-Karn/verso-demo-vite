import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { InteractiveMap } from '../components/InteractiveMap'; // Import the new map component

// --- API Keys (securely loaded from .env) ---
const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

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

// --- API Functions ---
const fetchImageFromUnsplash = async (query: string) => {
  if (!UNSPLASH_ACCESS_KEY) {
    console.error("Unsplash Access Key is missing.");
    return undefined;
  }
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: {
        Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
      },
      params: { query, per_page: 1 },
    });
    if (response.data.results.length > 0) {
      return response.data.results[0].urls.small;
    }
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
  }
  return undefined;
};

const fetchImageFromPexels = async (query: string) => {
  if (!PEXELS_API_KEY) {
    console.error("Pexels API Key is missing.");
    return undefined;
  }
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: {
        Authorization: PEXELS_API_KEY,
      },
      params: { query, per_page: 1 },
    });
    if (response.data.photos.length > 0) {
      return response.data.photos[0].src.medium;
    }
  } catch (error) {
    console.error('Error fetching image from Pexels:', error);
  }
  return undefined;
};


// --- Main Component ---
export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [picked, setPicked] = useState<string | null>(null);

  useEffect(() => {
    const loadCountryData = async () => {
      setLoading(true);
      
      const countriesWithImages = await Promise.all(
        mockCountries.map(async (country) => {
          let imageUrl = await fetchImageFromUnsplash(country.country);
          if (!imageUrl) {
            console.log(`Unsplash failed for ${country.country}, trying Pexels...`);
            imageUrl = await fetchImageFromPexels(country.country);
          }
          return { ...country, imageUrl };
        })
      );

      setCountries(countriesWithImages);
      setLoading(false);
    };

    loadCountryData();
  }, []);

  const onPick = (c: string) => setPicked(c);
  const onNavigate = () => {
    if (picked) navigate(`/organize/${encodeURIComponent(picked)}?focus=1`);
  };
  const onCardPress = (c: string) => onPick(c);

  return (
    <div className="flex-1">
      <div className="pt-6 px-4 pb-2">
        <h1 className="text-white text-xl font-semibold">Hello, Explorer</h1>
        <p className="text-gray-400 mt-1">
          {mockCountries.reduce((a, c) => a + c.count, 0)} Collections saved across {mockCountries.length} Countries
        </p>
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => navigate('/organize/interests')}
            className="border border-gray-700 rounded-full px-3 py-1.5 text-xs text-gray-300 hover:bg-gray-800"
          >
            Your Interests
          </button>
        </div>
      </div>

      <InteractiveMap />

      {loading ? (
        <div className="text-center p-10">Loading Collections & Images...</div>
      ) : (
        <div className="flex-1 px-4">
          <h2 className="text-gray-300 text-base mb-4">Your Collections</h2>
          <div className="space-y-3 pb-20">
            {countries.map((c) => {
              const dim = picked && c.country !== picked;
              return (
                <button
                  key={c.country}
                  onClick={() => onCardPress(c.country)}
                  className={`w-full flex items-center bg-gray-900 rounded-2xl p-4 gap-3 transition-all hover:bg-gray-800 ${
                    dim ? 'opacity-35' : 'opacity-100'
                  }`}
                >
                  {c.imageUrl ? (
                    <img
                      src={c.imageUrl}
                      alt={c.country}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white font-bold text-lg">
                      {c.country.slice(0, 2).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 text-left">
                    <h3 className={`text-lg font-semibold ${dim ? 'text-gray-600' : 'text-white'}`}>
                      {c.country}
                    </h3>
                    <p className={`mt-1 ${dim ? 'text-gray-700' : 'text-gray-400'}`}>
                      {c.count} Inspirations
                    </p>
                  </div>
                  <span className={`text-2xl ${dim ? 'text-gray-700' : 'text-gray-400'}`}>›</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
      
      {picked ? (
        <div className="fixed bottom-20 left-4 right-4">
          <button
            onClick={onNavigate}
            className="w-full bg-white text-black font-bold py-4 rounded-full transition-colors hover:bg-gray-200"
          >
            Take me to {picked}
          </button>
        </div>
      ) : (
        <button
          onClick={() => navigate('/add')}
          className="fixed bottom-24 right-4 w-14 h-14 bg-white hover:bg-gray-200 rounded-full flex items-center justify-center text-black text-2xl font-semibold shadow-lg transition-colors"
        >
          +
        </button>
      )}
    </div>
  );
};
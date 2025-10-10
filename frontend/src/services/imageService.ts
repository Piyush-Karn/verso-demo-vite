import axios from 'axios';

const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
const PEXELS_API_KEY = import.meta.env.VITE_PEXELS_API_KEY;

const fetchFromUnsplash = async (query: string) => {
  if (!UNSPLASH_ACCESS_KEY) return undefined;
  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      params: { query, per_page: 1, orientation: 'landscape' },
    });
    return response.data.results[0]?.urls.small;
  } catch (error) {
    console.error(`Error fetching from Unsplash for query "${query}":`, error);
    return undefined;
  }
};

const fetchFromPexels = async (query: string) => {
  if (!PEXELS_API_KEY) return undefined;
  try {
    const response = await axios.get('https://api.pexels.com/v1/search', {
      headers: { Authorization: PEXELS_API_KEY },
      params: { query, per_page: 1, orientation: 'landscape' },
    });
    return response.data.photos[0]?.src.medium;
  } catch (error) {
    console.error(`Error fetching from Pexels for query "${query}":`, error);
    return undefined;
  }
};

/**
 * Fetches an image for a given query, trying Unsplash first and Pexels as a fallback.
 * @param query The search query (e.g., "Temples in Japan").
 * @returns The URL of the image or undefined if not found.
 */
export const fetchImage = async (query: string): Promise<string | undefined> => {
  let imageUrl = await fetchFromUnsplash(query);
  if (!imageUrl) {
    console.log(`Unsplash failed for "${query}", trying Pexels...`);
    imageUrl = await fetchFromPexels(query);
  }
  return imageUrl;
};
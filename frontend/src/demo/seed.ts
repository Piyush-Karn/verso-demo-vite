import { addInspiration, fetchCityItems } from '../api/client';
import { CITY_THUMBS } from '../assets/imagesBase64';

const jpCities = ['Tokyo', 'Kyoto', 'Osaka', 'Sapporo', 'Okinawa'];
const baliCities = ['Ubud', 'Kuta', 'Seminyak', 'Canggu', 'Uluwatu'];
const goaCities = ['Panaji', 'Calangute', 'Baga', 'Anjuna', 'Palolem'];

const actTitles = ['Sunrise hike', 'Hidden viewpoint', 'Local market tour', 'Temple walk', 'Riverside cycle'];
const cafeTitles = ['Artisanal coffee', 'Bakery & tea', 'Rooftop latte', 'Garden brunch', 'Dessert bar'];

function costFor(idx: number): '$' | '$$' | '$$$' {
  return (['$', '$$', '$$', '$', '$$$'] as const)[idx % 5];
}

async function ensureCity(country: string, city: string) {
  // Quick, reliable seeding: do NOT fetch remote images here to keep first load fast.
  // Images will be loaded lazily per-screen using Pexels/Unsplash and cached with TTL.
  const acts = await fetchCityItems(country, city, 'activity');
  for (let i = acts.length; i < 5; i++) {
    const title = `${city} · ${actTitles[i % actTitles.length]}`;
    await addInspiration({
      url: `https://example.com/${country}/${city}/activity/${i}`,
      title,
      image_base64: null, // lazy load later
      country,
      city,
      type: 'activity',
      theme: ['Adventure'],
      cost_indicator: costFor(i),
      vibe_notes: i % 2 === 0 ? 'Usually crowded in May' : 'Calm mornings',
      added_by: 'demo-seed',
    });
  }
  const cafes = await fetchCityItems(country, city, 'cafe');
  for (let i = cafes.length; i < 5; i++) {
    const title = `${city} · ${cafeTitles[i % cafeTitles.length]}`;
    await addInspiration({
      url: `https://example.com/${country}/${city}/cafe/${i}`,
      title,
      image_base64: null, // lazy load later
      country,
      city,
      type: 'cafe',
      theme: ['Foodie'],
      cost_indicator: costFor(i),
      vibe_notes: i % 2 === 0 ? 'Usually crowded in evenings' : 'Cozy weekdays',
      added_by: 'demo-seed',
    });
  }
}

export async function seedIfNeeded() {
  try {
    const countries = [
      { name: 'Japan', cities: jpCities },
      { name: 'Bali', cities: baliCities },
      { name: 'Goa', cities: goaCities },
    ];

    for (const c of countries) {
      for (const city of c.cities) {
        await ensureCity(c.name, city);
      }
    }
  } catch (e) {
    // silent for demo
  }
}
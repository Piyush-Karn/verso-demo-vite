import { addInspiration, fetchCountries } from '../api/client';
import { CITY_THUMBS } from '../assets/imagesBase64';
import { getCachedImage } from '../services/imageCache';

const jpCities = ['Tokyo', 'Kyoto', 'Osaka', 'Sapporo', 'Okinawa'];
const baliCities = ['Ubud', 'Kuta', 'Seminyak', 'Canggu', 'Uluwatu'];
const goaCities = ['Panaji', 'Calangute', 'Baga', 'Anjuna', 'Palolem'];

const actTitles = ['Sunrise hike', 'Hidden viewpoint', 'Local market tour', 'Temple walk', 'Riverside cycle'];
const cafeTitles = ['Artisanal coffee', 'Bakery & tea', 'Rooftop latte', 'Garden brunch', 'Dessert bar'];

function costFor(idx: number): '$' | '$$' | '$$$' {
  return (['$', '$$', '$$', '$', '$$$'] as const)[idx % 5];
}

export async function seedIfNeeded() {
  try {
    const existing = await fetchCountries();
    const haveJapan = existing.some((c) => c.country === 'Japan');
    const haveBali = existing.some((c) => c.country === 'Bali');
    const haveGoa = existing.some((c) => c.country === 'Goa');

    if (haveJapan && haveBali && haveGoa) return;

    const doCity = async (country: string, city: string) => {
      // 5 activities
      for (let i = 0; i < 5; i++) {
        const title = `${city} · ${actTitles[i]}`;
        const img = (await getCachedImage(`${city} ${country} ${actTitles[i]} scenic`)) || CITY_THUMBS[city];
        await addInspiration({
          url: `https://example.com/${country}/${city}/activity/${i}`,
          title,
          image_base64: img,
          country,
          city,
          type: 'activity',
          theme: ['Adventure'],
          cost_indicator: costFor(i),
          vibe_notes: i % 2 === 0 ? 'Usually crowded in May' : 'Calm mornings',
          added_by: 'demo-seed',
        });
      }
      // 5 cafes
      for (let i = 0; i < 5; i++) {
        const title = `${city} · ${cafeTitles[i]}`;
        const img = (await getCachedImage(`${city} ${country} cafe ${cafeTitles[i]} interior`)) || CITY_THUMBS[city];
        await addInspiration({
          url: `https://example.com/${country}/${city}/cafe/${i}`,
          title,
          image_base64: img,
          country,
          city,
          type: 'cafe',
          theme: ['Foodie'],
          cost_indicator: costFor(i),
          vibe_notes: i % 2 === 0 ? 'Usually crowded in evenings' : 'Cozy weekdays',
          added_by: 'demo-seed',
        });
      }
    };

    if (!haveJapan) {
      for (const city of jpCities) await doCity('Japan', city);
    }
    if (!haveBali) {
      for (const city of baliCities) await doCity('Bali', city);
    }
    if (!haveGoa) {
      for (const city of goaCities) await doCity('Goa', city);
    }
  } catch (e) {
    // silent for demo
  }
}
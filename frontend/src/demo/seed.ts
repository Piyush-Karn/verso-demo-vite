import { addInspiration, fetchCountries } from '../api/client';
import { CITY_THUMBS } from '../assets/imagesBase64';

const jpCities = ['Tokyo', 'Kyoto', 'Osaka', 'Sapporo', 'Okinawa'];
const baliCities = ['Ubud', 'Kuta', 'Seminyak', 'Canggu', 'Uluwatu'];
const goaCities = ['Panaji', 'Calangute', 'Baga', 'Anjuna', 'Palolem'];

const demoItems = [
  { type: 'activity' as const, title: 'Morning market stroll', cost: '$', vibe: 'Calm mornings' },
  { type: 'cafe' as const, title: 'Third-wave coffee spot', cost: '$$', vibe: 'Usually crowded in May' },
  { type: 'activity' as const, title: 'Hidden viewpoint', cost: '$', vibe: 'Great for sunset' },
];

export async function seedIfNeeded() {
  try {
    const existing = await fetchCountries();
    const haveJapan = existing.some((c) => c.country === 'Japan');
    const haveBali = existing.some((c) => c.country === 'Bali');
    const haveGoa = existing.some((c) => c.country === 'Goa');

    // Seed only if any of these are missing
    if (haveJapan && haveBali && haveGoa) return;

    const queue: Array<Promise<any>> = [];

    if (!haveJapan) {
      jpCities.forEach((city) => {
        demoItems.forEach((d) => {
          queue.push(
            addInspiration({
              url: 'https://example.com/japan',
              title: `${city} · ${d.title}`,
              image_base64: CITY_THUMBS[city],
              country: 'Japan',
              city,
              type: d.type,
              theme: d.type === 'cafe' ? ['Foodie'] : ['Adventure'],
              cost_indicator: d.cost as '$' | '$$' | '$$$',
              vibe_notes: d.vibe,
              added_by: 'demo-seed',
            })
          );
        });
      });
    }

    if (!haveBali) {
      baliCities.forEach((city) => {
        demoItems.forEach((d) => {
          queue.push(
            addInspiration({
              url: 'https://example.com/bali',
              title: `${city} · ${d.title}`,
              image_base64: CITY_THUMBS[city],
              country: 'Bali',
              city,
              type: d.type,
              theme: d.type === 'cafe' ? ['Foodie'] : ['Adventure'],
              cost_indicator: d.cost as '$' | '$$' | '$$$',
              vibe_notes: d.vibe,
              added_by: 'demo-seed',
            })
          );
        });
      });
    }

    if (!haveGoa) {
      goaCities.forEach((city) => {
        demoItems.forEach((d) => {
          queue.push(
            addInspiration({
              url: 'https://example.com/goa',
              title: `${city} · ${d.title}`,
              image_base64: CITY_THUMBS[city],
              country: 'Goa',
              city,
              type: d.type,
              theme: d.type === 'cafe' ? ['Foodie'] : ['Adventure'],
              cost_indicator: d.cost as '$' | '$$' | '$$$',
              vibe_notes: d.vibe,
              added_by: 'demo-seed',
            })
          );
        });
      });
    }

    await Promise.allSettled(queue);
  } catch (e) {
    // Silent fail for demo seeding
  }
}
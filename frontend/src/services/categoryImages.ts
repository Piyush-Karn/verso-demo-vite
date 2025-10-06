import { getCachedImage } from './imageCache';

export type CategoryKey = 'Beaches' | 'Diving' | 'Cultural & religious' | 'Surfing' | 'Hiking' | 'Top cafes';

export const CATEGORY_KEYS: CategoryKey[] = ['Beaches','Diving','Cultural & religious','Surfing','Hiking','Top cafes'];

function queryFor(country: string, cat: CategoryKey) {
  switch (cat) {
    case 'Beaches': return `${country} best beaches aerial turquoise`;
    case 'Diving': return `${country} scuba diving reef underwater`;
    case 'Cultural & religious': return `${country} temples cultural heritage`;
    case 'Surfing': return `${country} surfing waves surf spot`;
    case 'Hiking': return `${country} hiking mountain trail viewpoint`;
    case 'Top cafes': return `${country} specialty coffee cafe interior`;
    default: return `${country} travel`; 
  }
}

export async function getCategoryThumb(country: string, cat: CategoryKey) {
  return await getCachedImage(queryFor(country, cat));
}
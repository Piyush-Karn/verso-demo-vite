import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBase64ForPlace } from './imageProvider';

const TTL_MS = 48 * 60 * 60 * 1000; // 48 hours
const KEY = (q: string) => `img:${q.toLowerCase()}`;
const META = (q: string) => `imgmeta:${q.toLowerCase()}`;

export async function getCachedImage(query: string): Promise<string | null> {
  try {
    const k = KEY(query);
    const m = META(query);
    const [cached, meta] = await Promise.all([AsyncStorage.getItem(k), AsyncStorage.getItem(m)]);
    const now = Date.now();
    const ts = meta ? Number(meta) : 0;

    if (cached && ts && now - ts < TTL_MS) return cached;

    const base64 = await getBase64ForPlace(query);
    if (base64) {
      await Promise.all([AsyncStorage.setItem(k, base64), AsyncStorage.setItem(m, String(now))]);
      return base64;
    }

    // nothing new; return stale cache if present
    return cached;
  } catch {
    return null;
  }
}

export async function primeImages(queries: string[]) {
  try {
    await Promise.all(queries.map((q) => getCachedImage(q)));
  } catch {
    // ignore
  }
}
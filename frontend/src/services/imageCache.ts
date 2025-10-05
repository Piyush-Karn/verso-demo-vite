import AsyncStorage from '@react-native-async-storage/async-storage';
import { getBase64ForPlace } from './imageProvider';

const KEY = (q: string) => `img:${q.toLowerCase()}`;

export async function getCachedImage(query: string): Promise<string | null> {
  try {
    const k = KEY(query);
    const cached = await AsyncStorage.getItem(k);
    if (cached) return cached;
    const base64 = await getBase64ForPlace(query);
    if (base64) await AsyncStorage.setItem(k, base64);
    return base64;
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
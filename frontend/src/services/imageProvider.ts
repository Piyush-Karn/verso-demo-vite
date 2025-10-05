import { PEXELS_KEY, UNSPLASH_KEYS } from './env';

async function fetchPexels(query: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1`, {
      headers: { Authorization: PEXELS_KEY },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const src = json?.photos?.[0]?.src;
    const url = src?.large2x || src?.large || src?.original;
    if (!url) return null;
    const img = await fetch(url);
    const blob = await img.blob();
    const base64 = await blobToBase64(blob);
    return base64;
  } catch {
    return null;
  }
}

async function fetchUnsplash(query: string): Promise<string | null> {
  const clientId = UNSPLASH_KEYS[0];
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&client_id=${clientId}`);
    if (!res.ok) return null;
    const json = await res.json();
    const urls = json?.results?.[0]?.urls;
    const url = urls?.full || urls?.regular || urls?.small;
    if (!url) return null;
    const img = await fetch(url);
    const blob = await img.blob();
    const base64 = await blobToBase64(blob);
    return base64;
  } catch {
    return null;
  }
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.onloadend = () => {
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function getBase64ForPlace(query: string): Promise<string | null> {
  // Try Pexels first, fallback to Unsplash
  let img = await fetchPexels(query);
  if (img) return img;
  img = await fetchUnsplash(query);
  return img;
}
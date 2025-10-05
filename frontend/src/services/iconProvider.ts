import { FLATICON_KEY } from './env';

export async function getIconBase64(keyword: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.flaticon.com/v3/search/icons/priority?q=${encodeURIComponent(keyword)}&limit=1`, {
      headers: { Authorization: `Bearer ${FLATICON_KEY}` },
    });
    if (!res.ok) return null;
    const json = await res.json();
    const url = json?.data?.[0]?.images?.png[512] || json?.data?.[0]?.images?.png[256];
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
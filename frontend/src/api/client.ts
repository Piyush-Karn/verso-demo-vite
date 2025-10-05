import axios from 'axios';

const base = process.env.EXPO_PUBLIC_BACKEND_URL || '';
// All backend API routes MUST be prefixed with '/api'
export const API_BASE = `${base}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type CountrySummary = { country: string; count: number; contributors: string[] };
export type CitySummary = { city: string; count: number };
export type Inspiration = {
  id: string;
  url: string;
  title?: string | null;
  image_base64?: string | null;
  country: string;
  city: string;
  type: 'activity' | 'cafe';
  theme: string[];
  cost_indicator?: '$' | '$$' | '$$$' | null;
  vibe_notes?: string | null;
  added_by?: string | null;
  contributors: string[];
  created_at: string;
};

export async function fetchCountries() {
  const { data } = await api.get<CountrySummary[]>('/collections/summary');
  return data;
}

export async function fetchCities(country: string) {
  const { data } = await api.get<CitySummary[]>(`/collections/${encodeURIComponent(country)}/cities`);
  return data;
}

export async function fetchCityItems(country: string, city: string, type?: 'activity' | 'cafe') {
  const params = type ? { type } : undefined;
  const { data } = await api.get<Inspiration[]>(`/city/${encodeURIComponent(country)}/${encodeURIComponent(city)}/items`, { params });
  return data;
}

export async function addInspiration(payload: Omit<Inspiration, 'id' | 'contributors' | 'created_at'>) {
  const body = {
    url: payload.url,
    title: payload.title || null,
    image_base64: payload.image_base64 || null,
    country: payload.country,
    city: payload.city,
    type: payload.type,
    theme: payload.theme || [],
    cost_indicator: payload.cost_indicator || null,
    vibe_notes: payload.vibe_notes || null,
    added_by: payload.added_by || null,
  };
  const { data } = await api.post<Inspiration>('/inspirations', body);
  return data;
}
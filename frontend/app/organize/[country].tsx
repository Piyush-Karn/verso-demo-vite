import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCities, type CitySummary, fetchCityItems, type Inspiration } from '../../src/api/client';
import Badge from '../../src/components/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { CITY_THUMBS } from '../../src/assets/imagesBase64';
import { getCachedImage } from '../../src/services/imageCache';
import { getIconBase64 } from '../../src/services/iconProvider';
import { CitiesMap, CitiesMapHandle } from '../../src/services/map';
import { CITY_COORDS } from '../../src/services/geo';
import Skeleton from '../../src/components/Skeleton';

const themes = ['Foodie', 'Adventure', 'Culture', 'Nightlife'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeather(country: string | string[] | undefined, month: string | null) {
  if (!month) return null;
  const m = month;
  const rainyMonths = { Bali: ['Nov','Dec','Jan','Feb'], Goa: ['Jun','Jul','Aug','Sep'], Japan: ['Jun','Jul'] } as Record<string, string[]>;
  const shoulder = ['Mar','Apr','Oct','Nov'];
  const c = Array.isArray(country) ? country[0] : country || 'General';
  const isRain = rainyMonths[c]?.includes(m);
  const isShoulder = shoulder.includes(m);
  if (isRain) return { kind: 'rainy' as const, tag: 'Rainy season' };
  if (isShoulder) return { kind: 'cloud' as const, tag: 'Shoulder season' };
  return { kind: 'sunny' as const, tag: 'Ideal time to visit' };
}

function seasonOf(month: string, country: string) {
  const rainy = getWeather(country, month)?.kind === 'rainy';
  const shoulder = getWeather(country, month)?.kind === 'cloud';
  return rainy ? 'rainy' : shoulder ? 'shoulder' : 'ideal';
}

export default function WithinCountry() {
  const { country } = useLocalSearchParams<{ country: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [showThemePicker, setShowThemePicker] = useState(false);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [cityImages, setCityImages] = useState<Record<string, string>>({});
  const [weatherIcon, setWeatherIcon] = useState<string | null>(null);
  const mapRef = useRef<CitiesMapHandle>(null);
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);

  useEffect(() => {
    if (!country) return;
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchCities(String(country));
        setCities(data);
        // fetch first 6 images quickly
        const first = data.slice(0, 6);
        const rest = data.slice(6);
        const results = await Promise.all(first.map(async (c) => ({ k: c.city, v: await getCachedImage(`${c.city} ${country} landmark sunset`) })));
        const map: Record<string, string> = {};
        results.forEach((r) => { if (r.v) map[r.k] = r.v; });
        setCityImages(map);
        // lazy fetch remaining
        setTimeout(async () => {
          const later = await Promise.all(rest.map(async (c) => ({ k: c.city, v: await getCachedImage(`${c.city} ${country} landmark sunset`) })));
          const extra: Record<string, string> = {};
          later.forEach((r) => { if (r.v) extra[r.k] = r.v; });
          setCityImages((prev) => ({ ...prev, ...extra }));
        }, 0);
        // fetch inspirations list for contributors/count
        const all = await Promise.all(data.map((c) => fetchCityItems(String(country), c.city)));
        setInspirations(all.flat());
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [country]);

  const weather = useMemo(() => getWeather(country, activeMonth), [country, activeMonth]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!weather) { setWeatherIcon(null); return; }
      const base = await getIconBase64(weather.kind);
      if (mounted) setWeatherIcon(base || null);
    })();
    return () => { mounted = false; };
  }, [weather]);

  const cityPoints = cities.map((c) => {
    const coord = CITY_COORDS[c.city];
    return coord ? { name: c.city, lng: coord[0], lat: coord[1] } : null;
  }).filter(Boolean) as Array<{ name: string; lng: number; lat: number }>;

  const contributorNames = useMemo(() => {
    const set = new Set<string>();
    inspirations.forEach((i) => { if (i.added_by) set.add(i.added_by); });
    return Array.from(set);
  }, [inspirations]);

  const totalCount = inspirations.length;

  const onShare = async () => {
    try {
      await Share.share({ message: `Verso playlist · ${country}\n${totalCount} inspirations curated by ${contributorNames.slice(0,3).join(', ')}\nOpen Verso to explore.` });
    } catch {}
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.title}>{country}</Text>
        <TouchableOpacity onPress={() => router.push('/organize/interests')}><Text style={styles.plan}>Your Interests</Text></TouchableOpacity>
      </View>

      {/* Contributors / count / share */}
      <View style={styles.statsRow}>
        <Text style={styles.statsText}>{totalCount} inspirations</Text>
        <View style={styles.avatars}>
          {contributorNames.slice(0,3).map((n) => {
            const label = (n.split('@')[0] || 'U').slice(0,2).toUpperCase();
            return <View key={n} style={styles.avatar}><Text style={styles.avatarText}>{label}</Text></View>;
          })}
          {contributorNames.length > 3 && (
            <View style={styles.avatar}><Text style={styles.avatarText}>+{contributorNames.length - 3}</Text></View>
          )}
        </View>
        <TouchableOpacity onPress={onShare} style={styles.shareBtn}>
          <Ionicons name="share-social-outline" size={16} color="#0b0b0b" />
          <Text style={styles.shareText}>Share</Text>
        </TouchableOpacity>
      </View>

      {/* City map (web: mapbox; native: placeholder) */}
      {cityPoints.length > 0 && (
        <View style={{ alignItems: 'center' }}>
          <CitiesMap ref={mapRef} points={cityPoints} onSelect={() => { /* no dynamic CTA here per requirement */ }} />
        </View>
      )}

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#888" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={styles.filterRow}>
            <Text style={styles.filterActive}>City</Text>
            <TouchableOpacity onPress={() => setShowThemePicker((s) => !s)}>
              <Text style={showThemePicker ? styles.filterActive : styles.filter}>Theme</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setActiveMonth(activeMonth ? null : 'May')}>
              <Text style={activeMonth ? styles.filterActive : styles.filter}>Date</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {activeTheme && <Badge label={`Theme: ${activeTheme}`} />}
            {activeMonth && weather && <Badge label={`${activeMonth} · ${weather.tag}`} />}
          </View>

          {showThemePicker && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }} contentContainerStyle={{ gap: 8 }}>
              {themes.map((t) => (
                <TouchableOpacity key={t} onPress={() => setActiveTheme((prev) => (prev === t ? null : t))} style={[styles.chip, activeTheme === t && styles.chipActive]}>
                  <Text style={[styles.chipText, activeTheme === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Best time calendar panel */}
          <View style={styles.calendar}>
            {months.map((m) => {
              const tag = seasonOf(m, String(country));
              return (
                <View key={m} style={[styles.monthBox, tag === 'ideal' ? styles.monthIdeal : tag === 'shoulder' ? styles.monthShoulder : styles.monthRainy]}>
                  <Text style={styles.monthText}>{m}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.legendRow}>
            <Ionicons name="sunny-outline" size={14} color="#e6e1d9" />
            <Text style={styles.legendText}>Ideal</Text>
            <Ionicons name="cloud-outline" size={14} color="#e6e1d9" style={{ marginLeft: 12 }} />
            <Text style={styles.legendText}>Shoulder</Text>
            <Ionicons name="rainy-outline" size={14} color="#e6e1d9" style={{ marginLeft: 12 }} />
            <Text style={styles.legendText}>Rainy</Text>
          </View>

          <View style={styles.grid}>
            {cities.map((c) => {
              const base64 = cityImages[c.city] || CITY_THUMBS[c.city];
              return (
                <TouchableOpacity key={c.city} style={styles.cityCard} onPress={() => router.push(`/organize/${encodeURIComponent(String(country))}/${encodeURIComponent(c.city)}`)}>
                  {base64 ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${base64}` }} style={styles.cityThumb} contentFit="cover" />
                  ) : (
                    <Skeleton style={styles.cityThumb} />
                  )}
                  <View style={{ padding: 10 }}>
                    <Text style={styles.cityName}>{c.city}</Text>
                    <Text style={styles.cityMeta}>{c.count} saved</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  back: { color: '#e6e1d9' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  plan: { color: '#e6e1d9', fontWeight: '600' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ef4444' },
  filterRow: { flexDirection: 'row', gap: 16, marginBottom: 12, paddingHorizontal: 8 },
  filterActive: { color: '#fff', fontWeight: '600' },
  filter: { color: '#9aa0a6' },
  chip: { borderWidth: 1, borderColor: '#2a2e35', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  chipActive: { backgroundColor: '#e6e1d9', borderColor: '#e6e1d9' },
  chipText: { color: '#e5e7eb', fontSize: 12 },
  chipTextActive: { color: '#0b0b0b', fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  cityCard: { width: '48%', backgroundColor: '#141414', borderRadius: 12, overflow: 'hidden' },
  cityThumb: { width: '100%', height: 96 },
  cityName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cityMeta: { color: '#9aa0a6', marginTop: 4 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginVertical: 6 },
  legendText: { color: '#9aa0a6', marginLeft: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 6 },
  statsText: { color: '#e5e7eb', fontWeight: '600' },
  avatars: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e6e1d9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0b0b0b', fontSize: 10, fontWeight: '700' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e6e1d9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  shareText: { color: '#0b0b0b', fontWeight: '700' },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  monthBox: { width: '22%', aspectRatio: 1.6, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  monthIdeal: { backgroundColor: '#114b8a' },
  monthShoulder: { backgroundColor: '#3b3b3b' },
  monthRainy: { backgroundColor: '#1f2f4a' },
  monthText: { color: '#e5e7eb', fontWeight: '600' },
});
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCities, type CitySummary, fetchCityItems, type Inspiration } from '../../src/api/client';
import { Image } from 'expo-image';
import Skeleton from '../../src/components/Skeleton';
import { CITY_THUMBS } from '../../src/assets/imagesBase64';
import { getCachedImage } from '../../src/services/imageCache';
import { CATEGORY_KEYS, getCategoryThumb, type CategoryKey } from '../../src/services/categoryImages';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getSeason(country: string | string[] | undefined, month: string | null) {
  if (!month) return null;
  const rainyMonths = { Bali: ['Nov','Dec','Jan','Feb'], Goa: ['Jun','Jul','Aug','Sep'], Japan: ['Jun','Jul'] } as Record<string, string[]>;
  const shoulder = ['Mar','Apr','Oct','Nov'];
  const c = Array.isArray(country) ? country[0] : (country || 'General');
  if (rainyMonths[c]?.includes(month)) return 'rainy';
  if (shoulder.includes(month)) return 'shoulder';
  return 'sunny';
}

const MONTH_TOPS: Record<string, CategoryKey[]> = {
  Jan: ['Beaches','Top cafes','Cultural & religious','Diving','Surfing','Hiking'],
  Feb: ['Beaches','Top cafes','Diving','Surfing','Cultural & religious','Hiking'],
  Mar: ['Hiking','Cultural & religious','Top cafes','Beaches','Diving','Surfing'],
  Apr: ['Hiking','Top cafes','Cultural & religious','Beaches','Surfing','Diving'],
  May: ['Surfing','Beaches','Top cafes','Hiking','Cultural & religious','Diving'],
  Jun: ['Top cafes','Cultural & religious','Beaches','Hiking','Diving','Surfing'],
  Jul: ['Top cafes','Cultural & religious','Beaches','Hiking','Diving','Surfing'],
  Aug: ['Beaches','Surfing','Hiking','Top cafes','Cultural & religious','Diving'],
  Sep: ['Hiking','Beaches','Top cafes','Cultural & religious','Surfing','Diving'],
  Oct: ['Cultural & religious','Top cafes','Hiking','Beaches','Surfing','Diving'],
  Nov: ['Beaches','Top cafes','Cultural & religious','Surfing','Hiking','Diving'],
  Dec: ['Beaches','Top cafes','Cultural & religious','Diving','Surfing','Hiking'],
};

export default function WithinCountry() {
  const { country } = useLocalSearchParams<{ country: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [cityImages, setCityImages] = useState<Record<string, string>>({});
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [view, setView] = useState<'city' | 'things' | 'season'>('city');
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [categoryImgs, setCategoryImgs] = useState<Record<string, string>>({});
  const [monthSheet, setMonthSheet] = useState(false);

  useEffect(() => {
    if (!country) return;
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchCities(String(country));
        setCities(data);
        // fetch city thumbnails (first 6 fast, rest later)
        const first = data.slice(0, 6);
        const results = await Promise.all(first.map(async (c) => ({ k: c.city, v: await getCachedImage(`${c.city} ${country} landmark sunset`) })));
        const map: Record<string, string> = {};
        results.forEach((r) => { if (r.v) map[r.k] = r.v; });
        setCityImages(map);
        setTimeout(async () => {
          const rest = data.slice(6);
          const later = await Promise.all(rest.map(async (c) => ({ k: c.city, v: await getCachedImage(`${c.city} ${country} landmark sunset`) })));
          const extra: Record<string, string> = {};
          later.forEach((r) => { if (r.v) extra[r.k] = r.v; });
          setCityImages((prev) => ({ ...prev, ...extra }));
        }, 0);
        const all = await Promise.all(data.map((c) => fetchCityItems(String(country), c.city)));
        setInspirations(all.flat());
        // fetch category thumbs for Things to do
        const catPairs = await Promise.all(CATEGORY_KEYS.map(async (k) => ({ k, v: await getCategoryThumb(String(country), k) })));
        const cmap: Record<string, string> = {};
        catPairs.forEach((p) => { if (p.v) cmap[p.k] = p.v; });
        setCategoryImgs(cmap);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [country]);

  const totalCount = inspirations.length;
  const contributors = Array.from(new Set(inspirations.map((i) => i.added_by).filter(Boolean))) as string[];

  const monthCats: CategoryKey[] = useMemo(() => {
    const m = activeMonth || months[new Date().getMonth()];
    return MONTH_TOPS[m] || CATEGORY_KEYS;
  }, [activeMonth]);

  const header = (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back</Text></TouchableOpacity>
      <Text style={styles.title}>{country}</Text>
      <View style={{ width: 60 }} />
    </View>
  );

  const chips = (
    <View style={styles.segmentRow}>
      <TouchableOpacity onPress={() => setView('city')}><Text style={view === 'city' ? styles.segActive : styles.seg}>City</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setView('things')}><Text style={view === 'things' ? styles.segActive : styles.seg}>Things to do</Text></TouchableOpacity>
      <TouchableOpacity onPress={() => setView('season')}><Text style={view === 'season' ? styles.segActive : styles.seg}>Season guide</Text></TouchableOpacity>
    </View>
  );

  const stats = (
    <View style={styles.statsRow}>
      <Text style={styles.statsText}>{totalCount} inspirations</Text>
      <View style={styles.avatars}>
        {contributors.slice(0,3).map((n) => {
          const label = (n.split('@')[0] || 'U').slice(0,2).toUpperCase();
          return <View key={n} style={styles.avatar}><Text style={styles.avatarText}>{label}</Text></View>;
        })}
        {contributors.length > 3 && (
          <View style={styles.avatar}><Text style={styles.avatarText}>+{contributors.length - 3}</Text></View>
        )}
      </View>
    </View>
  );

  const cityGrid = (
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
  );

  const thingsGrid = (
    <View style={styles.grid}>
      {CATEGORY_KEYS.map((cat) => {
        const base64 = categoryImgs[cat];
        return (
          <TouchableOpacity 
            key={cat} 
            style={styles.cityCard}
            onPress={() => router.push(`/organize/${encodeURIComponent(String(country))}/category/${encodeURIComponent(cat)}`)}
          >
            {base64 ? (
              <Image source={{ uri: `data:image/jpeg;base64,${base64}` }} style={styles.cityThumb} contentFit="cover" />
            ) : (
              <Skeleton style={styles.cityThumb} />
            )}
            <View style={{ padding: 10 }}>
              <Text style={styles.cityName}>{cat}</Text>
              <Text style={styles.cityMeta}>Curated picks</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const seasonGrid = (
    <View>
      <View style={styles.questionRow}>
        <Text style={styles.questionText}>Which month would you like to travel?</Text>
        <TouchableOpacity style={styles.dropdownBtn} onPress={() => setMonthSheet(true)}>
          <Text style={styles.dropdownText}>{activeMonth || months[new Date().getMonth()]}</Text>
          <Ionicons name="chevron-down" size={16} color="#e5e7eb" />
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>Best in {activeMonth || months[new Date().getMonth()]}</Text>
      <View style={styles.grid}>
        {monthCats.map((cat) => {
          const base64 = categoryImgs[cat];
          return (
            <TouchableOpacity 
              key={cat} 
              style={styles.cityCard}
              onPress={() => router.push(`/organize/${encodeURIComponent(String(country))}/category/${encodeURIComponent(cat)}`)}
            >
              {base64 ? (
                <Image source={{ uri: `data:image/jpeg;base64,${base64}` }} style={styles.cityThumb} contentFit="cover" />
              ) : (
                <Skeleton style={styles.cityThumb} />
              )}
              <View style={{ padding: 10 }}>
                <Text style={styles.cityName}>{cat}</Text>
                <Text style={styles.cityMeta}>Seasonal favorites</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {header}
      {stats}
      {chips}

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#888" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {view === 'city' && cityGrid}
          {view === 'things' && thingsGrid}
          {view === 'season' && seasonGrid}
        </ScrollView>
      )}

      <Modal visible={monthSheet} animationType="slide" transparent onRequestClose={() => setMonthSheet(false)}>
        <View style={styles.modalOverlay}><View style={styles.sheet}><View style={styles.drag} /><Text style={styles.sheetTitle}>Season guide</Text><Text style={styles.sheetBody}>Select a month above to filter the best seasonal picks for {country}.</Text><TouchableOpacity style={styles.closeBtn} onPress={() => setMonthSheet(false)}><Text style={styles.closeText}>Close</Text></TouchableOpacity></View></View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  back: { color: '#e6e1d9' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 6 },
  statsText: { color: '#e5e7eb', fontWeight: '600' },
  avatars: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e6e1d9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0b0b0b', fontSize: 10, fontWeight: '700' },
  segmentRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, marginTop: 4 },
  seg: { color: '#9aa0a6' },
  segActive: { color: '#fff', fontWeight: '700', textDecorationLine: 'underline' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ef4444' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  cityCard: { width: '48%', backgroundColor: '#141414', borderRadius: 12, overflow: 'hidden' },
  cityThumb: { width: '100%', height: 110 },
  cityName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cityMeta: { color: '#9aa0a6', marginTop: 4 },
  calendarRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 8 },
  monthPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  monthText: { color: '#e5e7eb', fontWeight: '600' },
  sunny: { backgroundColor: '#8a6a11' },
  shoulder: { backgroundColor: '#3b3b3b' },
  rainy: { backgroundColor: '#2b3d57' },
  sectionTitle: { color: '#e5e7eb', fontSize: 16, marginTop: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#111', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  drag: { alignSelf: 'center', width: 44, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 10 },
  sheetTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  sheetBody: { color: '#e5e7eb' },
  closeBtn: { borderWidth: 1, borderColor: '#2a2e35', borderRadius: 999, alignItems: 'center', paddingVertical: 10, marginTop: 12 },
  closeText: { color: '#e5e7eb' },
});
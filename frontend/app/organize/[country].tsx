import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCities, type CitySummary, fetchCityItems, type Inspiration } from '../../src/api/client';
import Badge from '../../src/components/Badge';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { CITY_THUMBS } from '../../src/assets/imagesBase64';
import { getCachedImage } from '../../src/services/imageCache';
import Skeleton from '../../src/components/Skeleton';

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

function bucketCategory(it: Inspiration): string {
  const t = (it.title || '').toLowerCase();
  if (it.type === 'cafe') return "Top cafes";
  if (t.includes('dive') || t.includes('snorkel')) return 'Diving';
  if (t.includes('surf')) return 'Surfing';
  if (t.includes('beach')) return 'Beaches';
  if (t.includes('hike') || t.includes('trek')) return 'Hiking & trekking';
  if (t.includes('temple') || t.includes('shrine') || t.includes('culture')) return 'Cultural & religious';
  if (t.includes('wildlife') || t.includes('safari')) return 'Wildlife';
  if (t.includes('road') || t.includes('drive')) return 'Road trips';
  return 'Other';
}

export default function WithinCountry() {
  const { country } = useLocalSearchParams<{ country: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<CitySummary[]>([]);
  const [activeMonth, setActiveMonth] = useState<string | null>(null);
  const [cityImages, setCityImages] = useState<Record<string, string>>({});
  const [inspirations, setInspirations] = useState<Inspiration[]>([]);
  const [monthSheet, setMonthSheet] = useState<{ open: boolean; month: string | null }>({ open: false, month: null });
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    if (!country) return;
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchCities(String(country));
        setCities(data);
        const first = data.slice(0, 6);
        const rest = data.slice(6);
        const results = await Promise.all(first.map(async (c) => ({ k: c.city, v: await getCachedImage(`${c.city} ${country} landmark sunset`) })));
        const map: Record<string, string> = {};
        results.forEach((r) => { if (r.v) map[r.k] = r.v; });
        setCityImages(map);
        setTimeout(async () => {
          const later = await Promise.all(rest.map(async (c) => ({ k: c.city, v: await getCachedImage(`${c.city} ${country} landmark sunset`) })));
          const extra: Record<string, string> = {};
          later.forEach((r) => { if (r.v) extra[r.k] = r.v; });
          setCityImages((prev) => ({ ...prev, ...extra }));
        }, 0);
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

  const totalCount = inspirations.length;
  const contributors = Array.from(new Set(inspirations.map((i) => i.added_by).filter(Boolean))) as string[];

  const categories = useMemo(() => {
    const map = new Map<string, Inspiration[]>();
    inspirations.forEach((i) => {
      const cat = bucketCategory(i);
      if (!map.has(cat)) map.set(cat, []);
      map.get(cat)!.push(i);
    });
    // order
    const order = ['Diving','Surfing','Beaches','Hiking & trekking','Cultural & religious','Top cafes','Wildlife','Road trips','Other'];
    return order.filter((k) => map.has(k)).map((k) => ({ name: k, items: map.get(k)! }));
  }, [inspirations]);

  const filteredTitle = activeMonth ? `Popular things to do in ${activeMonth}` : 'Popular things to do';

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.title}>{country}</Text>
        <TouchableOpacity onPress={() => setMonthSheet({ open: true, month: activeMonth || months[new Date().getMonth()] })} style={styles.shareBtn}>
          <Ionicons name="calendar-outline" size={16} color="#0b0b0b" />
          <Text style={styles.shareText}>Season guide</Text>
        </TouchableOpacity>
      </View>

      {/* Contributors / count */}
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

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#888" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {/* Filters */}
          <View style={styles.filterRow}>
            <Text style={styles.filterActive}>City</Text>
            <TouchableOpacity onPress={() => setShowCategories((s) => !s)}>
              <Text style={showCategories ? styles.filterActive : styles.filter}>Things to do</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMonthSheet({ open: true, month: activeMonth || months[new Date().getMonth()] })}>
              <Text style={activeMonth ? styles.filterActive : styles.filter}>Season guide</Text>
            </TouchableOpacity>
          </View>

          {/* Season guide mini calendar */}
          <View style={styles.calendar}>
            {months.map((m) => {
              const s = getSeason(country as string, m);
              return (
                <TouchableOpacity key={m} style={[styles.monthPill, s === 'sunny' ? styles.sunny : s === 'shoulder' ? styles.shoulder : styles.rainy]} onPress={() => setActiveMonth(m)}>
                  <Text style={styles.monthText}>{m} {s === 'sunny' ? '☀️' : s === 'shoulder' ? '☁️' : '☔'}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Title */}
          <Text style={styles.sectionTitle}>{filteredTitle}</Text>

          {/* Things to do categories or city grid */}
          {showCategories ? (
            <View style={styles.grid}>
              {categories.map((cat) => (
                <View key={cat.name} style={styles.categoryCard}>
                  <Text style={styles.categoryName}>{cat.name}</Text>
                  <Text style={styles.categoryMeta}>{cat.items.length} items</Text>
                </View>
              ))}
            </View>
          ) : (
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
          )}
        </ScrollView>
      )}

      {/* Season bottom sheet */}
      <Modal visible={!!monthSheet.open} animationType="slide" transparent onRequestClose={() => setMonthSheet({ open: false, month: null })}>
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.drag} />
            <Text style={styles.sheetTitle}>Season guide · {country}</Text>
            <View style={[styles.calendar, { marginTop: 6 }]}>
              {months.map((m) => {
                const s = getSeason(country as string, m);
                return (
                  <TouchableOpacity key={m} style={[styles.monthPill, s === 'sunny' ? styles.sunny : s === 'shoulder' ? styles.shoulder : styles.rainy]} onPress={() => { setActiveMonth(m); }}>
                    <Text style={styles.monthText}>{m} {s === 'sunny' ? '☀️' : s === 'shoulder' ? '☁️' : '☔'}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <Text style={styles.sheetBody}>Use the season guide to quickly filter what to do this month. The list above will focus on popular options for the selected month.</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setMonthSheet({ open: false, month: null })}><Text style={styles.closeText}>Close</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  back: { color: '#e6e1d9' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e6e1d9', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999 },
  shareText: { color: '#0b0b0b', fontWeight: '700' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ef4444' },
  filterRow: { flexDirection: 'row', gap: 16, marginBottom: 12, paddingHorizontal: 8 },
  filterActive: { color: '#fff', fontWeight: '600' },
  filter: { color: '#9aa0a6' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginTop: 8 },
  cityCard: { width: '48%', backgroundColor: '#141414', borderRadius: 12, overflow: 'hidden' },
  cityThumb: { width: '100%', height: 96 },
  cityName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cityMeta: { color: '#9aa0a6', marginTop: 4 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 6 },
  statsText: { color: '#e5e7eb', fontWeight: '600' },
  avatars: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#e6e1d9', alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#0b0b0b', fontSize: 10, fontWeight: '700' },
  calendar: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 8 },
  monthPill: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
  monthText: { color: '#e5e7eb', fontWeight: '600' },
  sunny: { backgroundColor: '#8a6a11' },
  shoulder: { backgroundColor: '#3b3b3b' },
  rainy: { backgroundColor: '#2b3d57' },
  sectionTitle: { color: '#e5e7eb', fontSize: 16, marginTop: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#111', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  drag: { alignSelf: 'center', width: 44, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 10 },
  sheetTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 6 },
  sheetBody: { color: '#e5e7eb' },
  closeBtn: { borderWidth: 1, borderColor: '#2a2e35', borderRadius: 999, alignItems: 'center', paddingVertical: 10, marginTop: 12 },
  closeText: { color: '#e5e7eb' },
  categoryCard: { width: '48%', backgroundColor: '#141414', borderRadius: 12, padding: 12 },
  categoryName: { color: '#fff', fontWeight: '700' },
  categoryMeta: { color: '#9aa0a6', marginTop: 4 },
});
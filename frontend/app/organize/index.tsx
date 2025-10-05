import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { fetchCountries, type CountrySummary } from '../../src/api/client';
import DemoMap from '../../src/services/map';
import { THUMB_JAPAN, THUMB_BALI, THUMB_GOA } from '../../src/assets/imagesBase64';
import { seedIfNeeded } from '../../src/demo/seed';
import { getCachedImage } from '../../src/services/imageCache';

const staticThumb: Record<string, string> = { Japan: THUMB_JAPAN, Bali: THUMB_BALI, Goa: THUMB_GOA };

export default function OrganizeHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        await seedIfNeeded();
        const data = await fetchCountries();
        setCountries(data);
        // fetch dynamic thumbs
        const results = await Promise.all(
          data.map(async (c) => ({ key: c.country, val: await getCachedImage(`${c.country} travel landscape`) }))
        );
        const next: Record<string, string> = {};
        results.forEach((r) => { if (r.val) next[r.key] = r.val; });
        setThumbs(next);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  const countryNames = useMemo(() => countries.map((c) => c.country), [countries]);

  const onSelectCountry = (c: string) => {
    const exists = countries.find((x) => x.country === c);
    if (exists) router.push(`/organize/${encodeURIComponent(c)}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.greeting}>Hello, Explorer</Text>
        <Text style={styles.subtle}>{countries.reduce((a, c) => a + c.count, 0)} Collections saved across {countries.length} Countries</Text>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <DemoMap countries={countryNames} onSelectCountry={onSelectCountry} />
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#888" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Your Collections</Text>
          {countries.map((c) => {
            const base64 = thumbs[c.country] || staticThumb[c.country] || THUMB_JAPAN;
            return (
              <TouchableOpacity key={c.country} style={styles.card} onPress={() => router.push(`/organize/${encodeURIComponent(c.country)}`)}>
                <Image source={{ uri: `data:image/jpeg;base64,${base64}` }} style={styles.thumb} contentFit="cover" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{c.country}</Text>
                  <Text style={styles.cardMeta}>{c.count} Inspirations</Text>
                </View>
                <Text style={styles.arrow}>›</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add')}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  headerBar: { paddingTop: 24, paddingHorizontal: 16, paddingBottom: 8 },
  greeting: { color: '#fff', fontSize: 22, fontWeight: '600' },
  subtle: { color: '#9aa0a6', marginTop: 4 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ef4444' },
  sectionTitle: { color: '#e5e7eb', fontSize: 16, marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141414', borderRadius: 16, padding: 12, marginBottom: 12, gap: 12 },
  thumb: { width: 56, height: 56, borderRadius: 12, backgroundColor: '#1f2937' },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cardMeta: { color: '#9aa0a6', marginTop: 4 },
  arrow: { color: '#9aa0a6', fontSize: 24 },
  fab: { position: 'absolute', right: 16, bottom: 24, width: 56, height: 56, backgroundColor: '#e6e1d9', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#0b0b0b', fontSize: 28, fontWeight: '600' },
});
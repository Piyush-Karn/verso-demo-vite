import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { fetchCountries, type CountrySummary } from '../../../src/api/client';
import DemoMap, { MapHandle } from '../../../src/services/map';
import { THUMB_JAPAN, THUMB_BALI, THUMB_GOA } from '../../../src/assets/imagesBase64';
import { seedIfNeeded } from '../../../src/demo/seed';
import { getCachedImage } from '../../../src/services/imageCache';
import Skeleton from '../../../src/components/Skeleton';

const staticThumb: Record<string, string> = { Japan: THUMB_JAPAN, Bali: THUMB_BALI, Goa: THUMB_GOA };

const queryForCountry = (c: string) => {
  if (c === 'Bali') return 'Bali turquoise beach aerial';
  if (c === 'Japan') return 'Japan mountain lake sunrise';
  if (c === 'Goa') return 'Goa beach sunset palm trees';
  return `${c} travel landscape`;
};

export default function ExploreHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [picked, setPicked] = useState<string | null>(null);
  const tries = useRef(0);
  const polling = useRef<NodeJS.Timeout | null>(null);
  const mapRef = useRef<MapHandle>(null);

  useEffect(() => {
    seedIfNeeded();
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchCountries();
        setCountries(data);
        if (data.length === 0 && tries.current < 10) {
          tries.current += 1;
          polling.current = setTimeout(run, 2000);
        } else {
          const results = await Promise.all(
            data.map(async (c) => ({ key: c.country, val: await getCachedImage(queryForCountry(c.country)) }))
          );
          const next: Record<string, string> = {};
          results.forEach((r) => { if (r.val) next[r.key] = r.val; });
          setThumbs(next);
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
    return () => { if (polling.current) clearTimeout(polling.current); };
  }, []);

  const countryNames = useMemo(() => countries.map((c) => c.country), [countries]);

  const onPick = (c: string) => { setPicked(c); mapRef.current?.flyToCountry(c); };
  const onNavigate = () => { if (picked) router.push(`/organize/${encodeURIComponent(picked)}?focus=1`); };
  const onCardPress = (c: string) => onPick(c);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.greeting}>Hello, Explorer</Text>
        <Text style={styles.subtle}>{countries.reduce((a, c) => a + c.count, 0)} Collections saved across {countries.length} Countries</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
          <TouchableOpacity onPress={() => router.push('/organize/interests')} style={styles.interestsBtn}>
            <Text style={styles.interestsText}>Your Interests</Text>
          </TouchableOpacity>
          {picked && (
            <TouchableOpacity onPress={() => setPicked(null)} style={styles.backAllBtn}>
              <Text style={styles.backAllText}>Back to all</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ alignItems: 'center', paddingVertical: 8 }}>
        <DemoMap ref={mapRef} countries={countryNames} onSelectCountry={onPick} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color="#888" />
          <Text style={styles.priming}>If this is your first load, we are priming demo content. This can take ~20–40s.</Text>
        </View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Your Collections</Text>
          {countries.map((c) => {
            const base64 = thumbs[c.country] || staticThumb[c.country] || THUMB_JAPAN;
            const dim = picked && c.country !== picked;
            return (
              <FadeRow key={c.country} dim={dim}>
                <TouchableOpacity style={[styles.card, dim && styles.cardDimmed]} onPress={() => onCardPress(c.country)}>
                  {base64 ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${base64}` }} style={styles.thumb} contentFit="cover" />
                  ) : (
                    <Skeleton style={styles.thumb} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.cardTitle, dim && styles.cardTitleDimmed]}>{c.country}</Text>
                    <Text style={[styles.cardMeta, dim && styles.cardMetaDimmed]}>{c.count} Inspirations</Text>
                  </View>
                  <Text style={[styles.arrow, dim && styles.arrowDimmed]}>›</Text>
                </TouchableOpacity>
              </FadeRow>
            );
          })}
        </ScrollView>
      )}

      {picked ? (
        <View style={styles.bigCtaBar}>
          <TouchableOpacity style={styles.bigCtaBtn} onPress={onNavigate}>
            <Text style={styles.bigCtaText}>Take me to {picked}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.fab} onPress={() => router.push('/add')}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  header: { paddingTop: 24, paddingHorizontal: 16, paddingBottom: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#9aa0a6', fontSize: 14, marginTop: 4 },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#141414', 
    borderRadius: 12, 
    marginHorizontal: 16, 
    paddingHorizontal: 12, 
    paddingVertical: 10 
  },
  searchIcon: { marginRight: 8 },
  searchInput: { 
    flex: 1, 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '400' 
  },
  mapContainer: { 
    height: 200, 
    marginHorizontal: 16, 
    marginTop: 16, 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  filtersContainer: { marginTop: 16 },
  filtersContent: { paddingHorizontal: 16, gap: 8 },
  filterBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#141414', 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    paddingVertical: 8 
  },
  filterBtnActive: { backgroundColor: '#e6e1d9' },
  filterText: { color: '#e5e7eb', fontSize: 14, fontWeight: '500' },
  filterTextActive: { color: '#0b0b0b' },
  destinationsContainer: { flex: 1, marginTop: 16 },
  destinationsContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  destinationCard: { 
    backgroundColor: '#141414', 
    borderRadius: 16, 
    overflow: 'hidden', 
    marginBottom: 12 
  },
  destinationImage: { width: '100%', height: 160 },
  destinationInfo: { padding: 16 },
  destinationName: { color: '#fff', fontSize: 18, fontWeight: '600' },
  destinationDescription: { color: '#e5e7eb', fontSize: 14, marginTop: 4 },
  destinationMeta: { flexDirection: 'row', gap: 16, marginTop: 8 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#9aa0a6', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#111', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  modalDrag: { alignSelf: 'center', width: 44, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 16 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 16 },
  themeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  themeOption: { 
    backgroundColor: '#1f1f1f', 
    borderRadius: 20, 
    paddingHorizontal: 12, 
    paddingVertical: 8 
  },
  themeOptionActive: { backgroundColor: '#e6e1d9' },
  themeText: { color: '#e5e7eb', fontSize: 14, fontWeight: '500' },
  themeTextActive: { color: '#0b0b0b' },
  modalCloseBtn: { 
    borderWidth: 1, 
    borderColor: '#2a2e35', 
    borderRadius: 999, 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  modalCloseText: { color: '#e5e7eb', fontWeight: '500' },
});
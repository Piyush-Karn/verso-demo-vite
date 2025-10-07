import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { fetchCountries, type CountrySummary } from '../../../src/api/client';
import { THUMB_JAPAN, THUMB_BALI, THUMB_GOA } from '../../../src/assets/imagesBase64';
import { getCachedImage } from '../../../src/services/imageCache';
import Skeleton from '../../../src/components/Skeleton';

const staticThumb: Record<string, string> = { Japan: THUMB_JAPAN, Bali: THUMB_BALI, Goa: THUMB_GOA };

const queryForCountry = (c: string) => {
  if (c === 'Bali') return 'Bali turquoise beach aerial';
  if (c === 'Japan') return 'Japan mountain lake sunrise';
  if (c === 'Goa') return 'Goa beach sunset palm trees';
  return `${c} travel landscape`;
};

export default function TripHome() {
  const router = useRouter();
  const [countries, setCountries] = useState<CountrySummary[]>([]);
  const [thumbs, setThumbs] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCountries();
        setCountries(data);
        
        // Load country thumbnails
        const results = await Promise.all(
          data.map(async (c) => ({ key: c.country, val: await getCachedImage(queryForCountry(c.country)) }))
        );
        const next: Record<string, string> = {};
        results.forEach((r) => { if (r.val) next[r.key] = r.val; });
        setThumbs(next);
      } catch (e) {
        console.error('Failed to load countries:', e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleCountrySelect = (country: string) => {
    router.push(`/trip/questionnaire?country=${encodeURIComponent(country)}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Your Trip</Text>
        <Text style={styles.subtitle}>Let's build your perfect itinerary</Text>
      </View>

      {/* Collections Prompt */}
      <View style={styles.promptSection}>
        <View style={styles.promptCard}>
          <Ionicons name="map-outline" size={32} color="#e6e1d9" />
          <Text style={styles.promptTitle}>Ready to plan?</Text>
          <Text style={styles.promptText}>
            Choose a collection below to build your trip from your saved inspirations
          </Text>
        </View>
      </View>

      {/* Collections */}
      <View style={styles.collectionsSection}>
        <Text style={styles.sectionTitle}>Build from your collections</Text>
        {loading ? (
          <View style={styles.center}>
            <Text style={styles.loadingText}>Loading your collections...</Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.collectionsGrid}>
            {countries.map((c) => {
              const base64 = thumbs[c.country] || staticThumb[c.country] || THUMB_JAPAN;
              return (
                <TouchableOpacity
                  key={c.country}
                  style={styles.collectionCard}
                  onPress={() => handleCountrySelect(c.country)}
                >
                  {base64 ? (
                    <Image 
                      source={{ uri: `data:image/jpeg;base64,${base64}` }} 
                      style={styles.collectionImage} 
                      contentFit="cover" 
                    />
                  ) : (
                    <Skeleton style={styles.collectionImage} />
                  )}
                  <View style={styles.collectionOverlay}>
                    <Text style={styles.collectionName}>{c.country}</Text>
                    <Text style={styles.collectionCount}>{c.count} inspirations</Text>
                    <View style={styles.planButton}>
                      <Ionicons name="airplane" size={16} color="#0b0b0b" />
                      <Text style={styles.planButtonText}>Plan Trip</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
            
            {/* Add a "Start Fresh" option */}
            <TouchableOpacity
              style={styles.freshCard}
              onPress={() => router.push('/(tabs)/trip/questionnaire')}
            >
              <Ionicons name="add-circle-outline" size={48} color="#e6e1d9" />
              <Text style={styles.freshTitle}>Start Fresh</Text>
              <Text style={styles.freshText}>
                Plan a new trip without using saved collections
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  header: { paddingTop: 24, paddingHorizontal: 16, paddingBottom: 16 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700' },
  subtitle: { color: '#9aa0a6', fontSize: 14, marginTop: 4 },
  promptSection: { paddingHorizontal: 16, marginBottom: 24 },
  promptCard: { 
    backgroundColor: '#141414', 
    borderRadius: 16, 
    padding: 20, 
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f'
  },
  promptTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 12, 
    marginBottom: 8 
  },
  promptText: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    textAlign: 'center', 
    lineHeight: 20 
  },
  collectionsSection: { flex: 1, paddingHorizontal: 16 },
  sectionTitle: { 
    color: '#e5e7eb', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 16 
  },
  center: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    paddingVertical: 40 
  },
  loadingText: { color: '#9aa0a6', fontSize: 14 },
  collectionsGrid: { paddingBottom: 100, gap: 16 },
  collectionCard: { 
    height: 200, 
    borderRadius: 16, 
    overflow: 'hidden', 
    position: 'relative' 
  },
  collectionImage: { width: '100%', height: '100%' },
  collectionOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 16 
  },
  collectionName: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  collectionCount: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    marginBottom: 12 
  },
  planButton: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#e6e1d9', 
    borderRadius: 999, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    alignSelf: 'flex-start',
    gap: 6 
  },
  planButtonText: { 
    color: '#0b0b0b', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  freshCard: { 
    backgroundColor: '#141414', 
    borderRadius: 16, 
    padding: 24, 
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1f1f1f',
    borderStyle: 'dashed'
  },
  freshTitle: { 
    color: '#e6e1d9', 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 12, 
    marginBottom: 8 
  },
  freshText: { 
    color: '#9aa0a6', 
    fontSize: 14, 
    textAlign: 'center', 
    lineHeight: 20 
  },
});
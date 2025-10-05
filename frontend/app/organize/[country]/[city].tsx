import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCityItems, type Inspiration } from '../../../src/api/client';
import { Image } from 'expo-image';

const { height } = Dimensions.get('window');

export default function CityDeepDive() {
  const { country, city } = useLocalSearchParams<{ country: string; city: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'activity' | 'cafe'>('activity');
  const [items, setItems] = useState<Inspiration[]>([]);

  useEffect(() => {
    if (!country || !city) return;
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchCityItems(String(country), String(city), type);
        setItems(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [country, city, type]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.title}>{city}</Text>
        <TouchableOpacity onPress={() => {}}><Text style={styles.plan}>Ask Me Anything</Text></TouchableOpacity>
      </View>

      <View style={styles.toggleRow}>
        <TouchableOpacity onPress={() => setType('activity')}><Text style={type === 'activity' ? styles.toggleActive : styles.toggle}>Activity</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setType('cafe')}><Text style={type === 'cafe' ? styles.toggleActive : styles.toggle}>Cafe</Text></TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#888" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView pagingEnabled showsVerticalScrollIndicator={false} snapToInterval={height * 0.82} decelerationRate="fast">
          {items.map((it) => (
            <View key={it.id} style={styles.card}> 
              {it.image_base64 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${it.image_base64}` }}
                  style={styles.photo}
                  contentFit="cover"
                />
              ) : (
                <View style={[styles.photo, { backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }]}>
                  <Text style={{ color: '#9aa0a6' }}>No image</Text>
                </View>
              )}
              <View style={styles.meta}>
                <Text style={styles.placeName}>{it.title || it.url}</Text>
                <Text style={styles.row}>{it.cost_indicator || 'Budget-friendly'}</Text>
                {it.vibe_notes ? <Text style={styles.row}>{it.vibe_notes}</Text> : null}
                <TouchableOpacity style={styles.addBtn}>
                  <Text style={styles.addText}>+ Add to Interests</Text>
                </TouchableOpacity>
                {it.added_by ? <Text style={styles.contrib}>Added by {it.added_by}</Text> : null}
              </View>
            </View>
          ))}
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
  toggleRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 16, marginBottom: 8 },
  toggle: { color: '#9aa0a6' },
  toggleActive: { color: '#fff', fontWeight: '600', textDecorationLine: 'underline' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  error: { color: '#ef4444' },
  card: { marginHorizontal: 16, marginBottom: 16, backgroundColor: '#0b0b0b' },
  photo: { height: height * 0.5, borderRadius: 16, overflow: 'hidden' },
  meta: { paddingVertical: 12 },
  placeName: { color: '#fff', fontSize: 20, fontWeight: '600' },
  row: { color: '#e5e7eb', marginTop: 4 },
  addBtn: { marginTop: 10, borderWidth: 1, borderColor: '#e6e1d9', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14, alignSelf: 'flex-start' },
  addText: { color: '#e6e1d9', fontWeight: '600' },
  contrib: { color: '#9aa0a6', marginTop: 8 },
});
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { fetchCountries, type CountrySummary } from '../../src/api/client';

export default function OrganizeHome() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [countries, setCountries] = useState<CountrySummary[]>([]);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchCountries();
        setCountries(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.headerBar}>
        <Text style={styles.greeting}>Hello, Explorer</Text>
        <Text style={styles.subtle}>{countries.reduce((a, c) => a + c.count, 0)} Collections saved across {countries.length} Countries</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#888" /></View>
      ) : error ? (
        <View style={styles.center}><Text style={styles.error}>{error}</Text></View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <Text style={styles.sectionTitle}>Your Collections</Text>
          {countries.map((c) => (
            <TouchableOpacity key={c.country} style={styles.card} onPress={() => router.push(`/organize/${encodeURIComponent(c.country)}`)}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{c.country}</Text>
                <Text style={styles.cardMeta}>{c.count} Inspirations</Text>
              </View>
              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
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
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#141414', borderRadius: 16, padding: 16, marginBottom: 12 },
  cardTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  cardMeta: { color: '#9aa0a6', marginTop: 4 },
  arrow: { color: '#9aa0a6', fontSize: 24 },
  fab: { position: 'absolute', right: 16, bottom: 24, width: 56, height: 56, backgroundColor: '#e6e1d9', borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  fabText: { color: '#0b0b0b', fontSize: 28, fontWeight: '600' },
});
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCities, type CitySummary } from '../../src/api/client';
import Badge from '../../src/components/Badge';
import { Ionicons } from '@expo/vector-icons';

const themes = ['Foodie', 'Adventure', 'Culture', 'Nightlife'];
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

function getWeather(country: string | string[] | undefined, month: string | null) {
  if (!month) return null;
  const m = month;
  // Demo mapping per country
  const rainyMonths = {
    Bali: ['Nov','Dec','Jan','Feb'],
    Goa: ['Jun','Jul','Aug','Sep'],
    Japan: ['Jun','Jul'],
  } as Record<string, string[]>;
  const shoulder = ['Mar','Apr','Oct','Nov'];

  const c = Array.isArray(country) ? country[0] : country || 'General';
  const isRain = rainyMonths[c]?.includes(m);
  const isShoulder = shoulder.includes(m);

  if (isRain) return { icon: 'rainy-outline' as const, tag: 'Rainy season' };
  if (isShoulder) return { icon: 'cloud-outline' as const, tag: 'Shoulder season' };
  return { icon: 'sunny-outline' as const, tag: 'Ideal time to visit' };
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

  useEffect(() => {
    if (!country) return;
    const run = async () => {
      try {
        setLoading(true);
        const data = await fetchCities(String(country));
        setCities(data);
      } catch (e: any) {
        setError(e?.message || 'Failed to load');
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [country]);

  const weather = useMemo(() => getWeather(country, activeMonth), [country, activeMonth]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.title}>{country}</Text>
        <TouchableOpacity onPress={() => {}}><Text style={styles.plan}>Plan Trip</Text></TouchableOpacity>
      </View>

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

          {/* Badges */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {activeTheme && <Badge label={`Theme: ${activeTheme}`} />}
            {activeMonth && weather && (
              <Badge label={`${activeMonth} · ${weather.tag}`} />
            )}
          </View>

          {/* Theme quick picks (hidden until Theme clicked) */}
          {showThemePicker && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 8 }} contentContainerStyle={{ gap: 8 }}>
              {themes.map((t) => (
                <TouchableOpacity key={t} onPress={() => setActiveTheme((prev) => (prev === t ? null : t))} style={[styles.chip, activeTheme === t && styles.chipActive]}>
                  <Text style={[styles.chipText, activeTheme === t && styles.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          {/* Month quick picks (demo) */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {months.map((m) => (
              <TouchableOpacity key={m} onPress={() => setActiveMonth((prev) => (prev === m ? null : m))} style={[styles.chip, activeMonth === m && styles.chipActive]}>
                <Text style={[styles.chipText, activeMonth === m && styles.chipTextActive]}>{m}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Weather guide row */}
          {activeMonth && weather && (
            <View style={styles.weatherRow}>
              <Ionicons name={weather.icon} size={16} color="#e6e1d9" />
              <Text style={styles.weatherText}>{weather.tag}</Text>
            </View>
          )}

          <View style={styles.grid}>
            {cities.map((c) => (
              <TouchableOpacity key={c.city} style={styles.cityCard} onPress={() => router.push(`/organize/${encodeURIComponent(String(country))}/${encodeURIComponent(c.city)}`)}>
                <Text style={styles.cityName}>{c.city}</Text>
                <Text style={styles.cityMeta}>{c.count} saved</Text>
                {activeMonth && weather && (
                  <View style={styles.badgeRow}>
                    <Ionicons name={weather.icon} size={14} color="#e6e1d9" />
                    <Text style={styles.vibe}>{weather.tag}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
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
  cityCard: { width: '48%', backgroundColor: '#141414', borderRadius: 12, padding: 16 },
  cityName: { color: '#fff', fontSize: 16, fontWeight: '600' },
  cityMeta: { color: '#9aa0a6', marginTop: 4 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 },
  vibe: { color: '#e5e7eb', fontSize: 12 },
  weatherRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginVertical: 8 },
  weatherText: { color: '#e5e7eb' },
});
import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useInterests } from '../../../src/store/useInterests';
import { Image } from 'expo-image';

export default function InterestsScreen() {
  const router = useRouter();
  const { items, clear } = useInterests();

  const grouped = useMemo(() => {
    const map: Record<string, typeof items> = {};
    items.forEach((it) => {
      const key = `${it.country} · ${it.city}`;
      map[key] = map[key] || [];
      map[key].push(it);
    });
    return map;
  }, [items]);

  const keys = Object.keys(grouped).sort();

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.title}>Your Interests</Text>
        <TouchableOpacity onPress={clear}><Text style={styles.plan}>Clear</Text></TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {keys.length === 0 ? (
          <Text style={{ color: '#9aa0a6' }}>No interests yet. Tap "+ Add to Interests" on any activity/cafe.</Text>
        ) : (
          keys.map((k) => (
            <View key={k} style={{ marginBottom: 16 }}>
              <Text style={styles.groupTitle}>{k}</Text>
              {grouped[k].map((it) => (
                <View key={it.id} style={styles.row}>
                  {it.image_base64 ? (
                    <Image source={{ uri: `data:image/jpeg;base64,${it.image_base64}` }} style={styles.thumb} contentFit="cover" />
                  ) : (
                    <View style={[styles.thumb, { backgroundColor: '#1f2937' }]} />
                  )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{it.title}</Text>
                    <Text style={styles.meta}>{it.type} • {it.cost_indicator || 'Budget-friendly'}</Text>
                  </View>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  back: { color: '#e6e1d9' },
  title: { color: '#fff', fontSize: 18, fontWeight: '600' },
  plan: { color: '#e6e1d9', fontWeight: '600' },
  groupTitle: { color: '#e5e7eb', fontWeight: '600', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#141414', borderRadius: 12, padding: 10, marginBottom: 8 },
  thumb: { width: 56, height: 56, borderRadius: 10 },
  name: { color: '#fff' },
  meta: { color: '#9aa0a6', marginTop: 2 },
});
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, Animated, Modal, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCityItems, type Inspiration } from '../../../src/api/client';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useInterests } from '../../../src/store/useInterests';

export default function CityDeepDive() {
  const { width } = useWindowDimensions();
  const { country, city } = useLocalSearchParams<{ country: string; city: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'activity' | 'cafe'>('activity');
  const [items, setItems] = useState<Inspiration[]>([]);
  const [sheetItem, setSheetItem] = useState<Inspiration | null>(null);
  const { add } = useInterests();

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

  const onAdd = (it: Inspiration) => {
    add({ id: it.id, title: it.title || it.url, type: it.type, country: it.country, city: it.city, image_base64: it.image_base64, cost_indicator: it.cost_indicator });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.back}>Back</Text></TouchableOpacity>
        <Text style={styles.title}>{city}</Text>
        <TouchableOpacity onPress={() => router.push('/organize/interests')}><Text style={styles.plan}>Your Interests</Text></TouchableOpacity>
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
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={width} snapToAlignment="center">
          {items.map((it, idx) => (
            <Card key={it.id} width={width} item={it} index={idx} onPress={() => setSheetItem(it)} onAdd={() => onAdd(it)} />
          ))}
        </ScrollView>
      )}

      <BottomSheet visible={!!sheetItem} onClose={() => setSheetItem(null)} item={sheetItem} />
    </View>
  );
}

function Card({ item, index, onPress, onAdd, width }: { item: Inspiration; index: number; onPress: () => void; onAdd: () => void; width: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 420, delay: index * 60, useNativeDriver: true }).start();
  }, [anim, index]);

  return (
    <Animated.View style={{ width, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
      <View style={styles.card}> 
        {item.image_base64 ? (
          <Image source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }} style={styles.photo} contentFit="cover" />
        ) : (
          <View style={[styles.photo, { backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }]}>
            <Text style={{ color: '#9aa0a6' }}>No image</Text>
          </View>
        )}
        <View style={styles.metaOverlay}>
          <Text style={styles.placeName}>{item.title || item.url}</Text>
          <Text style={styles.brief}>{item.cost_indicator || 'Budget-friendly'}</Text>
        </View>
        <View style={styles.metaBar}>
          <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
            <Text style={styles.addText}>+ Add to Interests</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.detailBtn} onPress={onPress}>
            <Text style={styles.detailText}>Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
}

function BottomSheet({ visible, onClose, item }: { visible: boolean; onClose: () => void; item: Inspiration | null }) {
  if (!item) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.sheet}>
          <View style={styles.drag} />
          <Text style={styles.sheetTitle}>{item.title || 'Details'}</Text>
          <Text style={styles.sheetRow}>Typical cost: {item.cost_indicator || '$$'}</Text>
          <Text style={styles.sheetRow}>Crowd level: {item.vibe_notes || 'Varies by season'}</Text>
          <Text style={styles.sheetRow}>Best time: Ideal in spring and autumn</Text>
          <Text style={styles.sheetRow}>User reviews: “Loved it”, “Worth the wait”, “Great vibe”</Text>
          {item.type === 'cafe' ? (
            <Text style={styles.sheetRow}>Menu: Signature lattes, pastries, light brunch</Text>
          ) : null}
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookText}>Book this {item.type}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const { height } = Dimensions.get('window');

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
  card: { marginHorizontal: 0, marginBottom: 16, backgroundColor: '#0b0b0b' },
  photo: { height: height * 0.55, borderRadius: 16, marginHorizontal: 16, overflow: 'hidden' },
  metaOverlay: { position: 'absolute', left: 24, bottom: height * 0.24 },
  placeName: { color: '#fff', fontSize: 20, fontWeight: '600' },
  brief: { color: '#e5e7eb', marginTop: 4 },
  metaBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 8 },
  addBtn: { borderWidth: 1, borderColor: '#e6e1d9', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14 },
  addText: { color: '#e6e1d9', fontWeight: '600' },
  detailBtn: { backgroundColor: '#e6e1d9', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14 },
  detailText: { color: '#0b0b0b', fontWeight: '700' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#111', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  drag: { alignSelf: 'center', width: 44, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 10 },
  sheetTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  sheetRow: { color: '#e5e7eb', marginBottom: 6 },
  bookBtn: { backgroundColor: '#e6e1d9', borderRadius: 999, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  bookText: { color: '#0b0b0b', fontWeight: '700' },
  closeBtn: { borderWidth: 1, borderColor: '#2a2e35', borderRadius: 999, alignItems: 'center', paddingVertical: 10, marginTop: 10 },
  closeText: { color: '#e5e7eb' },
});
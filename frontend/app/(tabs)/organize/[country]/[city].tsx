import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, Animated, Modal, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCityItems, type Inspiration } from '../../../src/api/client';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useInterests } from '../../../src/store/useInterests';
import { getCachedImage } from '../../../src/services/imageCache';

function enrich(it: Inspiration) {
  const rating = 4.2 + (it.id.charCodeAt(0) % 8) / 10; // 4.2 - 4.9
  const duration = it.type === 'cafe' ? '45–90 min' : '2–3 hrs';
  const tags = it.theme?.length ? it.theme.join(' • ') : it.type === 'cafe' ? 'Coffee • Brunch' : 'Scenic • Local';
  const neighborhood = it.city;
  const open = it.type === 'cafe' ? '8:00–22:00' : '6:00–18:00';
  return { rating: rating.toFixed(1), duration, tags, neighborhood, open };
}

export default function CityDeepDive() {
  const { width } = useWindowDimensions();
  const { country, city } = useLocalSearchParams<{ country: string; city: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [type, setType] = useState<'activity' | 'cafe'>('activity');
  const [items, setItems] = useState<Inspiration[]>([]);
  const [sheetItem, setSheetItem] = useState<Inspiration | null>(null);
  const { add, toggle, has } = useInterests();

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
        <ScrollView pagingEnabled showsVerticalScrollIndicator={false} decelerationRate="fast" snapToInterval={height * 0.9} snapToAlignment="start">
          {items.map((it, idx) => (
            <Card key={it.id} width={width} item={it} index={idx} onPress={() => setSheetItem(it)} onAdd={() => onAdd(it)} onHeart={() => toggle({ id: it.id, title: it.title || it.url, type: it.type, country: it.country, city: it.city, image_base64: it.image_base64, cost_indicator: it.cost_indicator })} liked={has(it.id)} />
          ))}
        </ScrollView>
      )}

      <DetailsSheet visible={!!sheetItem} onClose={() => setSheetItem(null)} item={sheetItem} country={String(country)} city={String(city)} />
    </View>
  );
}

function Card({ item, index, onPress, onAdd, onHeart, liked, width }: { item: Inspiration; index: number; onPress: () => void; onAdd: () => void; onHeart: () => void; liked: boolean; width: number }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [photo, setPhoto] = useState<string | null>(null);
  useEffect(() => { Animated.timing(anim, { toValue: 1, duration: 420, delay: index * 60, useNativeDriver: true }).start(); }, [anim, index]);
  useEffect(() => {
    if (!item.image_base64) {
      getCachedImage(`${item.title || item.url} ${item.city} ${item.country}`)
        .then((img) => { if (img) setPhoto(img); })
        .catch(() => {});
    }
  }, [item.image_base64, item.title, item.url, item.city, item.country]);
  const ex = enrich(item);
  const displayBase64 = item.image_base64 || photo || null;

  return (
    <Animated.View style={{ width, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
      <View style={styles.card}> 
        {displayBase64 ? (
          <Image source={{ uri: `data:image/jpeg;base64,${displayBase64}` }} style={styles.photo} contentFit="cover" />
        ) : (
          <View style={[styles.photo, { backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }]}>
            <ActivityIndicator color="#9aa0a6" />
          </View>
        )}
        <View style={styles.metaOverlay}>
          <Text style={styles.placeName}>{item.title || item.url}</Text>
          <View style={styles.rowInline}>
            <Ionicons name="star" size={14} color="#e6e1d9" /><Text style={styles.badgeText}>{ex.rating}</Text>
            <Text style={styles.dot}>•</Text>
            <Ionicons name="time-outline" size={14} color="#e6e1d9" /><Text style={styles.badgeText}>{ex.duration}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.badgeText}>{item.cost_indicator || '$$'}</Text>
          </View>
          <Text style={styles.tagsText}>{ex.tags}</Text>
          <Text style={styles.tagsText}>{ex.neighborhood} • Hours {ex.open}</Text>
        </View>
        <View style={styles.metaBar}>
          <TouchableOpacity onPress={onHeart}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? '#e25555' : '#e6e1d9'} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.addBtn} onPress={onAdd}><Text style={styles.addText}>+ Add to Interests</Text></TouchableOpacity>
            <TouchableOpacity style={styles.detailBtn} onPress={onPress}><Text style={styles.detailText}>Details</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function DetailsSheet({ visible, onClose, item, country, city }: { visible: boolean; onClose: () => void; item: Inspiration | null; country: string; city: string }) {
  const [tab, setTab] = useState<'overview' | 'reviews'>('overview');
  const [thumbs, setThumbs] = useState<string[]>([]);
  useEffect(() => {
    let mounted = true;
    if (!item) return;
    (async () => {
      const qs = [
        `${item?.title || ''} ${city} ${country}`,
        `close up ${item?.type} ${city}`,
        `scenic ${item?.type} ${city}`,
      ];
      const imgs: string[] = [];
      for (const q of qs) {
        const b = await getCachedImage(q);
        if (b) imgs.push(b);
      }
      if (mounted) setThumbs(imgs);
    })();
    return () => { mounted = false; };
  }, [item, country, city]);

  if (!item) return null;
  const reviews = [
    { source: 'Google', text: 'Absolutely loved this — the views were worth the early start. Great for photos.' },
    { source: 'Reddit', text: 'Timing matters. Go before 9 AM to avoid crowds, weekdays are calmer.' },
    { source: 'Google', text: 'Guide was friendly, the route was easy. Perfect for families.' },
    { source: 'Reddit', text: 'Bring water and a light jacket. Amazing at sunset as well.' },
  ];

  const overview = (
    <ScrollView>
      <Text style={sheetStyles.sectionTitle}>About this {item.type}</Text>
      <Text style={sheetStyles.body}>This detailed {item.type} experience explores the essence of {city}. Expect scenic spots, local flavors, and thoughtfully paced moments. Great in spring and autumn; weekends can be busy. Wear comfortable shoes and keep some cash handy for local vendors.</Text>
      <Text style={sheetStyles.body}>Typical cost: {item.cost_indicator || '$$'} • Crowd: {item.vibe_notes || 'Varies by season'} • Duration: {item.type === 'cafe' ? '45–90 min' : '2–3 hrs'}</Text>
      <View style={sheetStyles.thumbRow}>
        {thumbs.map((b64, i) => (
          <Image key={i} source={{ uri: `data:image/jpeg;base64,${b64}` }} style={sheetStyles.thumb} contentFit="cover" />
        ))}
      </View>
      <TouchableOpacity style={sheetStyles.bookBtn}><Text style={sheetStyles.bookText}>Book this {item.type}</Text></TouchableOpacity>
    </ScrollView>
  );

  const reviewsTab = (
    <ScrollView>
      {reviews.map((r, idx) => (
        <View key={idx} style={sheetStyles.reviewRow}>
          <Text style={sheetStyles.reviewSource}>{r.source}</Text>
          <Text style={sheetStyles.reviewText}>{r.text}</Text>
        </View>
      ))}
    </ScrollView>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={sheetStyles.overlay}>
        <View style={sheetStyles.sheet}>
          <View style={sheetStyles.drag} />
          <Text style={sheetStyles.title}>{item.title || 'Details'}</Text>
          <View style={sheetStyles.tabs}>
            <TouchableOpacity onPress={() => setTab('overview')}><Text style={tab === 'overview' ? sheetStyles.tabActive : sheetStyles.tab}>Overview</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('reviews')}><Text style={tab === 'reviews' ? sheetStyles.tabActive : sheetStyles.tab}>Reviews</Text></TouchableOpacity>
          </View>
          {tab === 'overview' ? overview : reviewsTab}
          <TouchableOpacity style={sheetStyles.closeBtn} onPress={onClose}><Text style={sheetStyles.closeText}>Close</Text></TouchableOpacity>
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
  rowInline: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  badgeText: { color: '#e5e7eb' },
  dot: { color: '#e5e7eb', marginHorizontal: 4 },
  tagsText: { color: '#e5e7eb', marginTop: 4 },
  metaBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, marginTop: 8, alignItems: 'center' },
  addBtn: { borderWidth: 1, borderColor: '#e6e1d9', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14 },
  addText: { color: '#e6e1d9', fontWeight: '600' },
  detailBtn: { backgroundColor: '#e6e1d9', borderRadius: 999, paddingVertical: 10, paddingHorizontal: 14 },
  detailText: { color: '#0b0b0b', fontWeight: '700' },
});

const sheetStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: { backgroundColor: '#111', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18, maxHeight: '80%' },
  drag: { alignSelf: 'center', width: 44, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 10 },
  title: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  tabs: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  tab: { color: '#9aa0a6' },
  tabActive: { color: '#e6e1d9', fontWeight: '700' },
  sectionTitle: { color: '#fff', fontWeight: '600', marginBottom: 6 },
  body: { color: '#e5e7eb', marginBottom: 8 },
  reviewRow: { marginBottom: 8 },
  reviewSource: { color: '#e6e1d9', fontWeight: '600' },
  reviewText: { color: '#e5e7eb' },
  bookBtn: { backgroundColor: '#e6e1d9', borderRadius: 999, alignItems: 'center', paddingVertical: 12, marginTop: 8 },
  bookText: { color: '#0b0b0b', fontWeight: '700' },
  closeBtn: { borderWidth: 1, borderColor: '#2a2e35', borderRadius: 999, alignItems: 'center', paddingVertical: 10, marginTop: 12 },
  closeText: { color: '#e5e7eb' },
  thumbRow: { flexDirection: 'row', gap: 6, marginTop: 8 },
  thumb: { width: 72, height: 72, borderRadius: 8 },
});
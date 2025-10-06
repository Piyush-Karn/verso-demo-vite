import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Dimensions, ScrollView, Animated, Modal, useWindowDimensions } from 'react-native';

const { height: screenHeight } = Dimensions.get('window');
import { useLocalSearchParams, useRouter } from 'expo-router';
import { fetchCityItems, type Inspiration } from '../../../../src/api/client';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useInterests } from '../../../../src/store/useInterests';
import { getCachedImage } from '../../../../src/services/imageCache';

// Category-specific data
const CATEGORY_DATA: Record<string, {
  type: 'activity' | 'cafe';
  items: Array<{
    title: string;
    description: string;
    rating: string;
    duration: string;
    cost: string;
    tags: string[];
    neighborhood: string;
    hours: string;
    imageQuery: string;
  }>;
}> = {
  'Beaches': {
    type: 'activity',
    items: [
      {
        title: 'Seminyak Beach',
        description: 'Famous sunset beach with trendy beach clubs and golden sand',
        rating: '4.6',
        duration: '2-4 hrs',
        cost: '$',
        tags: ['Sunset', 'Beach Clubs', 'Swimming'],
        neighborhood: 'Seminyak',
        hours: '24/7',
        imageQuery: 'Seminyak Beach sunset Bali'
      },
      {
        title: 'Kuta Beach',
        description: 'Popular surfing beach with vibrant nightlife and local warungs',
        rating: '4.3',
        duration: '2-3 hrs',
        cost: '$',
        tags: ['Surfing', 'Nightlife', 'Local Food'],
        neighborhood: 'Kuta',
        hours: '24/7',
        imageQuery: 'Kuta Beach surfing Bali'
      },
      {
        title: 'Nusa Dua Beach',
        description: 'Pristine white sand beach perfect for families and water sports',
        rating: '4.7',
        duration: '3-5 hrs',
        cost: '$$',
        tags: ['Family Friendly', 'Water Sports', 'Luxury'],
        neighborhood: 'Nusa Dua',
        hours: '24/7',
        imageQuery: 'Nusa Dua Beach white sand Bali'
      },
      {
        title: 'Pandawa Beach',
        description: 'Hidden gem with limestone cliffs and crystal clear waters',
        rating: '4.5',
        duration: '2-3 hrs',
        cost: '$',
        tags: ['Hidden Gem', 'Limestone Cliffs', 'Crystal Waters'],
        neighborhood: 'Kutuh',
        hours: '24/7',
        imageQuery: 'Pandawa Beach limestone cliffs Bali'
      }
    ]
  },
  'Diving': {
    type: 'activity',
    items: [
      {
        title: 'USAT Liberty Wreck',
        description: 'World-famous shipwreck dive with colorful coral and marine life',
        rating: '4.8',
        duration: '3-4 hrs',
        cost: '$$$',
        tags: ['Wreck Diving', 'Marine Life', 'Advanced'],
        neighborhood: 'Tulamben',
        hours: '6:00-18:00',
        imageQuery: 'USAT Liberty wreck diving Bali'
      },
      {
        title: 'Menjangan Island',
        description: 'Pristine coral walls and diverse marine ecosystem',
        rating: '4.7',
        duration: '6-8 hrs',
        cost: '$$$',
        tags: ['Coral Walls', 'Marine Park', 'Day Trip'],
        neighborhood: 'West Bali National Park',
        hours: '7:00-17:00',
        imageQuery: 'Menjangan Island coral diving Bali'
      },
      {
        title: 'Crystal Bay',
        description: 'Chance to see Mola Mola sunfish and manta rays',
        rating: '4.6',
        duration: '4-6 hrs',
        cost: '$$$',
        tags: ['Mola Mola', 'Manta Rays', 'Seasonal'],
        neighborhood: 'Nusa Penida',
        hours: '7:00-16:00',
        imageQuery: 'Crystal Bay manta ray diving Bali'
      },
      {
        title: 'Padang Bai',
        description: 'Easy shore diving with sharks and colorful reef fish',
        rating: '4.4',
        duration: '2-3 hrs',
        cost: '$$',
        tags: ['Shore Diving', 'Beginner Friendly', 'Reef Sharks'],
        neighborhood: 'Padang Bai',
        hours: '8:00-17:00',
        imageQuery: 'Padang Bai shark diving Bali'
      }
    ]
  },
  'Surfing': {
    type: 'activity',
    items: [
      {
        title: 'Uluwatu',
        description: 'World-class left-hand reef break with stunning cliff views',
        rating: '4.9',
        duration: '3-5 hrs',
        cost: '$$',
        tags: ['Left Hand Break', 'Advanced', 'Cliff Views'],
        neighborhood: 'Uluwatu',
        hours: '6:00-18:00',
        imageQuery: 'Uluwatu surf break Bali'
      },
      {
        title: 'Canggu',
        description: 'Consistent beach break perfect for all skill levels',
        rating: '4.5',
        duration: '2-4 hrs',
        cost: '$',
        tags: ['Beach Break', 'All Levels', 'Consistent'],
        neighborhood: 'Canggu',
        hours: '5:30-19:00',
        imageQuery: 'Canggu surf beach break Bali'
      },
      {
        title: 'Bingin Beach',
        description: 'Powerful reef break for experienced surfers only',
        rating: '4.7',
        duration: '2-3 hrs',
        cost: '$$',
        tags: ['Reef Break', 'Expert Only', 'Powerful'],
        neighborhood: 'Bingin',
        hours: '6:00-18:00',
        imageQuery: 'Bingin Beach reef break surfing Bali'
      },
      {
        title: 'Medewi',
        description: 'Long left-hand point break with black volcanic sand',
        rating: '4.3',
        duration: '3-4 hrs',
        cost: '$',
        tags: ['Point Break', 'Long Rides', 'Black Sand'],
        neighborhood: 'Medewi',
        hours: '6:00-18:00',
        imageQuery: 'Medewi point break surfing Bali'
      }
    ]
  },
  'Cultural & religious': {
    type: 'activity',
    items: [
      {
        title: 'Tanah Lot Temple',
        description: 'Iconic sea temple perched on a rocky outcrop',
        rating: '4.5',
        duration: '2-3 hrs',
        cost: '$$',
        tags: ['Sea Temple', 'Sunset', 'Iconic'],
        neighborhood: 'Tabanan',
        hours: '7:00-19:00',
        imageQuery: 'Tanah Lot temple sunset Bali'
      },
      {
        title: 'Besakih Temple',
        description: 'Mother Temple of Bali with stunning mountain views',
        rating: '4.6',
        duration: '3-4 hrs',
        cost: '$$',
        tags: ['Mother Temple', 'Mountain Views', 'Sacred'],
        neighborhood: 'Karangasem',
        hours: '8:00-17:00',
        imageQuery: 'Besakih temple mountain Bali'
      },
      {
        title: 'Tirta Empul',
        description: 'Sacred spring water temple for purification rituals',
        rating: '4.7',
        duration: '2-3 hrs',
        cost: '$',
        tags: ['Holy Spring', 'Purification', 'Spiritual'],
        neighborhood: 'Tampaksiring',
        hours: '8:00-17:00',
        imageQuery: 'Tirta Empul holy spring temple Bali'
      },
      {
        title: 'Ulun Danu Bratan',
        description: 'Picturesque lake temple with misty mountain backdrop',
        rating: '4.8',
        duration: '2-3 hrs',
        cost: '$$',
        tags: ['Lake Temple', 'Misty Mountains', 'Picturesque'],
        neighborhood: 'Bedugul',
        hours: '7:00-18:00',
        imageQuery: 'Ulun Danu Bratan lake temple Bali'
      }
    ]
  },
  'Hiking': {
    type: 'activity',
    items: [
      {
        title: 'Mount Batur Sunrise Trek',
        description: 'Early morning volcano hike for spectacular sunrise views',
        rating: '4.7',
        duration: '6-8 hrs',
        cost: '$$$',
        tags: ['Volcano', 'Sunrise', 'Challenging'],
        neighborhood: 'Kintamani',
        hours: '2:00-10:00',
        imageQuery: 'Mount Batur sunrise trek volcano Bali'
      },
      {
        title: 'Sekumpul Waterfall Trek',
        description: 'Jungle hike to Bali\'s most beautiful seven-tier waterfall',
        rating: '4.6',
        duration: '4-5 hrs',
        cost: '$$',
        tags: ['Waterfall', 'Jungle', 'Seven Tiers'],
        neighborhood: 'Singaraja',
        hours: '8:00-16:00',
        imageQuery: 'Sekumpul waterfall jungle trek Bali'
      },
      {
        title: 'Campuhan Ridge Walk',
        description: 'Easy scenic walk through lush green hills and valleys',
        rating: '4.4',
        duration: '1-2 hrs',
        cost: 'Free',
        tags: ['Easy Walk', 'Green Hills', 'Scenic'],
        neighborhood: 'Ubud',
        hours: '5:00-19:00',
        imageQuery: 'Campuhan Ridge walk green hills Ubud Bali'
      },
      {
        title: 'Mount Agung Trek',
        description: 'Challenging climb to Bali\'s highest and most sacred peak',
        rating: '4.8',
        duration: '8-12 hrs',
        cost: '$$$',
        tags: ['Sacred Peak', 'Challenging', 'Highest Mountain'],
        neighborhood: 'Karangasem',
        hours: '11:00-14:00',
        imageQuery: 'Mount Agung highest peak trek Bali'
      }
    ]
  },
  'Top cafes': {
    type: 'cafe',
    items: [
      {
        title: 'Seniman Coffee Studio',
        description: 'Artisanal coffee roastery with specialty brewing methods',
        rating: '4.8',
        duration: '1-2 hrs',
        cost: '$$',
        tags: ['Specialty Coffee', 'Artisanal', 'Roastery'],
        neighborhood: 'Ubud',
        hours: '7:00-22:00',
        imageQuery: 'Seniman Coffee Studio specialty coffee Ubud Bali'
      },
      {
        title: 'Revolver Espresso',
        description: 'Trendy cafe with excellent brunch and coffee in Seminyak',
        rating: '4.6',
        duration: '1-2 hrs',
        cost: '$$',
        tags: ['Brunch', 'Trendy', 'Excellent Coffee'],
        neighborhood: 'Seminyak',
        hours: '7:00-17:00',
        imageQuery: 'Revolver Espresso brunch cafe Seminyak Bali'
      },
      {
        title: 'Anomali Coffee',
        description: 'Indonesian coffee chain featuring local single origins',
        rating: '4.4',
        duration: '45-90 min',
        cost: '$',
        tags: ['Indonesian Coffee', 'Single Origin', 'Local Chain'],
        neighborhood: 'Multiple Locations',
        hours: '7:00-22:00',
        imageQuery: 'Anomali Coffee Indonesian single origin Bali'
      },
      {
        title: 'Kynd Community',
        description: 'Plant-based cafe with healthy smoothie bowls and coffee',
        rating: '4.7',
        duration: '1-2 hrs',
        cost: '$$',
        tags: ['Plant Based', 'Smoothie Bowls', 'Healthy'],
        neighborhood: 'Seminyak',
        hours: '7:00-18:00',
        imageQuery: 'Kynd Community plant based smoothie bowls Seminyak Bali'
      },
      {
        title: 'Clear Cafe',
        description: 'Organic vegetarian cafe with jungle views in Ubud',
        rating: '4.5',
        duration: '1-2 hrs',
        cost: '$$',
        tags: ['Organic', 'Vegetarian', 'Jungle Views'],
        neighborhood: 'Ubud',
        hours: '8:00-21:00',
        imageQuery: 'Clear Cafe organic vegetarian jungle Ubud Bali'
      },
      {
        title: 'La Baracca',
        description: 'Charming Italian cafe with authentic gelato and coffee',
        rating: '4.6',
        duration: '1 hr',
        cost: '$$',
        tags: ['Italian', 'Gelato', 'Authentic'],
        neighborhood: 'Seminyak',
        hours: '9:00-22:00',
        imageQuery: 'La Baracca Italian gelato cafe Seminyak Bali'
      },
      {
        title: 'Biku',
        description: 'Vintage-style cafe with antique furniture and homemade cakes',
        rating: '4.3',
        duration: '1-2 hrs',
        cost: '$$',
        tags: ['Vintage Style', 'Antique Furniture', 'Homemade Cakes'],
        neighborhood: 'Seminyak',
        hours: '8:00-23:00',
        imageQuery: 'Biku vintage antique cafe homemade cakes Seminyak Bali'
      },
      {
        title: 'Habitat Cafe',
        description: 'Cozy cafe with laptop-friendly environment and strong wifi',
        rating: '4.4',
        duration: '2-3 hrs',
        cost: '$',
        tags: ['Cozy', 'Laptop Friendly', 'Strong Wifi'],
        neighborhood: 'Canggu',
        hours: '7:00-22:00',
        imageQuery: 'Habitat Cafe cozy laptop friendly Canggu Bali'
      },
      {
        title: 'Monsieur Spoon',
        description: 'French bakery and cafe with croissants and pastries',
        rating: '4.7',
        duration: '45-90 min',
        cost: '$$',
        tags: ['French Bakery', 'Croissants', 'Pastries'],
        neighborhood: 'Kemang',
        hours: '7:00-21:00',
        imageQuery: 'Monsieur Spoon French bakery croissants Bali'
      },
      {
        title: 'Betelnut Cafe',
        description: 'Health-conscious cafe with raw and vegan options',
        rating: '4.5',
        duration: '1-2 hrs',
        cost: '$$',
        tags: ['Health Conscious', 'Raw Food', 'Vegan Options'],
        neighborhood: 'Canggu',
        hours: '7:00-21:00',
        imageQuery: 'Betelnut Cafe health conscious raw vegan Canggu Bali'
      }
    ]
  }
};

function enrich(item: any, index: number) {
  return {
    rating: item.rating,
    duration: item.duration,
    tags: item.tags.join(' • '),
    neighborhood: item.neighborhood,
    open: item.hours,
    id: `cat-${index}`,
    title: item.title,
    description: item.description,
    cost_indicator: item.cost
  };
}

export default function CategoryDeepDive() {
  const { width } = useWindowDimensions();
  const { country, categoryName } = useLocalSearchParams<{ country: string; categoryName: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<any[]>([]);
  const [sheetItem, setSheetItem] = useState<any | null>(null);
  const { add, toggle, has } = useInterests();

  const categoryData = CATEGORY_DATA[String(categoryName)] || CATEGORY_DATA['Beaches'];

  useEffect(() => {
    const loadItems = async () => {
      try {
        setLoading(true);
        const enrichedItems = categoryData.items.map((item, index) => enrich(item, index));
        
        // Load images for each item
        const itemsWithImages = await Promise.all(
          enrichedItems.map(async (item, index) => {
            try {
              const image = await getCachedImage(categoryData.items[index].imageQuery);
              return { ...item, image_base64: image };
            } catch (e) {
              return item;
            }
          })
        );
        
        setItems(itemsWithImages);
      } catch (e) {
        console.error('Failed to load category items:', e);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, [categoryName]);

  const onAdd = (it: any) => {
    add({ 
      id: it.id, 
      title: it.title, 
      type: categoryData.type, 
      country: String(country), 
      city: it.neighborhood, 
      image_base64: it.image_base64, 
      cost_indicator: it.cost_indicator 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.back}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{categoryName}</Text>
        <TouchableOpacity onPress={() => router.push('/organize/interests')}>
          <Text style={styles.plan}>Your Interests</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>{country} • {items.length} options</Text>
      </View>

      {loading ? (
        <View style={styles.center}><ActivityIndicator color="#888" /></View>
      ) : (
        <ScrollView 
          pagingEnabled 
          showsVerticalScrollIndicator={false} 
          decelerationRate="fast" 
          snapToInterval={screenHeight}
          snapToAlignment="start"
        >
          {items.map((it, idx) => (
            <Card 
              key={it.id} 
              width={width} 
              height={screenHeight}
              item={it} 
              index={idx} 
              onPress={() => setSheetItem(it)} 
              onAdd={() => onAdd(it)} 
              onHeart={() => toggle({ 
                id: it.id, 
                title: it.title, 
                type: categoryData.type, 
                country: String(country), 
                city: it.neighborhood, 
                image_base64: it.image_base64, 
                cost_indicator: it.cost_indicator 
              })} 
              liked={has(it.id)} 
            />
          ))}
        </ScrollView>
      )}

      <DetailsSheet 
        visible={!!sheetItem} 
        onClose={() => setSheetItem(null)} 
        item={sheetItem} 
        country={String(country)} 
        categoryName={String(categoryName)}
      />
    </View>
  );
}

function Card({ item, index, onPress, onAdd, onHeart, liked, width, height }: { 
  item: any; 
  index: number; 
  onPress: () => void; 
  onAdd: () => void; 
  onHeart: () => void; 
  liked: boolean; 
  width: number;
  height: number;
}) {
  const anim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => { 
    Animated.timing(anim, { 
      toValue: 1, 
      duration: 420, 
      delay: index * 60, 
      useNativeDriver: true 
    }).start(); 
  }, [anim, index]);

  return (
    <Animated.View style={{ width, opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
      <View style={styles.card}> 
        {item.image_base64 ? (
          <Image source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }} style={styles.photo} contentFit="cover" />
        ) : (
          <View style={[styles.photo, { backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }]}>
            <ActivityIndicator color="#9aa0a6" />
          </View>
        )}
        <View style={styles.metaOverlay}>
          <Text style={styles.placeName}>{item.title}</Text>
          <View style={styles.rowInline}>
            <Ionicons name="star" size={14} color="#e6e1d9" />
            <Text style={styles.badgeText}>{item.rating}</Text>
            <Text style={styles.dot}>•</Text>
            <Ionicons name="time-outline" size={14} color="#e6e1d9" />
            <Text style={styles.badgeText}>{item.duration}</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.badgeText}>{item.cost_indicator}</Text>
          </View>
          <Text style={styles.tagsText}>{item.tags}</Text>
          <Text style={styles.tagsText}>{item.neighborhood} • Hours {item.open}</Text>
        </View>
        <View style={styles.metaBar}>
          <TouchableOpacity onPress={onHeart}>
            <Ionicons name={liked ? 'heart' : 'heart-outline'} size={22} color={liked ? '#e25555' : '#e6e1d9'} />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TouchableOpacity style={styles.addBtn} onPress={onAdd}>
              <Text style={styles.addText}>+ Add to Interests</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.detailBtn} onPress={onPress}>
              <Text style={styles.detailText}>Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

function DetailsSheet({ visible, onClose, item, country, categoryName }: { 
  visible: boolean; 
  onClose: () => void; 
  item: any | null; 
  country: string; 
  categoryName: string 
}) {
  const [tab, setTab] = useState<'overview' | 'reviews'>('overview');
  const [thumbs, setThumbs] = useState<string[]>([]);
  
  useEffect(() => {
    let mounted = true;
    if (!item) return;
    
    (async () => {
      const qs = [
        `${item?.title || ''} ${country}`,
        `close up ${categoryName} ${country}`,
        `scenic ${categoryName} ${country}`,
      ];
      const imgs: string[] = [];
      for (const q of qs) {
        try {
          const b = await getCachedImage(q);
          if (b) imgs.push(b);
        } catch (e) {
          // Continue on error
        }
      }
      if (mounted) setThumbs(imgs);
    })();
    
    return () => { mounted = false; };
  }, [item, country, categoryName]);

  if (!item) return null;
  
  const reviews = [
    { source: 'Google', text: 'Absolutely loved this — the experience exceeded expectations. Great for photos and memories.' },
    { source: 'Reddit', text: 'Timing matters. Go early to avoid crowds, weekdays are usually better.' },
    { source: 'Google', text: 'Staff was friendly and knowledgeable. Perfect for first-timers.' },
    { source: 'Reddit', text: 'Bring water and comfortable shoes. The journey is worth it!' },
  ];

  const overview = (
    <ScrollView>
      <Text style={sheetStyles.sectionTitle}>About this {categoryName.toLowerCase()}</Text>
      <Text style={sheetStyles.body}>{item.description}</Text>
      <Text style={sheetStyles.body}>
        Typical cost: {item.cost_indicator} • Location: {item.neighborhood} • Duration: {item.duration}
      </Text>
      <View style={sheetStyles.thumbRow}>
        {thumbs.map((b64, i) => (
          <Image key={i} source={{ uri: `data:image/jpeg;base64,${b64}` }} style={sheetStyles.thumb} contentFit="cover" />
        ))}
      </View>
      <TouchableOpacity style={sheetStyles.bookBtn}>
        <Text style={sheetStyles.bookText}>Book this {categoryName.toLowerCase()}</Text>
      </TouchableOpacity>
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
            <TouchableOpacity onPress={() => setTab('overview')}>
              <Text style={tab === 'overview' ? sheetStyles.tabActive : sheetStyles.tab}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setTab('reviews')}>
              <Text style={tab === 'reviews' ? sheetStyles.tabActive : sheetStyles.tab}>Reviews</Text>
            </TouchableOpacity>
          </View>
          {tab === 'overview' ? overview : reviewsTab}
          <TouchableOpacity style={sheetStyles.closeBtn} onPress={onClose}>
            <Text style={sheetStyles.closeText}>Close</Text>
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
  subtitleRow: { paddingHorizontal: 16, paddingBottom: 8 },
  subtitle: { color: '#9aa0a6', fontSize: 14 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
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
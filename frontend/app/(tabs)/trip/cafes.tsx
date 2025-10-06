import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getCachedImage } from '../../../src/services/imageCache';

const { height: screenHeight } = Dimensions.get('window');

type Cafe = {
  id: string;
  name: string;
  type: 'brunch' | 'fine-dining' | 'street-food' | 'coffee' | 'local';
  cuisine: string[];
  rating: number;
  priceRange: string;
  location: string;
  tags: string[];
  description: string;
  whySaved: string;
  imageQuery: string;
  openHours: string;
  specialties: string[];
  atmosphere: string;
  bestFor: string[];
};

const CAFE_DATA: Record<string, Cafe[]> = {
  'Bali': [
    {
      id: 'c1',
      name: 'Seniman Coffee Studio',
      type: 'coffee',
      cuisine: ['Coffee', 'Light Bites'],
      rating: 4.8,
      priceRange: '$$',
      location: 'Ubud',
      tags: ['Specialty Coffee', 'Artisanal', 'Local Beans'],
      description: 'Award-winning coffee roastery showcasing Indonesian single origins with expert brewing methods and cozy atmosphere.',
      whySaved: 'As seen on your saved reel',
      imageQuery: 'Seniman Coffee Studio Ubud specialty coffee artisanal',
      openHours: '7:00 AM - 10:00 PM',
      specialties: ['Pour Over', 'Cold Brew', 'Latte Art', 'Single Origins'],
      atmosphere: 'Rustic-chic with wooden interiors',
      bestFor: ['Coffee Enthusiasts', 'Remote Work', 'Morning Ritual']
    },
    {
      id: 'c2',
      name: 'Revolver Espresso',
      type: 'brunch',
      cuisine: ['Australian', 'Brunch', 'Coffee'],
      rating: 4.6,
      priceRange: '$$',
      location: 'Seminyak',
      tags: ['Trendy', 'Brunch Spot', 'Instagram-worthy'],
      description: 'Hip Australian-style cafe serving exceptional brunch dishes and expertly crafted coffee in vibrant Seminyak.',
      whySaved: 'Perfect for your morning routine',
      imageQuery: 'Revolver Espresso Seminyak brunch Australian cafe',
      openHours: '7:00 AM - 5:00 PM',
      specialties: ['Avocado Toast', 'Flat White', 'Acai Bowls', 'Benedict'],
      atmosphere: 'Bright and bustling with street art',
      bestFor: ['Brunch Lovers', 'Social Media', 'Weekend Vibes']
    },
    {
      id: 'c3',
      name: 'Warung Babi Guling Pak Dobil',
      type: 'local',
      cuisine: ['Balinese', 'Traditional', 'Street Food'],
      rating: 4.5,
      priceRange: '$',
      location: 'Nusa Dua',
      tags: ['Local Favorite', 'Authentic', 'Traditional'],
      description: 'Legendary local warung serving the most authentic Babi Guling (suckling pig) - a true Balinese culinary experience.',
      whySaved: 'Must-try local experience',
      imageQuery: 'Warung Babi Guling traditional Balinese food authentic',
      openHours: '8:00 AM - 4:00 PM',
      specialties: ['Babi Guling', 'Nasi Campur', 'Sate Lilit', 'Es Kelapa'],
      atmosphere: 'Simple local warung, authentic vibes',
      bestFor: ['Food Adventurers', 'Cultural Experience', 'Local Cuisine']
    },
    {
      id: 'c4',
      name: 'Clear Cafe',
      type: 'fine-dining',
      cuisine: ['Vegetarian', 'Organic', 'Health Food'],
      rating: 4.7,
      priceRange: '$$$',
      location: 'Ubud',
      tags: ['Organic', 'Vegetarian', 'Jungle Views'],
      description: 'Elevated organic vegetarian cuisine with stunning jungle views, focusing on locally sourced ingredients and wellness.',
      whySaved: 'Matches your healthy lifestyle',
      imageQuery: 'Clear Cafe Ubud organic vegetarian jungle views',
      openHours: '8:00 AM - 9:00 PM',
      specialties: ['Buddha Bowls', 'Raw Desserts', 'Fresh Juices', 'Vegan Options'],
      atmosphere: 'Serene with panoramic jungle views',
      bestFor: ['Health Conscious', 'Peaceful Dining', 'Nature Lovers']
    },
    {
      id: 'c5',
      name: 'Kynd Community',
      type: 'brunch',
      cuisine: ['Plant-Based', 'Smoothie Bowls', 'Raw Food'],
      rating: 4.6,
      priceRange: '$$',
      location: 'Seminyak',
      tags: ['Plant-Based', 'Colorful', 'Health-focused'],
      description: 'Vibrant plant-based cafe famous for Instagram-worthy smoothie bowls and healthy comfort food with beachy vibes.',
      whySaved: 'Perfect for your wellness journey',
      imageQuery: 'Kynd Community Seminyak smoothie bowls plant based colorful',
      openHours: '7:00 AM - 6:00 PM',
      specialties: ['Smoothie Bowls', 'Raw Cakes', 'Coconut Lattes', 'Chia Puddings'],
      atmosphere: 'Bright, colorful, and energetic',
      bestFor: ['Health Enthusiasts', 'Instagram Photos', 'Post-Workout']
    },
    {
      id: 'c6',
      name: 'La Baracca',
      type: 'fine-dining',
      cuisine: ['Italian', 'Gelato', 'Mediterranean'],
      rating: 4.8,
      priceRange: '$$',
      location: 'Seminyak',
      tags: ['Italian', 'Authentic', 'Gelato'],
      description: 'Charming Italian trattoria serving authentic handmade pasta and artisanal gelato in a cozy Mediterranean setting.',
      whySaved: 'Romantic dinner spot from your saves',
      imageQuery: 'La Baracca Italian restaurant Seminyak authentic gelato',
      openHours: '12:00 PM - 11:00 PM',
      specialties: ['Handmade Pasta', 'Wood-fired Pizza', 'Gelato', 'Italian Wine'],
      atmosphere: 'Intimate Italian countryside vibes',
      bestFor: ['Romantic Dinners', 'Authentic Italian', 'Date Nights']
    },
    {
      id: 'c7',
      name: 'Betelnut Cafe',
      type: 'coffee',
      cuisine: ['Raw Food', 'Vegan', 'Coffee'],
      rating: 4.5,
      priceRange: '$$',
      location: 'Canggu',
      tags: ['Raw Food', 'Health Conscious', 'Surf Culture'],
      description: 'Health-focused cafe in the heart of Canggu, popular with surfers and digital nomads for raw food and excellent coffee.',
      whySaved: 'Fits your active lifestyle',
      imageQuery: 'Betelnut Cafe Canggu raw food vegan surf culture',
      openHours: '6:30 AM - 9:00 PM',
      specialties: ['Raw Chocolate', 'Cold-Pressed Juices', 'Acai Bowls', 'Coconut Coffee'],
      atmosphere: 'Laid-back surf town vibes',
      bestFor: ['Surfers', 'Digital Nomads', 'Health-focused']
    }
  ]
};

const FILTER_OPTIONS = {
  type: ['All', 'Brunch', 'Fine Dining', 'Street Food', 'Coffee', 'Local'],
  menu: ['All', 'Vegetarian', 'Vegan', 'Local Must-try', 'Fusion'],
  distance: ['All', 'Nearby (< 1km)', 'Walking Distance (< 2km)', 'Short Drive (< 5km)']
};

export default function CafeSelection() {
  const { country } = useLocalSearchParams<{ country?: string }>();
  const router = useRouter();
  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [filteredCafes, setFilteredCafes] = useState<Cafe[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cafeImages, setCafeImages] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  
  // Filters
  const [filters, setFilters] = useState({
    type: 'All',
    menu: 'All', 
    distance: 'All'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const countryCafes = CAFE_DATA[String(country)] || CAFE_DATA['Bali'];
    setCafes(countryCafes);
    setFilteredCafes(countryCafes);
    
    // Load cafe images
    const loadImages = async () => {
      const imagePromises = countryCafes.map(async (cafe) => {
        const image = await getCachedImage(cafe.imageQuery);
        return { id: cafe.id, image };
      });
      const results = await Promise.all(imagePromises);
      const imageMap: Record<string, string> = {};
      results.forEach((result) => {
        if (result.image) {
          imageMap[result.id] = result.image;
        }
      });
      setCafeImages(imageMap);
    };
    
    loadImages();
  }, [country]);

  useEffect(() => {
    // Apply filters
    let filtered = [...cafes];
    
    if (filters.type !== 'All') {
      filtered = filtered.filter(cafe => 
        cafe.type === filters.type.toLowerCase().replace(' ', '-')
      );
    }
    
    if (filters.menu !== 'All') {
      filtered = filtered.filter(cafe => 
        cafe.cuisine.some(c => c.toLowerCase().includes(filters.menu.toLowerCase())) ||
        cafe.tags.some(t => t.toLowerCase().includes(filters.menu.toLowerCase()))
      );
    }

    setFilteredCafes(filtered);
    setCurrentIndex(0);
  }, [filters, cafes]);

  const currentCafe = filteredCafes[currentIndex];
  const currentImage = currentCafe ? cafeImages[currentCafe.id] : null;

  const handleNext = () => {
    if (currentIndex < filteredCafes.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleWishlist = (cafeId: string) => {
    const newWishlist = new Set(wishlist);
    if (wishlist.has(cafeId)) {
      newWishlist.delete(cafeId);
    } else {
      newWishlist.add(cafeId);
    }
    setWishlist(newWishlist);
  };

  const handleAddToItinerary = (cafe: Cafe) => {
    console.log('Added to itinerary:', cafe.name);
    // Add logic to save to itinerary
  };

  if (!currentCafe) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#e6e1d9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cafes & Food in {country}</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No cafes found matching your filters</Text>
          <TouchableOpacity 
            style={styles.resetBtn}
            onPress={() => setFilters({ type: 'All', menu: 'All', distance: 'All' })}
          >
            <Text style={styles.resetBtnText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#e6e1d9" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Cafes & Food</Text>
          <Text style={styles.headerSubtitle}>{currentIndex + 1} of {filteredCafes.length} • {country}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowFilters(!showFilters)}>
          <Ionicons name="options-outline" size={24} color="#e6e1d9" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <View style={styles.filtersSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
            {Object.entries(FILTER_OPTIONS).map(([filterType, options]) => (
              <View key={filterType} style={styles.filterGroup}>
                <Text style={styles.filterLabel}>
                  {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
                </Text>
                <View style={styles.filterOptions}>
                  {options.map((option) => (
                    <TouchableOpacity
                      key={option}
                      style={[
                        styles.filterOption,
                        filters[filterType as keyof typeof filters] === option && styles.filterOptionActive
                      ]}
                      onPress={() => setFilters(prev => ({ ...prev, [filterType]: option }))}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        filters[filterType as keyof typeof filters] === option && styles.filterOptionTextActive
                      ]}>
                        {option}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Cafe Card - Full Screen Reel Style */}
      <ScrollView 
        pagingEnabled 
        showsVerticalScrollIndicator={false} 
        decelerationRate="fast"
        snapToInterval={screenHeight - 100}
        snapToAlignment="start"
        style={styles.reelContainer}
      >
        {filteredCafes.map((cafe, index) => {
          const image = cafeImages[cafe.id];
          const isActive = index === currentIndex;
          
          return (
            <View key={cafe.id} style={styles.cafeCard}>
              {image ? (
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${image}` }} 
                  style={styles.cafeImage} 
                  contentFit="cover" 
                />
              ) : (
                <View style={[styles.cafeImage, styles.imagePlaceholder]}>
                  <Ionicons name="restaurant-outline" size={48} color="#9aa0a6" />
                </View>
              )}
              
              <View style={styles.cafeOverlay}>
                <View style={styles.whySavedCard}>
                  <Text style={styles.whySavedText}>{cafe.whySaved}</Text>
                </View>
              </View>

              <View style={styles.cafeInfo}>
                <View style={styles.cafeHeader}>
                  <View style={styles.cafeBasicInfo}>
                    <Text style={styles.cafeName}>{cafe.name}</Text>
                    <Text style={styles.cafeLocation}>{cafe.location} • {cafe.cuisine.join(', ')}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => toggleWishlist(cafe.id)}
                    style={styles.heartBtn}
                  >
                    <Ionicons 
                      name={wishlist.has(cafe.id) ? 'heart' : 'heart-outline'} 
                      size={24} 
                      color={wishlist.has(cafe.id) ? '#e25555' : '#e6e1d9'} 
                    />
                  </TouchableOpacity>
                </View>

                <View style={styles.cafeMeta}>
                  <View style={styles.rating}>
                    <Ionicons name="star" size={16} color="#e6e1d9" />
                    <Text style={styles.ratingText}>{cafe.rating}</Text>
                  </View>
                  <Text style={styles.priceRange}>{cafe.priceRange}</Text>
                  <Text style={styles.openHours}>{cafe.openHours}</Text>
                </View>

                <Text style={styles.description}>{cafe.description}</Text>

                <View style={styles.tagsRow}>
                  {cafe.tags.slice(0, 3).map((tag, tagIndex) => (
                    <View key={tagIndex} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={styles.specialtiesSection}>
                  <Text style={styles.specialtiesTitle}>Must Try:</Text>
                  <Text style={styles.specialtiesText}>{cafe.specialties.join(' • ')}</Text>
                </View>

                <View style={styles.cafeActions}>
                  <TouchableOpacity 
                    style={styles.mapBtn}
                    onPress={() => {}}
                  >
                    <Ionicons name="map-outline" size={20} color="#e6e1d9" />
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.addToItineraryBtn}
                    onPress={() => handleAddToItinerary(cafe)}
                  >
                    <Text style={styles.addToItineraryText}>Save to Itinerary</Text>
                  </TouchableOpacity>
                </View>
              </div>
            </View>
          );
        })}
      </ScrollView>

      {/* Mini Map at Bottom */}
      <View style={styles.miniMap}>
        <View style={styles.miniMapContent}>
          <Ionicons name="location" size={16} color="#e6e1d9" />
          <Text style={styles.miniMapText}>
            {filteredCafes.length} cafés pinned nearby
          </Text>
        </View>
        <TouchableOpacity style={styles.showMapBtn}>
          <Text style={styles.showMapBtnText}>Show Map</Text>
        </TouchableOpacity>
      </View>

      {/* Floating Action: Ask Verso */}
      <TouchableOpacity style={styles.askVersoBtn}>
        <Ionicons name="chatbubble-ellipses" size={20} color="#0b0b0b" />
        <Text style={styles.askVersoText}>Ask Verso</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 24, 
    paddingHorizontal: 16, 
    paddingBottom: 12,
    gap: 12 
  },
  headerContent: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerSubtitle: { color: '#9aa0a6', fontSize: 14, marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 },
  emptyText: { color: '#9aa0a6', fontSize: 16, textAlign: 'center', marginBottom: 16 },
  resetBtn: { 
    backgroundColor: '#e6e1d9', 
    borderRadius: 999, 
    paddingHorizontal: 20, 
    paddingVertical: 10 
  },
  resetBtnText: { color: '#0b0b0b', fontWeight: '600' },
  filtersSection: { 
    backgroundColor: '#141414', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1f1f1f' 
  },
  filtersContent: { paddingHorizontal: 16, gap: 20 },
  filterGroup: { minWidth: 120 },
  filterLabel: { 
    color: '#e5e7eb', 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  filterOptions: { flexDirection: 'row', gap: 6, flexWrap: 'wrap' },
  filterOption: { 
    backgroundColor: '#1f1f1f', 
    borderRadius: 16, 
    paddingHorizontal: 10, 
    paddingVertical: 6 
  },
  filterOptionActive: { backgroundColor: '#e6e1d9' },
  filterOptionText: { color: '#e5e7eb', fontSize: 11 },
  filterOptionTextActive: { color: '#0b0b0b' },
  reelContainer: { flex: 1 },
  cafeCard: { 
    height: screenHeight - 100,
    backgroundColor: '#0b0b0b',
    position: 'relative'
  },
  cafeImage: { 
    height: '50%', 
    width: '100%' 
  },
  imagePlaceholder: { 
    backgroundColor: '#1f2937', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  cafeOverlay: { 
    position: 'absolute', 
    top: 20, 
    left: 16, 
    right: 16 
  },
  whySavedCard: { 
    backgroundColor: 'rgba(11, 11, 11, 0.9)', 
    borderRadius: 12, 
    padding: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#e6e1d9'
  },
  whySavedText: { 
    color: '#e6e1d9', 
    fontSize: 12, 
    fontWeight: '500' 
  },
  cafeInfo: { 
    flex: 1, 
    padding: 20 
  },
  cafeHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 12 
  },
  cafeBasicInfo: { flex: 1, marginRight: 12 },
  cafeName: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600',
    marginBottom: 4
  },
  cafeLocation: { 
    color: '#e5e7eb', 
    fontSize: 14 
  },
  heartBtn: { padding: 8 },
  cafeMeta: { 
    flexDirection: 'row', 
    gap: 16, 
    marginBottom: 12,
    alignItems: 'center'
  },
  rating: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4 
  },
  ratingText: { 
    color: '#e6e1d9', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  priceRange: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  openHours: { 
    color: '#9aa0a6', 
    fontSize: 12 
  },
  description: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 16 
  },
  tagsRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 16 
  },
  tag: { 
    backgroundColor: '#1f1f1f', 
    borderRadius: 12, 
    paddingHorizontal: 10, 
    paddingVertical: 4 
  },
  tagText: { 
    color: '#e5e7eb', 
    fontSize: 12 
  },
  specialtiesSection: { marginBottom: 20 },
  specialtiesTitle: { 
    color: '#e6e1d9', 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  specialtiesText: { 
    color: '#e5e7eb', 
    fontSize: 14 
  },
  cafeActions: { 
    flexDirection: 'row', 
    gap: 12,
    alignItems: 'center'
  },
  mapBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#141414', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  addToItineraryBtn: { 
    flex: 1, 
    backgroundColor: '#e6e1d9', 
    borderRadius: 999, 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  addToItineraryText: { 
    color: '#0b0b0b', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  miniMap: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    backgroundColor: '#141414', 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#1f1f1f'
  },
  miniMapContent: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8 
  },
  miniMapText: { 
    color: '#e5e7eb', 
    fontSize: 14 
  },
  showMapBtn: { 
    backgroundColor: '#1f1f1f', 
    borderRadius: 16, 
    paddingHorizontal: 12, 
    paddingVertical: 6 
  },
  showMapBtnText: { 
    color: '#e6e1d9', 
    fontSize: 12, 
    fontWeight: '500' 
  },
  askVersoBtn: {
    position: 'absolute',
    right: 16,
    bottom: 80,
    backgroundColor: '#e6e1d9',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  askVersoText: { color: '#0b0b0b', fontWeight: '600', fontSize: 14 },
});
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

const FILTERS = [
  { id: 'distance', label: 'Distance', icon: 'location-outline' },
  { id: 'time', label: 'Time/Season', icon: 'time-outline' },
  { id: 'theme', label: 'Theme', icon: 'color-palette-outline' },
  { id: 'lucky', label: "I'm feeling lucky", icon: 'dice-outline' },
];

const THEMES = [
  'Beach', 'Mountain', 'Wildlife', 'Concert', 'Cultural', 'Adventure', 'Food & Drink', 'Nightlife'
];

const SAMPLE_DESTINATIONS = [
  {
    id: '1',
    name: 'Tropical Bali',
    description: 'Perfect beaches and cultural temples',
    theme: 'Beach',
    season: 'Best in April-September',
    distance: '12 hours from home',
    imageQuery: 'Bali tropical beach temple aerial'
  },
  {
    id: '2', 
    name: 'Mountain Japan',
    description: 'Cherry blossoms and ancient traditions',
    theme: 'Cultural',
    season: 'Best in March-May',
    distance: '14 hours from home',
    imageQuery: 'Japan cherry blossom mountain temple'
  },
  {
    id: '3',
    name: 'Coastal Goa',
    description: 'Vibrant beaches and Portuguese heritage', 
    theme: 'Beach',
    season: 'Best in November-March',
    distance: '8 hours from home',
    imageQuery: 'Goa coastal beach palm trees sunset'
  }
];

export default function ExploreHome() {
  const router = useRouter();
  const mapRef = useRef<MapHandle>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [destinations, setDestinations] = useState(SAMPLE_DESTINATIONS);
  const [destinationImages, setDestinationImages] = useState<Record<string, string>>({});

  useEffect(() => {
    // Load destination images
    const loadImages = async () => {
      const imagePromises = destinations.map(async (dest) => {
        const image = await getCachedImage(dest.imageQuery);
        return { id: dest.id, image };
      });
      const results = await Promise.all(imagePromises);
      const imageMap: Record<string, string> = {};
      results.forEach((result) => {
        if (result.image) {
          imageMap[result.id] = result.image;
        }
      });
      setDestinationImages(imageMap);
    };
    loadImages();
  }, []);

  const filteredDestinations = destinations.filter((dest) => {
    if (searchQuery && !dest.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !dest.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedTheme && dest.theme !== selectedTheme) {
      return false;
    }
    return true;
  });

  const handleFilterPress = (filterId: string) => {
    if (filterId === 'theme') {
      setShowThemeModal(true);
    } else if (filterId === 'lucky') {
      // Shuffle destinations
      const shuffled = [...destinations].sort(() => Math.random() - 0.5);
      setDestinations(shuffled);
    }
    setActiveFilter(filterId === activeFilter ? null : filterId);
  };

  const handleDestinationPress = (destination: any) => {
    const countryName = destination.name.split(' ')[1]; // Extract country name
    router.push(`/explore/${encodeURIComponent(countryName)}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <Text style={styles.subtitle}>Discover your next adventure</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9aa0a6" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Where do you want to go?"
          placeholderTextColor="#9aa0a6"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <DemoMap ref={mapRef} countries={['Bali', 'Japan', 'Goa']} onSelectCountry={() => {}} />
      </View>

      {/* Filter Buttons */}
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[styles.filterBtn, activeFilter === filter.id && styles.filterBtnActive]}
              onPress={() => handleFilterPress(filter.id)}
            >
              <Ionicons 
                name={filter.icon as any} 
                size={16} 
                color={activeFilter === filter.id ? '#0b0b0b' : '#e5e7eb'} 
                style={{ marginRight: 6 }} 
              />
              <Text style={[styles.filterText, activeFilter === filter.id && styles.filterTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Destinations Grid */}
      <ScrollView style={styles.destinationsContainer} contentContainerStyle={styles.destinationsContent}>
        {filteredDestinations.map((destination) => {
          const image = destinationImages[destination.id];
          return (
            <TouchableOpacity
              key={destination.id}
              style={styles.destinationCard}
              onPress={() => handleDestinationPress(destination)}
            >
              {image ? (
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${image}` }} 
                  style={styles.destinationImage} 
                  contentFit="cover" 
                />
              ) : (
                <Skeleton style={styles.destinationImage} />
              )}
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationDescription}>{destination.description}</Text>
                <View style={styles.destinationMeta}>
                  <View style={styles.metaItem}>
                    <Ionicons name="time-outline" size={12} color="#9aa0a6" />
                    <Text style={styles.metaText}>{destination.season}</Text>
                  </View>
                  <View style={styles.metaItem}>
                    <Ionicons name="location-outline" size={12} color="#9aa0a6" />
                    <Text style={styles.metaText}>{destination.distance}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Theme Selection Modal */}
      <Modal visible={showThemeModal} animationType="slide" transparent onRequestClose={() => setShowThemeModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalDrag} />
            <Text style={styles.modalTitle}>Select Theme</Text>
            <View style={styles.themeGrid}>
              {THEMES.map((theme) => (
                <TouchableOpacity
                  key={theme}
                  style={[styles.themeOption, selectedTheme === theme && styles.themeOptionActive]}
                  onPress={() => {
                    setSelectedTheme(selectedTheme === theme ? null : theme);
                    setShowThemeModal(false);
                  }}
                >
                  <Text style={[styles.themeText, selectedTheme === theme && styles.themeTextActive]}>
                    {theme}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowThemeModal(false)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
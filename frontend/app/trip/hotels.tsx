import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getCachedImage } from '../src/services/imageCache';

const { height: screenHeight } = Dimensions.get('window');

type Hotel = {
  id: string;
  name: string;
  type: 'luxury' | 'boutique' | 'budget' | 'resort';
  rating: number;
  priceRange: string;
  location: string;
  amenities: string[];
  description: string;
  whyPicked: string;
  imageQuery: string;
  reviews: Array<{
    source: 'Google' | 'Booking' | 'TripAdvisor';
    rating: number;
    text: string;
    travelerType: string;
  }>;
  nearbyAttractions: string[];
};

const HOTEL_DATA: Record<string, Hotel[]> = {
  'Bali': [
    {
      id: 'h1',
      name: 'Hanging Gardens of Bali',
      type: 'luxury',
      rating: 4.8,
      priceRange: '$$$',
      location: 'Ubud',
      amenities: ['Infinity Pool', 'Spa', 'Fine Dining', 'Butler Service'],
      description: 'Award-winning luxury resort nestled in the heart of Bali\'s lush rainforest, featuring iconic infinity pools overlooking the Ayung River valley.',
      whyPicked: 'Perfect for your saved cafés nearby & has 4.8⭐ reviews from similar travelers.',
      imageQuery: 'Hanging Gardens Bali infinity pool luxury resort',
      reviews: [
        { source: 'Google', rating: 5, text: 'Absolutely breathtaking views and exceptional service. The infinity pool is iconic!', travelerType: 'Luxury travelers' },
        { source: 'TripAdvisor', rating: 5, text: 'Perfect for special occasions. Every detail is thoughtfully designed.', travelerType: 'Couples' }
      ],
      nearbyAttractions: ['Tegallalang Rice Terraces', 'Ubud Monkey Forest', 'Sacred Monkey Forest Sanctuary']
    },
    {
      id: 'h2',
      name: 'COMO Shambhala Estate',
      type: 'resort',
      rating: 4.7,
      priceRange: '$$$',
      location: 'Begawan Giri',
      amenities: ['Wellness Programs', 'Organic Garden', 'Yoga Pavilion', 'Natural Spring'],
      description: 'Holistic wellness retreat focusing on health, healing, and spiritual well-being in a pristine jungle setting.',
      whyPicked: 'Matches your wellness interests and offers transformative experiences.',
      imageQuery: 'COMO Shambhala Estate wellness retreat jungle Bali',
      reviews: [
        { source: 'Booking', rating: 5, text: 'Life-changing wellness experience. The programs are world-class.', travelerType: 'Wellness enthusiasts' },
        { source: 'Google', rating: 4, text: 'Peaceful and rejuvenating. Perfect for digital detox.', travelerType: 'Solo travelers' }
      ],
      nearbyAttractions: ['Ayung River', 'Petulu Village', 'Gunung Lebah Temple']
    },
    {
      id: 'h3',
      name: 'Alila Villas Uluwatu',
      type: 'boutique',
      rating: 4.6,
      priceRange: '$$',
      location: 'Uluwatu',
      amenities: ['Cliff-top Views', 'Beach Access', 'Contemporary Design', 'Sunset Bar'],
      description: 'Stunning cliff-top villas with minimalist design and panoramic ocean views, perfectly positioned for Bali\'s famous sunsets.',
      whyPicked: 'Close to your saved surf spots and offers spectacular sunset experiences.',
      imageQuery: 'Alila Villas Uluwatu cliff ocean views sunset',
      reviews: [
        { source: 'TripAdvisor', rating: 5, text: 'Unmatched views and modern luxury. The sunset bar is incredible.', travelerType: 'Design lovers' },
        { source: 'Google', rating: 4, text: 'Great location for exploring southern Bali beaches.', travelerType: 'Beach lovers' }
      ],
      nearbyAttractions: ['Uluwatu Temple', 'Bingin Beach', 'Padang Padang Beach']
    },
    {
      id: 'h4',
      name: 'The Kayon Jungle Resort',
      type: 'boutique',
      rating: 4.5,
      priceRange: '$$',
      location: 'Ubud',
      amenities: ['Jungle Views', 'Natural Pool', 'Organic Restaurant', 'Yoga Deck'],
      description: 'Eco-luxury resort surrounded by pristine rainforest, offering an intimate connection with nature while maintaining modern comforts.',
      whyPicked: 'Eco-friendly choice matching your sustainable travel preferences.',
      imageQuery: 'Kayon Jungle Resort Ubud rainforest eco luxury',
      reviews: [
        { source: 'Booking', rating: 5, text: 'Magical jungle experience. Waking up to bird songs was incredible.', travelerType: 'Nature lovers' },
        { source: 'Google', rating: 4, text: 'Beautiful design integrated with nature. Very peaceful.', travelerType: 'Eco-conscious travelers' }
      ],
      nearbyAttractions: ['Sekumpul Waterfall', 'Banyumala Twin Waterfalls', 'Munduk Village']
    }
  ]
};

export default function HotelSelection() {
  const { country } = useLocalSearchParams<{ country?: string }>();
  const router = useRouter();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [hotelImages, setHotelImages] = useState<Record<string, string>>({});
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());

  useEffect(() => {
    const countryHotels = HOTEL_DATA[String(country)] || HOTEL_DATA['Bali'];
    setHotels(countryHotels);
    
    // Load hotel images
    const loadImages = async () => {
      const imagePromises = countryHotels.map(async (hotel) => {
        const image = await getCachedImage(hotel.imageQuery);
        return { id: hotel.id, image };
      });
      const results = await Promise.all(imagePromises);
      const imageMap: Record<string, string> = {};
      results.forEach((result) => {
        if (result.image) {
          imageMap[result.id] = result.image;
        }
      });
      setHotelImages(imageMap);
    };
    
    loadImages();
  }, [country]);

  const currentHotel = hotels[currentIndex];
  const currentImage = currentHotel ? hotelImages[currentHotel.id] : null;

  const handleNext = () => {
    if (currentIndex < hotels.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const toggleWishlist = (hotelId: string) => {
    const newWishlist = new Set(wishlist);
    if (wishlist.has(hotelId)) {
      newWishlist.delete(hotelId);
    } else {
      newWishlist.add(hotelId);
    }
    setWishlist(newWishlist);
  };

  const handleSelect = (hotel: Hotel) => {
    // Add to trip itinerary
    console.log('Selected hotel:', hotel.name);
    router.back();
  };

  if (!currentHotel) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#e6e1d9" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hotels in {country}</Text>
        </View>
        <View style={styles.center}>
          <Text style={styles.emptyText}>No hotels available</Text>
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
          <Text style={styles.headerTitle}>Hotels in {country}</Text>
          <Text style={styles.headerSubtitle}>{currentIndex + 1} of {hotels.length}</Text>
        </View>
        <TouchableOpacity onPress={() => setShowDetails(true)}>
          <Ionicons name="information-circle-outline" size={24} color="#e6e1d9" />
        </TouchableOpacity>
      </View>

      {/* Hero Card */}
      <View style={styles.heroSection}>
        <View style={styles.heroCard}>
          {currentImage ? (
            <Image 
              source={{ uri: `data:image/jpeg;base64,${currentImage}` }} 
              style={styles.heroImage} 
              contentFit="cover" 
            />
          ) : (
            <View style={[styles.heroImage, styles.imagePlaceholder]}>
              <Ionicons name="image-outline" size={48} color="#9aa0a6" />
            </View>
          )}
          
          <View style={styles.heroOverlay}>
            <View style={styles.whyPickedCard}>
              <Text style={styles.whyPickedText}>{currentHotel.whyPicked}</Text>
            </View>
          </View>

          <View style={styles.hotelInfo}>
            <View style={styles.hotelHeader}>
              <View>
                <Text style={styles.hotelName}>{currentHotel.name}</Text>
                <Text style={styles.hotelLocation}>{currentHotel.location} • {currentHotel.type}</Text>
              </View>
              <TouchableOpacity 
                onPress={() => toggleWishlist(currentHotel.id)}
                style={styles.wishlistBtn}
              >
                <Ionicons 
                  name={wishlist.has(currentHotel.id) ? 'heart' : 'heart-outline'} 
                  size={24} 
                  color={wishlist.has(currentHotel.id) ? '#e25555' : '#e6e1d9'} 
                />
              </TouchableOpacity>
            </View>

            <View style={styles.hotelMeta}>
              <View style={styles.rating}>
                <Ionicons name="star" size={16} color="#e6e1d9" />
                <Text style={styles.ratingText}>{currentHotel.rating}</Text>
              </View>
              <Text style={styles.priceRange}>{currentHotel.priceRange}</Text>
            </View>

            <Text style={styles.description} numberOfLines={3}>
              {currentHotel.description}
            </Text>

            <View style={styles.amenitiesRow}>
              {currentHotel.amenities.slice(0, 3).map((amenity, index) => (
                <View key={index} style={styles.amenityChip}>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Navigation Controls */}
      <View style={styles.navigation}>
        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === 0 && styles.navBtnDisabled]} 
          onPress={handlePrevious}
          disabled={currentIndex === 0}
        >
          <Ionicons name="chevron-back" size={24} color={currentIndex === 0 ? '#666' : '#e6e1d9'} />
        </TouchableOpacity>

        <View style={styles.indicators}>
          {hotels.map((_, index) => (
            <View
              key={index}
              style={[styles.indicator, index === currentIndex && styles.indicatorActive]}
            />
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.navBtn, currentIndex === hotels.length - 1 && styles.navBtnDisabled]} 
          onPress={handleNext}
          disabled={currentIndex === hotels.length - 1}
        >
          <Ionicons name="chevron-forward" size={24} color={currentIndex === hotels.length - 1 ? '#666' : '#e6e1d9'} />
        </TouchableOpacity>
      </View>

      {/* Alternative Options */}
      <View style={styles.alternativeSection}>
        <Text style={styles.alternativeTitle}>More like this</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.alternativeList}>
          {hotels.filter((_, index) => index !== currentIndex).map((hotel) => {
            const image = hotelImages[hotel.id];
            return (
              <TouchableOpacity
                key={hotel.id}
                style={styles.alternativeCard}
                onPress={() => setCurrentIndex(hotels.indexOf(hotel))}
              >
                {image ? (
                  <Image 
                    source={{ uri: `data:image/jpeg;base64,${image}` }} 
                    style={styles.alternativeImage} 
                    contentFit="cover" 
                  />
                ) : (
                  <View style={[styles.alternativeImage, styles.imagePlaceholder]}>
                    <Ionicons name="image-outline" size={24} color="#9aa0a6" />
                  </View>
                )}
                <Text style={styles.alternativeName} numberOfLines={1}>{hotel.name}</Text>
                <Text style={styles.alternativeType}>{hotel.type} • {hotel.rating}⭐</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.mapBtn}
          onPress={() => {}}
        >
          <Ionicons name="map-outline" size={20} color="#e6e1d9" />
          <Text style={styles.mapBtnText}>View on Map</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.selectBtn}
          onPress={() => handleSelect(currentHotel)}
        >
          <Text style={styles.selectBtnText}>Add to Trip</Text>
        </TouchableOpacity>
      </View>

      {/* Details Modal */}
      <Modal visible={showDetails} animationType="slide" transparent onRequestClose={() => setShowDetails(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.detailsModal}>
            <View style={styles.modalDrag} />
            <Text style={styles.modalTitle}>{currentHotel.name}</Text>
            
            <ScrollView style={styles.modalContent}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.modalDescription}>{currentHotel.description}</Text>
              
              <Text style={styles.sectionTitle}>Amenities</Text>
              <View style={styles.amenitiesGrid}>
                {currentHotel.amenities.map((amenity, index) => (
                  <View key={index} style={styles.amenityChip}>
                    <Text style={styles.amenityText}>{amenity}</Text>
                  </View>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Reviews</Text>
              {currentHotel.reviews.map((review, index) => (
                <View key={index} style={styles.reviewCard}>
                  <View style={styles.reviewHeader}>
                    <Text style={styles.reviewSource}>{review.source}</Text>
                    <View style={styles.reviewRating}>
                      {Array.from({ length: 5 }, (_, i) => (
                        <Ionicons
                          key={i}
                          name={i < review.rating ? 'star' : 'star-outline'}
                          size={12}
                          color="#e6e1d9"
                        />
                      ))}
                    </View>
                  </View>
                  <Text style={styles.reviewText}>{review.text}</Text>
                  <Text style={styles.reviewTravelerType}>- {review.travelerType}</Text>
                </View>
              ))}

              <Text style={styles.sectionTitle}>Nearby Attractions</Text>
              {currentHotel.nearbyAttractions.map((attraction, index) => (
                <View key={index} style={styles.attractionItem}>
                  <Ionicons name="location-outline" size={16} color="#e6e1d9" />
                  <Text style={styles.attractionText}>{attraction}</Text>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowDetails(false)}>
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
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 24, 
    paddingHorizontal: 16, 
    paddingBottom: 16,
    gap: 12 
  },
  headerContent: { flex: 1 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  headerSubtitle: { color: '#9aa0a6', fontSize: 14, marginTop: 2 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { color: '#9aa0a6', fontSize: 16 },
  heroSection: { flex: 1, paddingHorizontal: 16 },
  heroCard: { 
    backgroundColor: '#141414', 
    borderRadius: 20, 
    overflow: 'hidden',
    height: screenHeight * 0.6
  },
  heroImage: { 
    height: '60%', 
    width: '100%' 
  },
  imagePlaceholder: { 
    backgroundColor: '#1f2937', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  heroOverlay: { 
    position: 'absolute', 
    top: 20, 
    left: 16, 
    right: 16 
  },
  whyPickedCard: { 
    backgroundColor: 'rgba(11, 11, 11, 0.9)', 
    borderRadius: 12, 
    padding: 12,
    borderWidth: 1,
    borderColor: '#e6e1d9'
  },
  whyPickedText: { 
    color: '#e6e1d9', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  hotelInfo: { 
    padding: 20, 
    flex: 1 
  },
  hotelHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8 
  },
  hotelName: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600',
    flex: 1,
    marginRight: 12
  },
  hotelLocation: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    marginTop: 2 
  },
  wishlistBtn: { 
    padding: 8 
  },
  hotelMeta: { 
    flexDirection: 'row', 
    gap: 16, 
    marginBottom: 12 
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
    fontSize: 16, 
    fontWeight: '500' 
  },
  description: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 16 
  },
  amenitiesRow: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  amenityChip: { 
    backgroundColor: '#1f1f1f', 
    borderRadius: 16, 
    paddingHorizontal: 12, 
    paddingVertical: 6 
  },
  amenityText: { 
    color: '#e5e7eb', 
    fontSize: 12 
  },
  navigation: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: 16, 
    paddingVertical: 16 
  },
  navBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: '#141414', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  navBtnDisabled: { 
    backgroundColor: '#0f0f0f' 
  },
  indicators: { 
    flexDirection: 'row', 
    gap: 6 
  },
  indicator: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: '#333' 
  },
  indicatorActive: { 
    backgroundColor: '#e6e1d9' 
  },
  alternativeSection: { 
    paddingHorizontal: 16, 
    paddingBottom: 16 
  },
  alternativeTitle: { 
    color: '#e5e7eb', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  alternativeList: { 
    paddingRight: 16, 
    gap: 12 
  },
  alternativeCard: { 
    backgroundColor: '#141414', 
    borderRadius: 12, 
    padding: 12, 
    width: 120 
  },
  alternativeImage: { 
    width: '100%', 
    height: 80, 
    borderRadius: 8, 
    marginBottom: 8 
  },
  alternativeName: { 
    color: '#fff', 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  alternativeType: { 
    color: '#9aa0a6', 
    fontSize: 12 
  },
  bottomActions: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingBottom: 16, 
    gap: 12 
  },
  mapBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#141414', 
    borderRadius: 999, 
    paddingVertical: 16,
    gap: 8 
  },
  mapBtnText: { 
    color: '#e5e7eb', 
    fontSize: 16, 
    fontWeight: '500' 
  },
  selectBtn: { 
    flex: 1, 
    backgroundColor: '#e6e1d9', 
    borderRadius: 999, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingVertical: 16 
  },
  selectBtnText: { 
    color: '#0b0b0b', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  detailsModal: { 
    backgroundColor: '#111', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%'
  },
  modalDrag: { 
    alignSelf: 'center', 
    width: 44, 
    height: 4, 
    backgroundColor: '#333', 
    borderRadius: 2, 
    marginBottom: 16 
  },
  modalTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 16 
  },
  modalContent: { flex: 1, marginBottom: 16 },
  sectionTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 8, 
    marginTop: 16 
  },
  modalDescription: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    lineHeight: 20, 
    marginBottom: 16 
  },
  amenitiesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8, 
    marginBottom: 16 
  },
  reviewCard: { 
    backgroundColor: '#1a1a1a', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 12 
  },
  reviewHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8 
  },
  reviewSource: { 
    color: '#e6e1d9', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  reviewRating: { 
    flexDirection: 'row', 
    gap: 2 
  },
  reviewText: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    lineHeight: 18, 
    marginBottom: 4 
  },
  reviewTravelerType: { 
    color: '#9aa0a6', 
    fontSize: 12, 
    fontStyle: 'italic' 
  },
  attractionItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 8, 
    marginBottom: 8 
  },
  attractionText: { 
    color: '#e5e7eb', 
    fontSize: 14 
  },
  modalCloseBtn: { 
    borderWidth: 1, 
    borderColor: '#2a2e35', 
    borderRadius: 999, 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  modalCloseText: { 
    color: '#e5e7eb', 
    fontWeight: '500' 
  },
});
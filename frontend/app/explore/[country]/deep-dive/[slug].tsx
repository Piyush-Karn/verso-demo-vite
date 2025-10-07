import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getCachedImage } from '../../../../src/services/imageCache';
import { useInterests } from '../../../../src/store/useInterests';

const { height: screenHeight } = Dimensions.get('window');

const EXPERIENCE_DATA: Record<string, Array<{
  id: string;
  title: string;
  description: string;
  location: string;
  rating: number;
  duration: string;
  cost: string;
  imageQuery: string;
  highlights: string[];
  reviews: Array<{ source: string; text: string; rating: number }>;
  nearbyLinks: Array<{ type: string; name: string }>;
}>> = {
  'Beach Paradise': [
    {
      id: '1',
      title: 'Nusa Penida Day Trip',
      description: 'Discover the pristine beaches and dramatic cliffs of Nusa Penida island. Crystal Bay offers world-class snorkeling, while Kelingking Beach provides Instagram-worthy views from towering limestone cliffs.',
      location: 'Nusa Penida, Bali',
      rating: 4.8,
      duration: '8-10 hours',
      cost: '$$$',
      imageQuery: 'Nusa Penida Kelingking Beach cliff view',
      highlights: ['Crystal Bay snorkeling', 'Kelingking viewpoint', 'Angel\'s Billabong', 'Broken Beach'],
      reviews: [
        { source: 'TripAdvisor', text: 'Absolutely stunning! The boat ride was a bit rough but totally worth it for those views.', rating: 5 },
        { source: 'Google', text: 'Kelingking Beach is a must-see. Bring good shoes for the hike down.', rating: 4 }
      ],
      nearbyLinks: [
        { type: 'Restaurant', name: 'Penida Colada Beach Bar' },
        { type: 'Activity', name: 'Manta Ray snorkeling' }
      ]
    },
    {
      id: '2',
      title: 'Uluwatu Sunset Sessions',
      description: 'Experience Bali\'s most famous clifftop temple as the sun sets over the Indian Ocean. Watch traditional Kecak fire dance performances while monkeys play in the temple grounds.',
      location: 'Uluwatu, Bali',
      rating: 4.6,
      duration: '3-4 hours',
      cost: '$$',
      imageQuery: 'Uluwatu temple sunset Kecak dance',
      highlights: ['Clifftop temple', 'Kecak fire dance', 'Sunset views', 'Sacred monkeys'],
      reviews: [
        { source: 'Lonely Planet', text: 'The temple itself is beautiful, but the sunset and cultural show make it truly special.', rating: 5 },
        { source: 'TripAdvisor', text: 'Watch out for the monkeys - they\'ll steal anything shiny!', rating: 4 }
      ],
      nearbyLinks: [
        { type: 'Beach', name: 'Uluwatu Beach' },
        { type: 'Restaurant', name: 'Single Fin Rooftop' }
      ]
    }
  ],
  'Temple Hopping': [
    {
      id: '1',
      title: 'Sacred Tirta Empul Experience',
      description: 'Join locals in ancient purification rituals at this holy spring temple. The crystal-clear spring water is believed to have healing powers, making this a deeply spiritual experience.',
      location: 'Tampaksiring, Bali',
      rating: 4.7,
      duration: '2-3 hours',
      cost: '$',
      imageQuery: 'Tirta Empul holy spring temple ritual',
      highlights: ['Holy spring water', 'Purification ritual', 'Ancient architecture', 'Spiritual experience'],
      reviews: [
        { source: 'Culture Trip', text: 'A profound spiritual experience. The locals are very welcoming to respectful visitors.', rating: 5 },
        { source: 'Google', text: 'Bring a change of clothes if you want to participate in the purification ceremony.', rating: 4 }
      ],
      nearbyLinks: [
        { type: 'Temple', name: 'Gunung Kawi' },
        { type: 'Restaurant', name: 'Bebek Tepi Sawah' }
      ]
    }
  ]
};

export default function ExperienceDeepDive() {
  const { country, slug } = useLocalSearchParams<{ country: string; slug: string }>();
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBottomSheet, setShowBottomSheet] = useState(false);
  const [sheetTab, setSheetTab] = useState<'overview' | 'reviews'>('overview');
  const [experienceImages, setExperienceImages] = useState<Record<string, string>>({});
  const { add, has, toggle } = useInterests();

  const experiences = EXPERIENCE_DATA[String(slug)] || EXPERIENCE_DATA['Beach Paradise'];
  const currentExperience = experiences[currentIndex];

  useEffect(() => {
    // Load experience images
    const loadImages = async () => {
      const imagePromises = experiences.map(async (exp) => {
        const image = await getCachedImage(exp.imageQuery);
        return { id: exp.id, image };
      });
      const results = await Promise.all(imagePromises);
      const imageMap: Record<string, string> = {};
      results.forEach((result) => {
        if (result.image) {
          imageMap[result.id] = result.image;
        }
      });
      setExperienceImages(imageMap);
    };
    loadImages();
  }, [experiences]);

  const handleLike = () => {
    if (currentExperience) {
      toggle({
        id: currentExperience.id,
        title: currentExperience.title,
        type: 'activity',
        country: String(country),
        city: currentExperience.location.split(',')[0],
        image_base64: experienceImages[currentExperience.id],
        cost_indicator: currentExperience.cost
      });
    }
  };

  const nextExperience = () => {
    setCurrentIndex((prev) => (prev + 1) % experiences.length);
  };

  const prevExperience = () => {
    setCurrentIndex((prev) => (prev - 1 + experiences.length) % experiences.length);
  };

  const isLiked = currentExperience ? has(currentExperience.id) : false;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{slug}</Text>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? '#e25555' : '#fff'} />
        </TouchableOpacity>
      </View>

      {/* Experience Cards */}
      <ScrollView 
        pagingEnabled 
        showsVerticalScrollIndicator={false} 
        decelerationRate="fast"
        snapToInterval={screenHeight - 100}
        snapToAlignment="start"
      >
        {experiences.map((experience, index) => (
          <ExperienceCard
            key={experience.id}
            experience={experience}
            image={experienceImages[experience.id]}
            isActive={index === currentIndex}
            onDetailsPress={() => setShowBottomSheet(true)}
          />
        ))}
      </ScrollView>

      {/* Navigation Indicators */}
      <View style={styles.indicators}>
        {experiences.map((_, index) => (
          <View
            key={index}
            style={[styles.indicator, index === currentIndex && styles.indicatorActive]}
          />
        ))}
      </View>

      {/* Bottom Sheet */}
      <Modal visible={showBottomSheet} animationType="slide" transparent onRequestClose={() => setShowBottomSheet(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetDrag} />
            <Text style={styles.sheetTitle}>{currentExperience?.title}</Text>
            
            {/* Tabs */}
            <View style={styles.sheetTabs}>
              <TouchableOpacity onPress={() => setSheetTab('overview')}>
                <Text style={[styles.tabText, sheetTab === 'overview' && styles.tabTextActive]}>Overview</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setSheetTab('reviews')}>
                <Text style={[styles.tabText, sheetTab === 'reviews' && styles.tabTextActive]}>Reviews</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.sheetContent}>
              {sheetTab === 'overview' ? (
                <OverviewTab experience={currentExperience} />
              ) : (
                <ReviewsTab experience={currentExperience} />
              )}
            </ScrollView>

            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowBottomSheet(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Ask Verso Button */}
      <TouchableOpacity style={styles.askBtn}>
        <Ionicons name="chatbubble-ellipses" size={20} color="#0b0b0b" />
        <Text style={styles.askText}>Ask Verso</Text>
      </TouchableOpacity>
    </View>
  );
}

function ExperienceCard({ experience, image, isActive, onDetailsPress }: {
  experience: any;
  image?: string;
  isActive: boolean;
  onDetailsPress: () => void;
}) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: isActive ? 1 : 0.8,
      duration: 300,
      useNativeDriver: true
    }).start();
  }, [isActive]);

  return (
    <Animated.View style={[styles.experienceCard, { transform: [{ scale: anim }] }]}>
      {image ? (
        <Image 
          source={{ uri: `data:image/jpeg;base64,${image}` }} 
          style={styles.experienceImage} 
          contentFit="cover" 
        />
      ) : (
        <View style={[styles.experienceImage, { backgroundColor: '#1f2937', alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ color: '#9aa0a6' }}>Loading...</Text>
        </View>
      )}
      
      <View style={styles.cardOverlay}>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>{experience.title}</Text>
          <Text style={styles.cardLocation}>{experience.location}</Text>
          
          <View style={styles.cardMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={16} color="#e6e1d9" />
              <Text style={styles.metaText}>{experience.rating}</Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={16} color="#e6e1d9" />
              <Text style={styles.metaText}>{experience.duration}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaText}>{experience.cost}</Text>
            </View>
          </View>

          <Text style={styles.cardDescription} numberOfLines={3}>
            {experience.description}
          </Text>
        </View>

        <TouchableOpacity style={styles.detailsBtn} onPress={onDetailsPress}>
          <Text style={styles.detailsBtnText}>View Details</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

function OverviewTab({ experience }: { experience: any }) {
  return (
    <View>
      <Text style={styles.sectionTitle}>About</Text>
      <Text style={styles.sectionText}>{experience?.description}</Text>
      
      <Text style={styles.sectionTitle}>Highlights</Text>
      {experience?.highlights.map((highlight: string, index: number) => (
        <View key={index} style={styles.highlightItem}>
          <Ionicons name="checkmark-circle" size={16} color="#e6e1d9" />
          <Text style={styles.highlightText}>{highlight}</Text>
        </View>
      ))}

      <Text style={styles.sectionTitle}>Nearby</Text>
      {experience?.nearbyLinks.map((link: any, index: number) => (
        <View key={index} style={styles.nearbyItem}>
          <Text style={styles.nearbyType}>{link.type}</Text>
          <Text style={styles.nearbyName}>{link.name}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.bookBtn}>
        <Text style={styles.bookBtnText}>Book Experience</Text>
      </TouchableOpacity>
    </View>
  );
}

function ReviewsTab({ experience }: { experience: any }) {
  return (
    <View>
      {experience?.reviews.map((review: any, index: number) => (
        <View key={index} style={styles.reviewItem}>
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
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingTop: 24, 
    paddingHorizontal: 16, 
    paddingBottom: 12,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'rgba(11, 11, 11, 0.8)'
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '600' },
  experienceCard: { 
    height: screenHeight - 100,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 80
  },
  experienceImage: { width: '100%', height: '100%', position: 'absolute' },
  cardOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
    padding: 20
  },
  cardContent: { marginBottom: 16 },
  cardTitle: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 4 },
  cardLocation: { color: '#e5e7eb', fontSize: 16, marginBottom: 12 },
  cardMeta: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: '#e5e7eb', fontSize: 14 },
  cardDescription: { color: '#e5e7eb', fontSize: 16, lineHeight: 24 },
  detailsBtn: { 
    backgroundColor: '#e6e1d9',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center'
  },
  detailsBtnText: { color: '#0b0b0b', fontSize: 16, fontWeight: '600' },
  indicators: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    gap: 6, 
    paddingVertical: 16,
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0
  },
  indicator: { 
    width: 6, 
    height: 6, 
    borderRadius: 3, 
    backgroundColor: 'rgba(255,255,255,0.3)' 
  },
  indicatorActive: { backgroundColor: '#e6e1d9' },
  askBtn: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#e6e1d9',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6
  },
  askText: { color: '#0b0b0b', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { 
    backgroundColor: '#111', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%'
  },
  sheetDrag: { 
    alignSelf: 'center', 
    width: 44, 
    height: 4, 
    backgroundColor: '#333', 
    borderRadius: 2, 
    marginBottom: 16 
  },
  sheetTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 16 },
  sheetTabs: { flexDirection: 'row', gap: 24, marginBottom: 16 },
  tabText: { color: '#9aa0a6', fontSize: 16 },
  tabTextActive: { color: '#e6e1d9', fontWeight: '600' },
  sheetContent: { flex: 1, marginBottom: 16 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8, marginTop: 16 },
  sectionText: { color: '#e5e7eb', fontSize: 14, lineHeight: 20, marginBottom: 16 },
  highlightItem: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  highlightText: { color: '#e5e7eb', fontSize: 14 },
  nearbyItem: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f1f'
  },
  nearbyType: { color: '#9aa0a6', fontSize: 12 },
  nearbyName: { color: '#e5e7eb', fontSize: 14 },
  bookBtn: { 
    backgroundColor: '#e6e1d9',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20
  },
  bookBtnText: { color: '#0b0b0b', fontSize: 16, fontWeight: '600' },
  reviewItem: { marginBottom: 16 },
  reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  reviewSource: { color: '#e6e1d9', fontSize: 14, fontWeight: '600' },
  reviewRating: { flexDirection: 'row', gap: 2 },
  reviewText: { color: '#e5e7eb', fontSize: 14, lineHeight: 20 },
  closeBtn: { 
    borderWidth: 1, 
    borderColor: '#2a2e35', 
    borderRadius: 999, 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  closeBtnText: { color: '#e5e7eb', fontWeight: '500' },
});
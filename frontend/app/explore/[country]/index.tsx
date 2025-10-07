import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getCachedImage } from '../../../src/services/imageCache';
import Skeleton from '../../../src/components/Skeleton';

const COUNTRY_DATA: Record<string, {
  flag: string;
  tagline: string;
  bestTime: string;
  avgAirfare: string;
  visaEase: string;
  experiences: Array<{
    id: string;
    title: string;
    type: 'theme' | 'city';
    season: string;
    cost: string;
    crowd: string;
    imageQuery: string;
    isHidden?: boolean;
  }>;
  seasonGuide: Array<{
    month: string;
    weather: string;
    emoji: string;
    description: string;
  }>;
}> = {
  'Bali': {
    flag: '🇮🇩',
    tagline: 'Island of the Gods',
    bestTime: 'April - September',
    avgAirfare: '$800 - $1200',
    visaEase: 'Visa on Arrival',
    experiences: [
      {
        id: '1',
        title: 'Beach Paradise',
        type: 'theme',
        season: 'Year-round',
        cost: '$$',
        crowd: 'Popular',
        imageQuery: 'Bali beach paradise tropical',
        isHidden: false
      },
      {
        id: '2',
        title: 'Temple Hopping',
        type: 'theme',
        season: 'Dry Season',
        cost: '$',
        crowd: 'Moderate',
        imageQuery: 'Bali temples cultural heritage',
        isHidden: true
      },
      {
        id: '3',
        title: 'Ubud Rice Terraces',
        type: 'city',
        season: 'April-Oct',
        cost: '$$',
        crowd: 'Busy',
        imageQuery: 'Ubud rice terraces green landscape',
        isHidden: false
      },
      {
        id: '4',
        title: 'Canggu Surf Scene',
        type: 'city',
        season: 'May-Sep', 
        cost: '$$$',
        crowd: 'Very Popular',
        imageQuery: 'Canggu surf beach waves',
        isHidden: true
      },
      {
        id: '5',
        title: 'Seminyak Luxury',
        type: 'city',
        season: 'Year-round',
        cost: '$$$',
        crowd: 'Upscale',
        imageQuery: 'Seminyak luxury resort beach',
        isHidden: false
      }
    ],
    seasonGuide: [
      { month: 'Jan', weather: 'Rainy', emoji: '☔', description: 'Wet season with afternoon showers' },
      { month: 'Feb', weather: 'Rainy', emoji: '☔', description: 'Decreasing rainfall, still humid' },
      { month: 'Mar', weather: 'Transitional', emoji: '⛅', description: 'Shoulder season begins' },
      { month: 'Apr', weather: 'Dry', emoji: '☀️', description: 'Perfect weather starts' }
    ]
  },
  'Japan': {
    flag: '🇯🇵',
    tagline: 'Land of Rising Sun',
    bestTime: 'March - May, Sep - Nov',
    avgAirfare: '$1000 - $1500',
    visaEase: 'Tourist Friendly',
    experiences: [
      {
        id: '1',
        title: 'Cherry Blossom',
        type: 'theme',
        season: 'March-May',
        cost: '$$$',
        crowd: 'Extremely Popular',
        imageQuery: 'Japan cherry blossom sakura',
        isHidden: false
      },
      {
        id: '2',
        title: 'Cultural Heritage',
        type: 'theme', 
        season: 'Year-round',
        cost: '$$',
        crowd: 'Moderate',
        imageQuery: 'Japan temples cultural heritage',
        isHidden: true
      },
      {
        id: '3',
        title: 'Tokyo Modern',
        type: 'city',
        season: 'Year-round',
        cost: '$$$',
        crowd: 'Very Busy',
        imageQuery: 'Tokyo modern cityscape neon',
        isHidden: false
      },
      {
        id: '4',
        title: 'Kyoto Traditional',
        type: 'city',
        season: 'Mar-May, Sep-Nov',
        cost: '$$',
        crowd: 'Popular',
        imageQuery: 'Kyoto traditional temples bamboo',
        isHidden: true
      }
    ],
    seasonGuide: [
      { month: 'Jan', weather: 'Cold', emoji: '❄️', description: 'Winter season, some snow' },
      { month: 'Feb', weather: 'Cold', emoji: '❄️', description: 'Still cold but plum blossoms' },
      { month: 'Mar', weather: 'Mild', emoji: '🌸', description: 'Cherry blossom season begins' },
      { month: 'Apr', weather: 'Pleasant', emoji: '☀️', description: 'Peak cherry blossom season' }
    ]
  },
  'Goa': {
    flag: '🇮🇳',
    tagline: 'Coastal Paradise',
    bestTime: 'November - March',
    avgAirfare: '$600 - $900',
    visaEase: 'e-Visa Required',
    experiences: [
      {
        id: '1',
        title: 'Beach Vibes',
        type: 'theme',
        season: 'Nov-Mar',
        cost: '$',
        crowd: 'Very Popular',
        imageQuery: 'Goa beach paradise coast',
        isHidden: false
      },
      {
        id: '2',
        title: 'Portuguese Heritage',
        type: 'theme',
        season: 'Year-round',
        cost: '$',
        crowd: 'Quiet',
        imageQuery: 'Goa Portuguese colonial heritage',
        isHidden: true
      },
      {
        id: '3',
        title: 'North Goa Party',
        type: 'city',
        season: 'Dec-Feb',
        cost: '$$',
        crowd: 'Very Busy',
        imageQuery: 'North Goa party beach crowd',
        isHidden: false
      },
      {
        id: '4',
        title: 'South Goa Serenity',
        type: 'city',
        season: 'Nov-Mar',
        cost: '$',
        crowd: 'Peaceful',
        imageQuery: 'South Goa peaceful beach palm',
        isHidden: true
      }
    ],
    seasonGuide: [
      { month: 'Jan', weather: 'Perfect', emoji: '☀️', description: 'Peak tourist season' },
      { month: 'Feb', weather: 'Excellent', emoji: '☀️', description: 'Ideal weather continues' },
      { month: 'Mar', weather: 'Good', emoji: '⛅', description: 'Getting warmer but pleasant' },
      { month: 'Apr', weather: 'Hot', emoji: '🌡️', description: 'Heat builds up' }
    ]
  }
};

export default function CountryExplore() {
  const { country } = useLocalSearchParams<{ country: string }>();
  const router = useRouter();
  const [view, setView] = useState<'theme' | 'city'>('theme');
  const [showTouristy, setShowTouristy] = useState(false); // false = hidden gems, true = tourist favorites
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [modalType, setModalType] = useState<'bestTime' | 'airfare' | 'visa'>('bestTime');
  const [experienceImages, setExperienceImages] = useState<Record<string, string>>({});

  const countryData = COUNTRY_DATA[String(country)] || COUNTRY_DATA['Bali'];

  useEffect(() => {
    // Load experience images
    const loadImages = async () => {
      const imagePromises = countryData.experiences.map(async (exp) => {
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
  }, [countryData.experiences]);

  const filteredExperiences = countryData.experiences.filter((exp) => {
    const matchesView = exp.type === view;
    const matchesTouristy = showTouristy ? !exp.isHidden : exp.isHidden;
    return matchesView && matchesTouristy;
  });

  const handleInfoPress = (type: 'bestTime' | 'airfare' | 'visa') => {
    setModalType(type);
    setShowInfoModal(true);
  };

  const handleExperiencePress = (experience: any) => {
    router.push(`/explore/${encodeURIComponent(String(country))}/deep-dive/${encodeURIComponent(experience.title)}`);
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'bestTime':
        return {
          title: 'Best Time to Visit',
          content: countryData.bestTime,
          details: `Peak season offers the best weather and most activities, but expect higher prices and crowds.`
        };
      case 'airfare':
        return {
          title: 'Average Airfare',
          content: countryData.avgAirfare,
          details: 'Prices vary by season and booking time. Book 2-3 months ahead for better deals.'
        };
      case 'visa':
        return {
          title: 'Visa Requirements',
          content: countryData.visaEase,
          details: 'Check latest requirements as policies may change. Processing time varies.'
        };
      default:
        return { title: '', content: '', details: '' };
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#e6e1d9" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.countryTitle}>
            {countryData.flag} {country}
          </Text>
          <Text style={styles.tagline}>{countryData.tagline}</Text>
        </View>
      </View>

      {/* Info Cards */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.infoCards}>
        <TouchableOpacity style={styles.infoCard} onPress={() => handleInfoPress('bestTime')}>
          <Ionicons name="sunny-outline" size={20} color="#e6e1d9" />
          <Text style={styles.infoLabel}>Best Time</Text>
          <Text style={styles.infoValue}>{countryData.bestTime}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard} onPress={() => handleInfoPress('airfare')}>
          <Ionicons name="airplane-outline" size={20} color="#e6e1d9" />
          <Text style={styles.infoLabel}>Avg Airfare</Text>
          <Text style={styles.infoValue}>{countryData.avgAirfare}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.infoCard} onPress={() => handleInfoPress('visa')}>
          <Ionicons name="document-text-outline" size={20} color="#e6e1d9" />
          <Text style={styles.infoLabel}>Visa Ease</Text>
          <Text style={styles.infoValue}>{countryData.visaEase}</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* View Toggle */}
      <View style={styles.viewToggle}>
        <TouchableOpacity 
          style={[styles.toggleBtn, view === 'theme' && styles.toggleBtnActive]}
          onPress={() => setView('theme')}
        >
          <Text style={[styles.toggleText, view === 'theme' && styles.toggleTextActive]}>By Theme</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, view === 'city' && styles.toggleBtnActive]}
          onPress={() => setView('city')}
        >
          <Text style={[styles.toggleText, view === 'city' && styles.toggleTextActive]}>By City</Text>
        </TouchableOpacity>
      </View>

      {/* Hidden Gems Toggle */}
      <View style={styles.gemsToggle}>
        <TouchableOpacity
          style={[styles.gemsBtn, !showTouristy && styles.gemsBtnActive]}
          onPress={() => setShowTouristy(false)}
        >
          <Text style={[styles.gemsText, !showTouristy && styles.gemsTextActive]}>Hidden Gems</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.gemsBtn, showTouristy && styles.gemsBtnActive]}
          onPress={() => setShowTouristy(true)}
        >
          <Text style={[styles.gemsText, showTouristy && styles.gemsTextActive]}>Tourist Favorites</Text>
        </TouchableOpacity>
      </View>

      {/* Experiences */}
      <ScrollView style={styles.experiencesContainer} contentContainerStyle={styles.experiencesContent}>
        {filteredExperiences.map((experience) => {
          const image = experienceImages[experience.id];
          return (
            <TouchableOpacity
              key={experience.id}
              style={styles.experienceCard}
              onPress={() => handleExperiencePress(experience)}
            >
              {image ? (
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${image}` }} 
                  style={styles.experienceImage} 
                  contentFit="cover" 
                />
              ) : (
                <Skeleton style={styles.experienceImage} />
              )}
              <View style={styles.experienceInfo}>
                <Text style={styles.experienceTitle}>{experience.title}</Text>
                <View style={styles.experienceChips}>
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{experience.season}</Text>
                  </View>
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{experience.cost}</Text>
                  </View>
                  <View style={styles.chip}>
                    <Text style={styles.chipText}>{experience.crowd}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Info Modal */}
      <Modal visible={showInfoModal} animationType="slide" transparent onRequestClose={() => setShowInfoModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalDrag} />
            <Text style={styles.modalTitle}>{getModalContent().title}</Text>
            <Text style={styles.modalContent}>{getModalContent().content}</Text>
            <Text style={styles.modalDetails}>{getModalContent().details}</Text>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setShowInfoModal(false)}>
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
  countryTitle: { color: '#fff', fontSize: 24, fontWeight: '700' },
  tagline: { color: '#9aa0a6', fontSize: 14, marginTop: 2 },
  infoCards: { paddingHorizontal: 16, gap: 12, paddingBottom: 16 },
  infoCard: { 
    backgroundColor: '#141414', 
    borderRadius: 12, 
    padding: 16, 
    alignItems: 'center', 
    minWidth: 120 
  },
  infoLabel: { color: '#9aa0a6', fontSize: 12, marginTop: 8 },
  infoValue: { color: '#e6e1d9', fontSize: 14, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  viewToggle: { 
    flexDirection: 'row', 
    marginHorizontal: 16, 
    backgroundColor: '#141414', 
    borderRadius: 8, 
    padding: 4,
    marginBottom: 12 
  },
  toggleBtn: { 
    flex: 1, 
    paddingVertical: 8, 
    alignItems: 'center', 
    borderRadius: 6 
  },
  toggleBtnActive: { backgroundColor: '#e6e1d9' },
  toggleText: { color: '#9aa0a6', fontSize: 14, fontWeight: '500' },
  toggleTextActive: { color: '#0b0b0b' },
  gemsToggle: { 
    flexDirection: 'row', 
    marginHorizontal: 16, 
    gap: 8, 
    marginBottom: 16 
  },
  gemsBtn: { 
    flex: 1, 
    backgroundColor: '#141414', 
    borderRadius: 8, 
    paddingVertical: 10, 
    alignItems: 'center' 
  },
  gemsBtnActive: { backgroundColor: '#2a2e35' },
  gemsText: { color: '#9aa0a6', fontSize: 14, fontWeight: '500' },
  gemsTextActive: { color: '#e6e1d9' },
  experiencesContainer: { flex: 1 },
  experiencesContent: { paddingHorizontal: 16, paddingBottom: 20, gap: 12 },
  experienceCard: { 
    backgroundColor: '#141414', 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  experienceImage: { width: '100%', height: 140 },
  experienceInfo: { padding: 16 },
  experienceTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  experienceChips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  chip: { 
    backgroundColor: '#2a2e35', 
    borderRadius: 16, 
    paddingHorizontal: 8, 
    paddingVertical: 4 
  },
  chipText: { color: '#e5e7eb', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#111', padding: 20, borderTopLeftRadius: 18, borderTopRightRadius: 18 },
  modalDrag: { alignSelf: 'center', width: 44, height: 4, backgroundColor: '#333', borderRadius: 2, marginBottom: 16 },
  modalTitle: { color: '#fff', fontSize: 18, fontWeight: '600', marginBottom: 8 },
  modalContent: { color: '#e6e1d9', fontSize: 16, fontWeight: '500', marginBottom: 8 },
  modalDetails: { color: '#9aa0a6', fontSize: 14, marginBottom: 20 },
  modalCloseBtn: { 
    borderWidth: 1, 
    borderColor: '#2a2e35', 
    borderRadius: 999, 
    alignItems: 'center', 
    paddingVertical: 12 
  },
  modalCloseText: { color: '#e5e7eb', fontWeight: '500' },
});
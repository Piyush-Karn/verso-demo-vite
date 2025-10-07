import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getCachedImage } from '../src/services/imageCache';

type ItineraryDay = {
  day: number;
  date: string;
  city: string;
  activities: Array<{
    id: string;
    title: string;
    type: 'morning' | 'afternoon' | 'evening';
    duration: string;
    description: string;
    cost: string;
    imageQuery: string;
  }>;
  accommodation?: {
    name: string;
    type: string;
    rating: string;
    imageQuery: string;
  };
  transport?: {
    type: 'flight' | 'train' | 'car';
    details: string;
    duration: string;
  };
};

const SAMPLE_ITINERARY: Record<string, ItineraryDay[]> = {
  'Bali': [
    {
      day: 1,
      date: 'Day 1',
      city: 'Seminyak',
      transport: {
        type: 'flight',
        details: 'Arrival at Ngurah Rai International Airport',
        duration: '2 hours'
      },
      activities: [
        {
          id: '1',
          title: 'Beach Club Lunch',
          type: 'afternoon',
          duration: '2-3 hrs',
          description: 'Welcome lunch at a beachfront club with ocean views',
          cost: '$$',
          imageQuery: 'Bali beach club lunch ocean view'
        },
        {
          id: '2',
          title: 'Seminyak Beach Walk',
          type: 'evening',
          duration: '1-2 hrs',
          description: 'Sunset stroll along the famous Seminyak Beach',
          cost: '$',
          imageQuery: 'Seminyak beach sunset walk Bali'
        }
      ],
      accommodation: {
        name: 'Villa Semarapura',
        type: 'Boutique Villa',
        rating: '4.6',
        imageQuery: 'Bali luxury villa pool tropical'
      }
    },
    {
      day: 2,
      date: 'Day 2',
      city: 'Ubud',
      transport: {
        type: 'car',
        details: 'Private transfer to Ubud',
        duration: '1.5 hours'
      },
      activities: [
        {
          id: '3',
          title: 'Rice Terrace Trek',
          type: 'morning',
          duration: '3-4 hrs',
          description: 'Guided walk through Tegallalang rice terraces',
          cost: '$$',
          imageQuery: 'Ubud rice terraces morning trek Bali'
        },
        {
          id: '4',
          title: 'Traditional Spa',
          type: 'afternoon',
          duration: '2 hrs',
          description: 'Balinese massage and wellness treatments',
          cost: '$$$',
          imageQuery: 'Bali traditional spa massage wellness'
        },
        {
          id: '5',
          title: 'Night Market Food Tour',
          type: 'evening',
          duration: '2-3 hrs',
          description: 'Sample local street food and traditional dishes',
          cost: '$$',
          imageQuery: 'Ubud night market food tour Bali'
        }
      ],
      accommodation: {
        name: 'Hanging Gardens of Bali',
        type: 'Luxury Resort',
        rating: '4.8',
        imageQuery: 'Hanging Gardens Bali infinity pool jungle'
      }
    }
  ]
};

export default function TripItinerary() {
  const { country, startDate, endDate, travelers } = useLocalSearchParams<{
    country?: string;
    startDate?: string;
    endDate?: string;
    travelers?: string;
  }>();
  
  const router = useRouter();
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<ItineraryDay | null>(null);
  const [activityImages, setActivityImages] = useState<Record<string, string>>({});
  const [accommodationImages, setAccommodationImages] = useState<Record<string, string>>({});

  useEffect(() => {
    // Simulate AI generation and load itinerary
    const loadItinerary = async () => {
      setLoading(true);
      
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const countryItinerary = SAMPLE_ITINERARY[String(country)] || SAMPLE_ITINERARY['Bali'];
      setItinerary(countryItinerary);
      
      // Load activity images
      const imagePromises = countryItinerary.flatMap(day =>
        day.activities.map(async (activity) => {
          const image = await getCachedImage(activity.imageQuery);
          return { id: activity.id, image };
        })
      );
      
      const accommodationPromises = countryItinerary
        .filter(day => day.accommodation)
        .map(async (day) => {
          const image = await getCachedImage(day.accommodation!.imageQuery);
          return { id: `acc-${day.day}`, image };
        });

      const [activityResults, accommodationResults] = await Promise.all([
        Promise.all(imagePromises),
        Promise.all(accommodationPromises)
      ]);

      const activityImageMap: Record<string, string> = {};
      activityResults.forEach((result) => {
        if (result.image) activityImageMap[result.id] = result.image;
      });

      const accommodationImageMap: Record<string, string> = {};
      accommodationResults.forEach((result) => {
        if (result.image) accommodationImageMap[result.id] = result.image;
      });

      setActivityImages(activityImageMap);
      setAccommodationImages(accommodationImageMap);
      setLoading(false);
    };

    loadItinerary();
  }, [country]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Day 1';
    try {
      return new Date(dateStr).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getTripDuration = () => {
    if (!startDate || !endDate) return '7 days';
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e6e1d9" />
        <Text style={styles.loadingTitle}>Creating your perfect trip...</Text>
        <Text style={styles.loadingSubtitle}>
          Curating experiences from your saved inspirations
        </Text>
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
          <Text style={styles.tripTitle}>Your {country} Trip</Text>
          <Text style={styles.tripMeta}>
            {getTripDuration()} • {travelers?.replace(/^\w/, c => c.toUpperCase())} travel
          </Text>
        </View>
        <TouchableOpacity>
          <Ionicons name="share-outline" size={24} color="#e6e1d9" />
        </TouchableOpacity>
      </View>

      {/* Route Visualization */}
      <View style={styles.routeSection}>
        <Text style={styles.routeTitle}>Your Journey</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.routeContainer}>
            <RouteCity name="Home" isStart />
            {itinerary.map((day, index) => (
              <React.Fragment key={day.day}>
                <RouteLine transport={day.transport} />
                <RouteCity 
                  name={day.city} 
                  day={day.day}
                  isActive={index === 0}
                  onPress={() => setSelectedDay(day)}
                />
              </React.Fragment>
            ))}
            <RouteLine />
            <RouteCity name="Home" isEnd />
          </View>
        </ScrollView>
      </View>

      {/* Itinerary Days */}
      <ScrollView style={styles.itineraryContainer} contentContainerStyle={styles.itineraryContent}>
        {itinerary.map((day) => (
          <DayCard 
            key={day.day} 
            day={day} 
            activityImages={activityImages}
            accommodationImages={accommodationImages}
            onDayPress={() => setSelectedDay(day)}
            onActivityPress={(activity) => {
              // Navigate to activity details or edit
            }}
          />
        ))}
        
        {/* Collaboration Section */}
        <View style={styles.collaborationSection}>
          <Text style={styles.collaborationTitle}>Trip Collaboration</Text>
          <View style={styles.collaboratorRow}>
            <View style={styles.avatarGroup}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>Y</Text>
              </View>
              <View style={[styles.avatar, styles.avatarOverlap]}>
                <Text style={styles.avatarText}>R</Text>
              </View>
            </View>
            <Text style={styles.collaborationText}>You and Ria are planning this trip</Text>
          </View>
          <Text style={styles.collaborationNote}>
            "Added by Ria 2m ago" • "Edited by you 5m ago"
          </Text>
        </View>
      </ScrollView>

      {/* Day Detail Modal */}
      <Modal visible={!!selectedDay} animationType="slide" transparent onRequestClose={() => setSelectedDay(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.dayDetailModal}>
            <View style={styles.modalDrag} />
            <Text style={styles.modalTitle}>
              Day {selectedDay?.day} - {selectedDay?.city}
            </Text>
            <Text style={styles.modalDate}>{selectedDay?.date}</Text>
            
            <ScrollView style={styles.modalContent}>
              {selectedDay?.activities.map((activity, index) => (
                <View key={activity.id} style={styles.activityDetail}>
                  <Text style={styles.activityTime}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Text>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription}>{activity.description}</Text>
                  <View style={styles.activityMeta}>
                    <Text style={styles.activityMetaText}>{activity.duration} • {activity.cost}</Text>
                  </View>
                </View>
              ))}
            </ScrollView>

            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setSelectedDay(null)}>
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => router.push(`/trip/hotels?country=${encodeURIComponent(String(country))}`)}
        >
          <Ionicons name="bed-outline" size={20} color="#e6e1d9" />
          <Text style={styles.actionText}>Hotels</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => router.push(`/trip/cafes?country=${encodeURIComponent(String(country))}`)}
        >
          <Ionicons name="cafe-outline" size={20} color="#e6e1d9" />
          <Text style={styles.actionText}>Cafes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.primaryActionBtn}>
          <Ionicons name="chatbubble-ellipses" size={20} color="#0b0b0b" />
          <Text style={styles.primaryActionText}>Ask Verso</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function RouteCity({ name, day, isStart, isEnd, isActive, onPress }: {
  name: string;
  day?: number;
  isStart?: boolean;
  isEnd?: boolean;
  isActive?: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity 
      style={[styles.routeCity, isActive && styles.routeCityActive]} 
      onPress={onPress}
    >
      <View style={[styles.routeCityPin, isStart && styles.startPin, isEnd && styles.endPin]} />
      <Text style={styles.routeCityName}>{name}</Text>
      {day && <Text style={styles.routeCityDay}>Day {day}</Text>}
    </TouchableOpacity>
  );
}

function RouteLine({ transport }: { transport?: any }) {
  return (
    <View style={styles.routeLine}>
      <View style={styles.routeLineConnector} />
      {transport && (
        <View style={styles.transportInfo}>
          <Ionicons 
            name={transport.type === 'flight' ? 'airplane' : transport.type === 'train' ? 'train' : 'car'} 
            size={12} 
            color="#9aa0a6" 
          />
          <Text style={styles.transportText}>{transport.duration}</Text>
        </View>
      )}
    </View>
  );
}

function DayCard({ day, activityImages, accommodationImages, onDayPress, onActivityPress }: {
  day: ItineraryDay;
  activityImages: Record<string, string>;
  accommodationImages: Record<string, string>;
  onDayPress: () => void;
  onActivityPress: (activity: any) => void;
}) {
  const accommodationImage = accommodationImages[`acc-${day.day}`];

  return (
    <View style={styles.dayCard}>
      <TouchableOpacity style={styles.dayHeader} onPress={onDayPress}>
        <Text style={styles.dayTitle}>Day {day.day} - {day.city}</Text>
        <Text style={styles.dayDate}>{day.date}</Text>
      </TouchableOpacity>

      {/* Transport */}
      {day.transport && (
        <View style={styles.transportCard}>
          <Ionicons 
            name={day.transport.type === 'flight' ? 'airplane' : day.transport.type === 'train' ? 'train' : 'car'} 
            size={16} 
            color="#e6e1d9" 
          />
          <Text style={styles.transportDetails}>{day.transport.details}</Text>
        </View>
      )}

      {/* Activities */}
      <View style={styles.activitiesSection}>
        {day.activities.map((activity) => {
          const image = activityImages[activity.id];
          return (
            <TouchableOpacity 
              key={activity.id} 
              style={styles.activityCard}
              onPress={() => onActivityPress(activity)}
            >
              {image && (
                <Image 
                  source={{ uri: `data:image/jpeg;base64,${image}` }} 
                  style={styles.activityImage} 
                  contentFit="cover" 
                />
              )}
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>{activity.title}</Text>
                <Text style={styles.activityType}>{activity.type} • {activity.duration}</Text>
                <Text style={styles.activityDescription} numberOfLines={2}>
                  {activity.description}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Accommodation */}
      {day.accommodation && (
        <View style={styles.accommodationCard}>
          <Text style={styles.accommodationLabel}>Tonight's stay</Text>
          <View style={styles.accommodationContent}>
            {accommodationImage && (
              <Image 
                source={{ uri: `data:image/jpeg;base64,${accommodationImage}` }} 
                style={styles.accommodationImage} 
                contentFit="cover" 
              />
            )}
            <View style={styles.accommodationDetails}>
              <Text style={styles.accommodationName}>{day.accommodation.name}</Text>
              <Text style={styles.accommodationType}>
                {day.accommodation.type} • ⭐ {day.accommodation.rating}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0b0b0b',
    paddingHorizontal: 32
  },
  loadingTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600', 
    marginTop: 16, 
    textAlign: 'center' 
  },
  loadingSubtitle: { 
    color: '#9aa0a6', 
    fontSize: 14, 
    marginTop: 8, 
    textAlign: 'center' 
  },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingTop: 24, 
    paddingHorizontal: 16, 
    paddingBottom: 16,
    gap: 12 
  },
  headerContent: { flex: 1 },
  tripTitle: { color: '#fff', fontSize: 20, fontWeight: '600' },
  tripMeta: { color: '#9aa0a6', fontSize: 14, marginTop: 2 },
  routeSection: { 
    paddingHorizontal: 16, 
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1f1f1f' 
  },
  routeTitle: { 
    color: '#e5e7eb', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  routeContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 8 
  },
  routeCity: { alignItems: 'center', marginHorizontal: 8 },
  routeCityActive: { opacity: 1 },
  routeCityPin: { 
    width: 12, 
    height: 12, 
    borderRadius: 6, 
    backgroundColor: '#e6e1d9', 
    marginBottom: 8 
  },
  startPin: { backgroundColor: '#4ade80' },
  endPin: { backgroundColor: '#4ade80' },
  routeCityName: { 
    color: '#e5e7eb', 
    fontSize: 12, 
    fontWeight: '500' 
  },
  routeCityDay: { 
    color: '#9aa0a6', 
    fontSize: 10, 
    marginTop: 2 
  },
  routeLine: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginHorizontal: 4 
  },
  routeLineConnector: { 
    width: 40, 
    height: 2, 
    backgroundColor: '#2a2e35' 
  },
  transportInfo: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 4, 
    marginTop: 4 
  },
  transportText: { 
    color: '#9aa0a6', 
    fontSize: 10 
  },
  itineraryContainer: { flex: 1 },
  itineraryContent: { paddingHorizontal: 16, paddingBottom: 100 },
  dayCard: { 
    backgroundColor: '#141414', 
    borderRadius: 16, 
    marginBottom: 16, 
    overflow: 'hidden' 
  },
  dayHeader: { 
    padding: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1f1f1f' 
  },
  dayTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600' 
  },
  dayDate: { 
    color: '#9aa0a6', 
    fontSize: 14, 
    marginTop: 2 
  },
  transportCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    backgroundColor: '#1a1a1a', 
    marginHorizontal: 12, 
    marginTop: 12, 
    borderRadius: 8, 
    gap: 8 
  },
  transportDetails: { 
    color: '#e5e7eb', 
    fontSize: 14 
  },
  activitiesSection: { padding: 16, gap: 12 },
  activityCard: { 
    flexDirection: 'row', 
    backgroundColor: '#1a1a1a', 
    borderRadius: 12, 
    overflow: 'hidden' 
  },
  activityImage: { 
    width: 80, 
    height: 80 
  },
  activityContent: { 
    flex: 1, 
    padding: 12 
  },
  activityTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  activityType: { 
    color: '#e6e1d9', 
    fontSize: 12, 
    marginBottom: 4 
  },
  activityDescription: { 
    color: '#9aa0a6', 
    fontSize: 14, 
    lineHeight: 18 
  },
  accommodationCard: { 
    padding: 16, 
    borderTopWidth: 1, 
    borderTopColor: '#1f1f1f' 
  },
  accommodationLabel: { 
    color: '#9aa0a6', 
    fontSize: 12, 
    marginBottom: 8 
  },
  accommodationContent: { 
    flexDirection: 'row', 
    gap: 12 
  },
  accommodationImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8 
  },
  accommodationDetails: { flex: 1 },
  accommodationName: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  accommodationType: { 
    color: '#e5e7eb', 
    fontSize: 14 
  },
  collaborationSection: { 
    backgroundColor: '#141414', 
    borderRadius: 16, 
    padding: 16, 
    marginTop: 8 
  },
  collaborationTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  collaboratorRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  avatarGroup: { 
    flexDirection: 'row', 
    marginRight: 12 
  },
  avatar: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: '#e6e1d9', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  avatarOverlap: { 
    marginLeft: -8, 
    backgroundColor: '#a855f7' 
  },
  avatarText: { 
    color: '#0b0b0b', 
    fontSize: 14, 
    fontWeight: '600' 
  },
  collaborationText: { 
    color: '#e5e7eb', 
    fontSize: 14 
  },
  collaborationNote: { 
    color: '#9aa0a6', 
    fontSize: 12, 
    fontStyle: 'italic' 
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.5)', 
    justifyContent: 'flex-end' 
  },
  dayDetailModal: { 
    backgroundColor: '#111', 
    borderTopLeftRadius: 20, 
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '70%'
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
    marginBottom: 4 
  },
  modalDate: { 
    color: '#9aa0a6', 
    fontSize: 14, 
    marginBottom: 16 
  },
  modalContent: { flex: 1, marginBottom: 16 },
  activityDetail: { 
    marginBottom: 16, 
    paddingBottom: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#1f1f1f' 
  },
  activityTime: { 
    color: '#e6e1d9', 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 4 
  },
  activityMetaText: { 
    color: '#9aa0a6', 
    fontSize: 12 
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
  bottomActions: { 
    position: 'absolute', 
    bottom: 16, 
    left: 16, 
    right: 16, 
    flexDirection: 'row', 
    gap: 8, 
    backgroundColor: 'rgba(11, 11, 11, 0.95)', 
    paddingTop: 16 
  },
  actionBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#141414', 
    borderRadius: 999, 
    paddingVertical: 12,
    gap: 6 
  },
  actionText: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    fontWeight: '500' 
  },
  primaryActionBtn: { 
    flex: 1, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#e6e1d9', 
    borderRadius: 999, 
    paddingVertical: 12,
    gap: 6 
  },
  primaryActionText: { 
    color: '#0b0b0b', 
    fontSize: 14, 
    fontWeight: '600' 
  },
});
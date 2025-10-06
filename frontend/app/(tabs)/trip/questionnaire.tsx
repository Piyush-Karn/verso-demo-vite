import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Modal, ImageBackground, Animated } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import DateTimePicker from '@react-native-community/datetimepicker';
import { getCachedImage } from '../../../src/services/imageCache';

type StepType = 'location' | 'dates' | 'travelers' | 'preferences' | 'review';

const TRAVELER_OPTIONS = [
  { id: 'solo', label: 'Solo', icon: 'person', description: 'Just me' },
  { id: 'couple', label: 'Couple', icon: 'people', description: '2 people' },
  { id: 'friends', label: 'Friends', icon: 'people-circle', description: '3-6 people' },
  { id: 'family', label: 'Family', icon: 'home', description: 'Family trip' },
];

const STAY_PREFERENCES = ['Hotel', 'Boutique', 'Airbnb', 'Resort', 'Hostel'];
const CUISINE_PREFERENCES = ['Local cuisine', 'Vegetarian', 'Vegan', 'Street food', 'Fine dining', 'Casual dining'];
const FLIGHT_PREFERENCES = ['Direct flights', 'Budget friendly', 'Flexible timing', 'Premium seats'];

export default function TripQuestionnaire() {
  const { country } = useLocalSearchParams<{ country?: string }>();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<StepType>('location');
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  
  // Form data
  const [selectedCountry, setSelectedCountry] = useState(country || 'Bali');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const [isFlexible, setIsFlexible] = useState(false);
  const [travelerType, setTravelerType] = useState('solo');
  const [stayPrefs, setStayPrefs] = useState<string[]>([]);
  const [withKids, setWithKids] = useState(false);
  const [cuisinePrefs, setCuisinePrefs] = useState<string[]>([]);
  const [flightPrefs, setFlightPrefs] = useState<string[]>([]);
  
  // UI state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // Animation
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Load background image based on selected country
    const loadBackground = async () => {
      try {
        const query = `${selectedCountry} travel destination blurred background`;
        const image = await getCachedImage(query);
        setBackgroundImage(image);
      } catch (e) {
        console.error('Failed to load background:', e);
      }
    };
    loadBackground();
  }, [selectedCountry]);

  useEffect(() => {
    // Animate step transition
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, [currentStep]);

  const resetAnimation = () => {
    slideAnim.setValue(0);
  };

  const nextStep = () => {
    resetAnimation();
    const steps: StepType[] = ['location', 'dates', 'travelers', 'preferences', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    resetAnimation();
    const steps: StepType[] = ['location', 'dates', 'travelers', 'preferences', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      setIsGenerating(false);
      router.push(`/(tabs)/trip/itinerary?country=${encodeURIComponent(selectedCountry)}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&travelers=${travelerType}`);
    }, 3000);
  };

  const toggleArrayItem = (array: string[], setArray: (arr: string[]) => void, item: string) => {
    if (array.includes(item)) {
      setArray(array.filter(i => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'location': return 'Where would you like to go?';
      case 'dates': return 'When are you traveling?';
      case 'travelers': return 'Who\'s joining you?';
      case 'preferences': return 'A few more details...';
      case 'review': return 'Ready to create your trip?';
      default: return '';
    }
  };

  const getStepDescription = () => {
    switch (currentStep) {
      case 'location': return 'We\'ve pre-selected based on your collections';
      case 'dates': return 'Choose your travel dates or let us know if you\'re flexible';
      case 'travelers': return 'This helps us suggest the right activities and accommodations';
      case 'preferences': return 'These are optional but help us personalize your trip';
      case 'review': return 'Let\'s build your trip together';
      default: return '';
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'location':
        return (
          <View style={styles.stepContent}>
            <View style={styles.locationCard}>
              <Text style={styles.locationName}>{selectedCountry}</Text>
              <Text style={styles.locationNote}>Auto-picked from your collections</Text>
              <TouchableOpacity style={styles.changeLocation}>
                <Text style={styles.changeLocationText}>Change destination</Text>
              </TouchableOpacity>
            </View>
          </View>
        );

      case 'dates':
        return (
          <View style={styles.stepContent}>
            <View style={styles.dateSection}>
              <TouchableOpacity style={styles.dateCard} onPress={() => setShowStartDatePicker(true)}>
                <Text style={styles.dateLabel}>Start Date</Text>
                <Text style={styles.dateValue}>{startDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.dateCard} onPress={() => setShowEndDatePicker(true)}>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>{endDate.toLocaleDateString()}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity 
              style={styles.flexibleToggle} 
              onPress={() => setIsFlexible(!isFlexible)}
            >
              <Ionicons 
                name={isFlexible ? 'checkbox' : 'square-outline'} 
                size={20} 
                color="#e6e1d9" 
              />
              <Text style={styles.flexibleText}>I'm flexible by ±3 days</Text>
            </TouchableOpacity>
          </View>
        );

      case 'travelers':
        return (
          <View style={styles.stepContent}>
            <View style={styles.travelersGrid}>
              {TRAVELER_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.travelerCard,
                    travelerType === option.id && styles.travelerCardActive
                  ]}
                  onPress={() => setTravelerType(option.id)}
                >
                  <Ionicons 
                    name={option.icon as any} 
                    size={32} 
                    color={travelerType === option.id ? '#0b0b0b' : '#e6e1d9'} 
                  />
                  <Text style={[
                    styles.travelerLabel,
                    travelerType === option.id && styles.travelerLabelActive
                  ]}>
                    {option.label}
                  </Text>
                  <Text style={[
                    styles.travelerDescription,
                    travelerType === option.id && styles.travelerDescriptionActive
                  ]}>
                    {option.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'preferences':
        return (
          <View style={styles.stepContent}>
            <TouchableOpacity 
              style={styles.preferencesToggle}
              onPress={() => setShowPreferences(!showPreferences)}
            >
              <Text style={styles.preferencesLabel}>Customize preferences</Text>
              <Ionicons 
                name={showPreferences ? 'chevron-up' : 'chevron-down'} 
                size={20} 
                color="#e6e1d9" 
              />
            </TouchableOpacity>

            {showPreferences && (
              <View style={styles.preferencesContent}>
                <PreferenceSection
                  title="Stay preferences"
                  options={STAY_PREFERENCES}
                  selected={stayPrefs}
                  onToggle={(item) => toggleArrayItem(stayPrefs, setStayPrefs, item)}
                />
                
                <TouchableOpacity 
                  style={styles.kidsToggle}
                  onPress={() => setWithKids(!withKids)}
                >
                  <Ionicons 
                    name={withKids ? 'checkbox' : 'square-outline'} 
                    size={20} 
                    color="#e6e1d9" 
                  />
                  <Text style={styles.kidsText}>Traveling with kids</Text>
                </TouchableOpacity>

                <PreferenceSection
                  title="Cuisine preferences"
                  options={CUISINE_PREFERENCES}
                  selected={cuisinePrefs}
                  onToggle={(item) => toggleArrayItem(cuisinePrefs, setCuisinePrefs, item)}
                />

                <PreferenceSection
                  title="Flight preferences"
                  options={FLIGHT_PREFERENCES}
                  selected={flightPrefs}
                  onToggle={(item) => toggleArrayItem(flightPrefs, setFlightPrefs, item)}
                />
              </View>
            )}
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContent}>
            <View style={styles.reviewCard}>
              <Text style={styles.reviewTitle}>{selectedCountry} Trip</Text>
              <Text style={styles.reviewDates}>
                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
              </Text>
              <Text style={styles.reviewTravelers}>
                {TRAVELER_OPTIONS.find(t => t.id === travelerType)?.label} trip
              </Text>
              {isFlexible && (
                <Text style={styles.reviewFlexible}>Flexible dates (±3 days)</Text>
              )}
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'location': return selectedCountry.length > 0;
      case 'dates': return startDate && endDate;
      case 'travelers': return travelerType.length > 0;
      case 'preferences': return true; // Optional step
      case 'review': return true;
      default: return false;
    }
  };

  return (
    <View style={styles.container}>
      {backgroundImage && (
        <ImageBackground
          source={{ uri: `data:image/jpeg;base64,${backgroundImage}` }}
          style={styles.backgroundImage}
          blurRadius={8}
        >
          <View style={styles.overlay} />
        </ImageBackground>
      )}

      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          {currentStep !== 'location' && (
            <TouchableOpacity onPress={prevStep}>
              <Ionicons name="arrow-back" size={24} color="#e6e1d9" />
            </TouchableOpacity>
          )}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${((['location', 'dates', 'travelers', 'preferences', 'review'].indexOf(currentStep) + 1) / 5) * 100}%` }
                ]} 
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Step Content */}
        <Animated.View 
          style={[
            styles.stepContainer,
            {
              opacity: slideAnim,
              transform: [{
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                })
              }]
            }
          ]}
        >
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>
          <Text style={styles.stepDescription}>{getStepDescription()}</Text>
          
          {renderStepContent()}
        </Animated.View>

        {/* Continue Button */}
        <View style={styles.buttonContainer}>
          {currentStep === 'review' ? (
            <TouchableOpacity 
              style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
              onPress={handleGenerate}
              disabled={!canProceed() || isGenerating}
            >
              {isGenerating ? (
                <Text style={styles.continueButtonText}>Creating your trip...</Text>
              ) : (
                <Text style={styles.continueButtonText}>Generate Itinerary</Text>
              )}
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.continueButton, !canProceed() && styles.continueButtonDisabled]}
              onPress={nextStep}
              disabled={!canProceed()}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowStartDatePicker(false);
            if (selectedDate) setStartDate(selectedDate);
          }}
        />
      )}

      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowEndDatePicker(false);
            if (selectedDate) setEndDate(selectedDate);
          }}
        />
      )}
    </View>
  );
}

function PreferenceSection({ title, options, selected, onToggle }: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (item: string) => void;
}) {
  return (
    <View style={styles.preferenceSection}>
      <Text style={styles.preferenceSectionTitle}>{title}</Text>
      <View style={styles.preferencesGrid}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.preferenceChip,
              selected.includes(option) && styles.preferenceChipActive
            ]}
            onPress={() => onToggle(option)}
          >
            <Text style={[
              styles.preferenceChipText,
              selected.includes(option) && styles.preferenceChipTextActive
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0b0b0b' },
  backgroundImage: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0 
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(11, 11, 11, 0.85)' 
  },
  content: { 
    flex: 1, 
    paddingTop: 24 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 16,
  },
  progressContainer: { flex: 1 },
  progressBar: {
    height: 3,
    backgroundColor: '#1f1f1f',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#e6e1d9',
    borderRadius: 2,
  },
  skipText: { color: '#9aa0a6', fontSize: 16 },
  stepContainer: { 
    flex: 1, 
    paddingHorizontal: 16 
  },
  stepTitle: { 
    color: '#fff', 
    fontSize: 24, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  stepDescription: { 
    color: '#9aa0a6', 
    fontSize: 16, 
    marginBottom: 32, 
    lineHeight: 22 
  },
  stepContent: { flex: 1 },
  locationCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  locationName: { 
    color: '#fff', 
    fontSize: 28, 
    fontWeight: '700', 
    marginBottom: 8 
  },
  locationNote: { 
    color: '#e6e1d9', 
    fontSize: 14, 
    marginBottom: 16 
  },
  changeLocation: {
    paddingHorizontal: 16, 
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2e35',
  },
  changeLocationText: { color: '#e5e7eb', fontSize: 14 },
  dateSection: { 
    flexDirection: 'row', 
    gap: 12, 
    marginBottom: 24 
  },
  dateCard: {
    flex: 1,
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  dateLabel: { 
    color: '#9aa0a6', 
    fontSize: 12, 
    marginBottom: 8 
  },
  dateValue: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  flexibleToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  flexibleText: { color: '#e5e7eb', fontSize: 16 },
  travelersGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 12 
  },
  travelerCard: {
    width: '48%',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  travelerCardActive: {
    backgroundColor: '#e6e1d9',
    borderColor: '#e6e1d9',
  },
  travelerLabel: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600', 
    marginTop: 12, 
    marginBottom: 4 
  },
  travelerLabelActive: { color: '#0b0b0b' },
  travelerDescription: { 
    color: '#9aa0a6', 
    fontSize: 12, 
    textAlign: 'center' 
  },
  travelerDescriptionActive: { color: '#0b0b0b' },
  preferencesToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  preferencesLabel: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '500' 
  },
  preferencesContent: { gap: 20 },
  preferenceSection: { marginBottom: 16 },
  preferenceSectionTitle: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  preferencesGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    gap: 8 
  },
  preferenceChip: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  preferenceChipActive: {
    backgroundColor: '#e6e1d9',
    borderColor: '#e6e1d9',
  },
  preferenceChipText: { 
    color: '#e5e7eb', 
    fontSize: 12 
  },
  preferenceChipTextActive: { color: '#0b0b0b' },
  kidsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  kidsText: { color: '#e5e7eb', fontSize: 14 },
  reviewCard: {
    backgroundColor: 'rgba(20, 20, 20, 0.9)',
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1f1f1f',
  },
  reviewTitle: { 
    color: '#fff', 
    fontSize: 20, 
    fontWeight: '600', 
    marginBottom: 8 
  },
  reviewDates: { 
    color: '#e6e1d9', 
    fontSize: 16, 
    marginBottom: 4 
  },
  reviewTravelers: { 
    color: '#e5e7eb', 
    fontSize: 14, 
    marginBottom: 4 
  },
  reviewFlexible: { 
    color: '#9aa0a6', 
    fontSize: 12 
  },
  buttonContainer: { 
    padding: 16, 
    paddingBottom: 32 
  },
  continueButton: {
    backgroundColor: '#e6e1d9',
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#2a2e35',
  },
  continueButtonText: { 
    color: '#0b0b0b', 
    fontSize: 16, 
    fontWeight: '600' 
  },
});
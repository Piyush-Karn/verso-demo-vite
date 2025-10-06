import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useInterests } from '../../../src/store/useInterests';

export default function InterestsScreen() {
  const router = useRouter();
  const { items, remove, clear } = useInterests();

  const groupedItems = items.reduce((acc, item) => {
    const key = `${item.country} · ${item.city}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {} as Record<string, typeof items>);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#e6e1d9" />
        </TouchableOpacity>
        <Text style={styles.title}>Your Interests</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={clear}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={48} color="#666" />
          <Text style={styles.emptyTitle}>No interests yet</Text>
          <Text style={styles.emptySubtitle}>Start exploring and save places you'd like to visit!</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          {Object.entries(groupedItems).map(([location, locationItems]) => (
            <View key={location} style={styles.locationGroup}>
              <Text style={styles.locationTitle}>{location}</Text>
              {locationItems.map((item) => (
                <View key={item.id} style={styles.itemCard}>
                  {item.image_base64 && (
                    <Image 
                      source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }} 
                      style={styles.itemImage} 
                      contentFit="cover" 
                    />
                  )}
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemType}>{item.type} • {item.cost_indicator}</Text>
                  </View>
                  <TouchableOpacity onPress={() => remove(item.id)} style={styles.removeBtn}>
                    <Ionicons name="close" size={20} color="#9aa0a6" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
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
    paddingBottom: 16 
  },
  title: { color: '#fff', fontSize: 20, fontWeight: '600' },
  clearText: { color: '#e25555', fontSize: 14 },
  emptyState: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingHorizontal: 32 
  },
  emptyTitle: { 
    color: '#fff', 
    fontSize: 18, 
    fontWeight: '600', 
    marginTop: 16 
  },
  emptySubtitle: { 
    color: '#9aa0a6', 
    fontSize: 14, 
    textAlign: 'center', 
    marginTop: 8 
  },
  content: { paddingHorizontal: 16, paddingBottom: 20 },
  locationGroup: { marginBottom: 24 },
  locationTitle: { 
    color: '#e6e1d9', 
    fontSize: 16, 
    fontWeight: '600', 
    marginBottom: 12 
  },
  itemCard: { 
    flexDirection: 'row', 
    backgroundColor: '#141414', 
    borderRadius: 12, 
    padding: 12, 
    marginBottom: 8,
    alignItems: 'center' 
  },
  itemImage: { 
    width: 60, 
    height: 60, 
    borderRadius: 8, 
    marginRight: 12 
  },
  itemInfo: { flex: 1 },
  itemTitle: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  itemType: { 
    color: '#9aa0a6', 
    fontSize: 14, 
    marginTop: 4 
  },
  removeBtn: { 
    padding: 8 
  },
});
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { addInspiration } from '../src/api/client';

export default function AddInspiration() {
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [type, setType] = useState<'activity' | 'cafe'>('activity');
  const [imageBase64, setImageBase64] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow photo library access.');
      return;
    }
    const res = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.7 });
    if (!res.canceled && res.assets?.[0]?.base64) {
      setImageBase64(res.assets[0].base64);
    }
  };

  const onSubmit = async () => {
    if (!url || !country || !city) {
      Alert.alert('Missing fields', 'URL, Country and City are required.');
      return;
    }
    try {
      await addInspiration({
        url,
        title,
        image_base64: imageBase64 || undefined,
        country,
        city,
        type,
        theme: [],
        cost_indicator: undefined,
        vibe_notes: undefined,
        added_by: 'demo-user',
      });
      Alert.alert('Saved', 'Inspiration added. Navigate to Organize to see it.');
      setUrl(''); setTitle(''); setCountry(''); setCity(''); setImageBase64(null);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to save');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Add Inspiration</Text>
        <TextInput style={styles.input} placeholder="Paste link (Instagram, TikTok, etc.)" placeholderTextColor="#9aa0a6" value={url} onChangeText={setUrl} />
        <TextInput style={styles.input} placeholder="Title (optional)" placeholderTextColor="#9aa0a6" value={title} onChangeText={setTitle} />
        <TextInput style={styles.input} placeholder="Country" placeholderTextColor="#9aa0a6" value={country} onChangeText={setCountry} />
        <TextInput style={styles.input} placeholder="City" placeholderTextColor="#9aa0a6" value={city} onChangeText={setCity} />

        <View style={styles.toggleRow}>
          <TouchableOpacity onPress={() => setType('activity')}><Text style={type === 'activity' ? styles.toggleActive : styles.toggle}>Activity</Text></TouchableOpacity>
          <TouchableOpacity onPress={() => setType('cafe')}><Text style={type === 'cafe' ? styles.toggleActive : styles.toggle}>Cafe</Text></TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.upload} onPress={pickImage}>
          <Text style={styles.uploadText}>{imageBase64 ? 'Change Image' : 'Upload Image (optional)'}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.save} onPress={onSubmit}>
          <Text style={styles.saveText}>Save Inspiration</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: '#0b0b0b', padding: 16 },
  title: { color: '#fff', fontSize: 20, fontWeight: '600', marginBottom: 12 },
  input: { backgroundColor: '#141414', color: '#fff', borderRadius: 12, paddingHorizontal: 14, height: 48, marginBottom: 10, borderWidth: 1, borderColor: '#2a2e35' },
  toggleRow: { flexDirection: 'row', gap: 16, marginBottom: 12 },
  toggle: { color: '#9aa0a6' },
  toggleActive: { color: '#fff', fontWeight: '600', textDecorationLine: 'underline' },
  upload: { borderWidth: 1, borderColor: '#e6e1d9', borderRadius: 999, paddingVertical: 12, alignItems: 'center', marginBottom: 16 },
  uploadText: { color: '#e6e1d9', fontWeight: '600' },
  save: { backgroundColor: '#e6e1d9', height: 52, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#0b0b0b', fontWeight: '700' },
});
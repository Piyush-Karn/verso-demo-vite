import React from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { HERO_TRAVEL } from '../src/assets/imagesBase64';

export default function Landing() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: `data:image/png;base64,${HERO_TRAVEL}` }}
        style={styles.bg}
        imageStyle={{ opacity: 0.9 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.centerWrap}>
            <Text style={styles.logo}>VERSO</Text>
            <Text style={styles.title}>Your Travel Inspirations, Organized</Text>
            <Text style={styles.subtitle}>
              Collaborate with friends. Share reels, videos, or blogs from Instagram, WhatsApp, TikTok, YouTube —
              and we’ll neatly organize everything into one shared trip plan.
            </Text>
          </View>
        </SafeAreaView>
        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.cta} onPress={() => router.push('/(tabs)/organize')}>
            <Text style={styles.ctaText}>Start Organizing</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  bg: { flex: 1, justifyContent: 'space-between' },
  centerWrap: { paddingHorizontal: 24, alignItems: 'center', marginTop: 64, gap: 12 },
  logo: { color: '#fff', fontSize: 24, letterSpacing: 8, marginBottom: 4, fontWeight: '700' },
  title: { color: '#fff', fontSize: 28, textAlign: 'center', fontWeight: '700', marginTop: 8 },
  subtitle: { color: '#e5e7eb', fontSize: 16, textAlign: 'center', lineHeight: 24, marginTop: 12 },
  ctaWrap: { padding: 24 },
  cta: { backgroundColor: '#e6e1d9', height: 56, borderRadius: 999, alignItems: 'center', justifyContent: 'center' },
  ctaText: { color: '#0b0b0b', fontSize: 16, fontWeight: '700', letterSpacing: 0.5 },
});
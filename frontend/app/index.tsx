import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { HERO_TRAVEL } from '../src/assets/imagesBase64';
import { getCachedImage } from '../src/services/imageCache';

export default function Landing() {
  const router = useRouter();
  const [hero, setHero] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const img = await getCachedImage('mountain sunrise vista');
      if (mounted && img) setHero(img);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const source = hero ? { uri: `data:image/jpeg;base64,${hero}` } : { uri: `data:image/png;base64,${HERO_TRAVEL}` };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={source}
        style={styles.bg}
        imageStyle={{ opacity: 0.92 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.centerWrap}>
            <Text style={styles.logo}>Verso</Text>
            <Text style={styles.title}>Your Travel Inspirations, Organized.</Text>
            <Text style={styles.subtitle}>
              See a place on Instagram, WhatsApp, or TikTok you love? Send it to Verso. We'll beautifully
              organize all your saved spots and help you build your perfect trip, together.
            </Text>
          </View>
        </SafeAreaView>
        <View style={styles.ctaWrap}>
          <TouchableOpacity style={styles.cta} onPress={() => router.push('/auth')}>
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
  centerWrap: { paddingHorizontal: 24, alignItems: 'center', marginTop: 80 },
  logo: { color: '#fff', fontSize: 18, letterSpacing: 3, marginBottom: 16 },
  title: { color: '#fff', fontSize: 28, textAlign: 'center', fontWeight: '600', marginBottom: 12 },
  subtitle: { color: '#e5e7eb', fontSize: 14, textAlign: 'center', lineHeight: 22 },
  ctaWrap: { padding: 24 },
  cta: {
    backgroundColor: '#e6e1d9',
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: { color: '#0b0b0b', fontSize: 16, fontWeight: '600' },
});
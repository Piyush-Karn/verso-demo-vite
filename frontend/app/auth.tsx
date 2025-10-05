import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../src/store/useAuth';
import { THUMB_JAPAN } from '../src/assets/imagesBase64';
import { getCachedImage } from '../src/services/imageCache';

export default function AuthScreen() {
  const router = useRouter();
  const { signInDummy } = useAuth();
  const [email, setEmail] = useState('');
  const [bg, setBg] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const img = (await getCachedImage('Tokyo neon street night')) || (await getCachedImage('Bali Uluwatu cliff sunset')) || null;
      if (mounted && img) setBg(img);
    })();
    return () => { mounted = false; };
  }, []);

  const onEmailContinue = () => {
    const value = email.trim() || 'demo@verso.app';
    signInDummy(value);
    router.replace('/organize');
  };

  const source = bg ? { uri: `data:image/jpeg;base64,${bg}` } : { uri: `data:image/png;base64,${THUMB_JAPAN}` };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ImageBackground source={source} style={styles.container} imageStyle={{ opacity: 0.65 }}>
        <View style={styles.overlay} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Welcome to Verso</Text>
          <Text style={styles.body}>Sign in to see your organized collections and start planning.</Text>

          <TouchableOpacity style={[styles.btn, styles.btnDisabled]} activeOpacity={0.7} onPress={() => {}}>
            <Text style={styles.btnText}>Continue with Google (placeholder)</Text>
          </TouchableOpacity>

          <View style={{ height: 12 }} />

          <View style={styles.emailRow}>
            <TextInput
              placeholder="Enter email for demo"
              placeholderTextColor="#9aa0a6"
              style={styles.input}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              returnKeyType="done"
              onSubmitEditing={onEmailContinue}
            />
            <TouchableOpacity style={styles.emailCta} onPress={onEmailContinue}>
              <Text style={styles.emailCtaText}>Continue</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.legal}>By continuing, you agree to our Terms and Privacy Policy.</Text>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.25)' },
  sheet: {
    backgroundColor: 'rgba(16,16,16,0.75)',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  title: { color: '#fff', fontSize: 24, fontWeight: '600', marginBottom: 8 },
  body: { color: '#d1d5db', fontSize: 14, marginBottom: 16 },
  btn: {
    backgroundColor: '#202124',
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: '#e8eaed', fontSize: 16 },
  emailRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  input: {
    flex: 1,
    backgroundColor: '#0f1114',
    color: '#fff',
    borderRadius: 999,
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: '#2a2e35',
  },
  emailCta: {
    backgroundColor: '#e6e1d9',
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  emailCtaText: { color: '#0b0b0b', fontWeight: '600' },
  legal: { color: '#9aa0a6', fontSize: 12, marginTop: 12 },
});
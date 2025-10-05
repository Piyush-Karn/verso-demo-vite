import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useToast } from '../store/useToast';

export default function ToastHost() {
  const { toasts } = useToast();
  if (toasts.length === 0) return null;
  return (
    <View pointerEvents="none" style={styles.wrap}>
      {toasts.map((t) => (
        <View key={t.id} style={styles.toast}><Text style={styles.text}>{t.message}</Text></View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 24, left: 0, right: 0, alignItems: 'center' },
  toast: { backgroundColor: 'rgba(17,17,17,0.92)', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, marginTop: 8, borderWidth: 1, borderColor: '#2a2e35' },
  text: { color: '#e5e7eb' },
});
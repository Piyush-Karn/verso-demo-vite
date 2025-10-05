import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = { label: string };

export default function Badge({ label }: Props) {
  return (
    <View style={styles.badge}>
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { backgroundColor: '#1f2937', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, marginRight: 8, marginBottom: 8 },
  text: { color: '#e5e7eb', fontSize: 12 },
});
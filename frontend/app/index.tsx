import { useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

export default function RootIndex() {
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      // Small delay to ensure navigation system is ready
      const timer = setTimeout(() => {
        router.replace('/(tabs)/explore');
      }, 100);

      return () => clearTimeout(timer);
    }, [router])
  );

  return (
    <View style={styles.container}>
      <ActivityIndicator color="#e6e1d9" />
      <Text style={styles.text}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#0b0b0b', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  text: { 
    color: '#9aa0a6', 
    marginTop: 12, 
    fontSize: 16 
  }
});
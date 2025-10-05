import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: scheme === 'dark' ? '#000' : '#fff' },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="auth" />
        <Stack.Screen name="organize/index" />
        <Stack.Screen name="organize/[country]" />
        <Stack.Screen name="organize/[country]/[city]" />
        <Stack.Screen name="add" />
      </Stack>
    </GestureHandlerRootView>
  );
}
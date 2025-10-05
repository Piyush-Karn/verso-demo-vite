import React from 'react';
import { Stack } from 'expo-router';
import { useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastHost from '../src/components/ToastHost';

export default function RootLayout() {
  const scheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
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
          <Stack.Screen name="organize/interests" />
          <Stack.Screen name="add" />
        </Stack>
        <ToastHost />
      </View>
    </GestureHandlerRootView>
  );
}
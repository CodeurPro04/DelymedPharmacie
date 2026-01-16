// app/_layout.tsx
import { Stack, router, useSegments } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import { getAuth } from '../lib/storage';

export default function RootLayout() {
  const segments = useSegments();
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await getAuth();
      setIsLoggedIn(loggedIn);
      setCheckingAuth(false);
    };
    checkAuth();
  }, [segments]);

  useEffect(() => {
    if (checkingAuth) return;
    const inAuthGroup = segments[0] === 'auth';
    if (!isLoggedIn && !inAuthGroup) {
      router.replace('/auth/login');
    }
    if (isLoggedIn && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [checkingAuth, isLoggedIn, segments]);

  if (checkingAuth) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <Stack screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.primaryDark,
        headerTitleStyle: {
          fontWeight: '600',
        },
        contentStyle: {
          backgroundColor: Colors.background,
        },
      }}>
        {/* Point d'entrée */}
        <Stack.Screen 
          name="index" 
          options={{ 
            headerShown: false 
          }} 
        />
        
        {/* Tabs principales */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false 
          }} 
        />
        <Stack.Screen
          name="auth"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="(modals)"
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});

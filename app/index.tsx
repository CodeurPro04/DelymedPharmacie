// app/index.tsx
import { useEffect, useState } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Colors from '../constants/Colors';
import { getAuth } from '../lib/storage';

export default function Index() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const loggedIn = await getAuth();
      router.replace(loggedIn ? '/(tabs)' : '/auth/login');
      setReady(true);
    };
    checkAuth();
  }, []);

  if (!ready) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});

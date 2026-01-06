// app/index.tsx
import { Redirect } from 'expo-router';

export default function Index() {
  // Rediriger directement vers le dashboard pour le MVP
  return <Redirect href="/(tabs)" />;
}
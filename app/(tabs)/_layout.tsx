// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: Colors.lightGray,
          height: 60 + insets.bottom,
          paddingBottom: Math.max(insets.bottom, 8),
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 2,
        },
        headerStyle: {
          backgroundColor: Colors.primary,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          fontWeight: '600',
          color: Colors.white,
        },
        headerTintColor: Colors.white,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'home' : 'home-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventaire',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'cube' : 'cube-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      
      <Tabs.Screen
        name="orders"
        options={{
          title: 'Commandes',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'receipt' : 'receipt-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      {/* Scanner Tab
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'barcode' : 'barcode-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />  */}
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Pharmacie',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? 'business' : 'business-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

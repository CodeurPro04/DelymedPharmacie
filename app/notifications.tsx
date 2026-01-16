import React, { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { useFocusEffect } from '@react-navigation/native';
import { getNotifications, NotificationItem } from '../lib/storage';

const iconByType: Record<string, string> = {
  order: 'receipt',
  stock: 'alert',
  payment: 'card',
  delivery: 'cube',
};

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadNotifications = async () => {
        const data = await getNotifications();
        setNotifications(data);
      };
      loadNotifications();
    }, [])
  );

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Restez informé des actions importantes.</Text>

      {notifications.map((item) => (
        <View key={item.id} style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name={iconByType[item.type] as any} size={20} color={Colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardDescription}>{item.description}</Text>
            <Text style={styles.cardTime}>{item.time}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: Colors.darkGray,
    marginBottom: 6,
  },
  cardTime: {
    fontSize: 12,
    color: Colors.gray,
  },
});

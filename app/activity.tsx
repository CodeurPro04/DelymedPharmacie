import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const activities = [
  {
    id: 1,
    icon: 'cart',
    title: 'Commande préparée',
    description: 'Commande #PH-005 prête pour la livraison.',
    time: 'Il y a 15 min',
  },
  {
    id: 2,
    icon: 'cube',
    title: 'Inventaire mis à jour',
    description: 'Ajout de 20 unités de Vitamine C.',
    time: 'Il y a 45 min',
  },
  {
    id: 3,
    icon: 'card',
    title: 'Paiement reçu',
    description: 'Paiement mobile money validé.',
    time: 'Il y a 1h',
  },
];

export default function ActivityScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Activité</Text>
      <Text style={styles.subtitle}>Historique des actions récentes.</Text>

      {activities.map((activity) => (
        <View key={activity.id} style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name={activity.icon as any} size={20} color={Colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{activity.title}</Text>
            <Text style={styles.cardDescription}>{activity.description}</Text>
            <Text style={styles.cardTime}>{activity.time}</Text>
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

import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';
import { router } from 'expo-router';

const steps = [
  {
    id: 1,
    icon: 'cube',
    title: 'Gérez votre inventaire',
    description: 'Ajoutez, modifiez et surveillez vos stocks en temps réel.',
  },
  {
    id: 2,
    icon: 'receipt',
    title: 'Traitez les commandes',
    description: 'Priorisez les commandes urgentes et suivez leur statut.',
  },
  {
    id: 3,
    icon: 'analytics',
    title: 'Analysez vos performances',
    description: 'Suivez les indicateurs clés et améliorez votre service.',
  },
];

export default function TourScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Bienvenue sur Delymed</Text>
      <Text style={styles.subtitle}>
        Voici un rapide tour pour démarrer et exploiter toutes les fonctionnalités.
      </Text>

      {steps.map((step) => (
        <View key={step.id} style={styles.card}>
          <View style={styles.icon}>
            <Ionicons name={step.icon as any} size={22} color={Colors.primary} />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{step.title}</Text>
            <Text style={styles.cardDescription}>{step.description}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.cta} onPress={() => router.back()}>
        <Text style={styles.ctaText}>Commencer maintenant</Text>
        <Ionicons name="arrow-forward" size={18} color={Colors.white} />
      </TouchableOpacity>
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
    lineHeight: 18,
  },
  cta: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  ctaText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
});

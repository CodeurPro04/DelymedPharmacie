import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const metrics = [
  { label: 'Commandes livrées', value: '128', change: '+12%', icon: 'checkmark-circle' },
  { label: 'Temps moyen', value: '18 min', change: '-4%', icon: 'time' },
  { label: 'Taux de rupture', value: '3%', change: '-1%', icon: 'alert' },
];

const chartData = [
  { label: 'Lun', value: 60 },
  { label: 'Mar', value: 75 },
  { label: 'Mer', value: 45 },
  { label: 'Jeu', value: 90 },
  { label: 'Ven', value: 70 },
  { label: 'Sam', value: 50 },
  { label: 'Dim', value: 40 },
];

export default function AnalyticsScreen() {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Analytics</Text>
      <Text style={styles.subtitle}>Vue d’ensemble des performances.</Text>

      <View style={styles.metricGrid}>
        {metrics.map((metric) => (
          <View key={metric.label} style={styles.metricCard}>
            <View style={styles.metricIcon}>
              <Ionicons name={metric.icon as any} size={20} color={Colors.primary} />
            </View>
            <Text style={styles.metricValue}>{metric.value}</Text>
            <Text style={styles.metricLabel}>{metric.label}</Text>
            <Text style={styles.metricChange}>{metric.change}</Text>
          </View>
        ))}
      </View>

      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Commandes sur 7 jours</Text>
        <View style={styles.chart}>
          {chartData.map((item) => (
            <View key={item.label} style={styles.chartItem}>
              <View style={[styles.chartBar, { height: item.value }]} />
              <Text style={styles.chartLabel}>{item.label}</Text>
            </View>
          ))}
        </View>
      </View>
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
  metricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  metricCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  metricIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  metricChange: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 120,
  },
  chartItem: {
    alignItems: 'center',
    flex: 1,
  },
  chartBar: {
    width: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary,
    marginBottom: 6,
  },
  chartLabel: {
    fontSize: 10,
    color: Colors.gray,
  },
});

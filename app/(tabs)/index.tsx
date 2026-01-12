// app/(tabs)/index.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = React.useState(false);

  const stats = [
    { 
      title: "Commandes aujourd'hui", 
      value: '12', 
      icon: 'receipt', 
      color: Colors.primary,
      trend: '+2',
      label: 'vs hier',
      change: 'positive',
    },
    { 
      title: 'À préparer', 
      value: '5', 
      icon: 'time', 
      color: Colors.warning,
      trend: '-1',
      label: 'en attente',
      change: 'neutral',
    },
    { 
      title: 'Stock faible', 
      value: '8', 
      icon: 'alert', 
      color: Colors.error,
      trend: '+3',
      label: 'attention',
      change: 'negative',
    },
    { 
      title: 'Revenus jour', 
      value: '345,000', 
      icon: 'cash', 
      color: Colors.success,
      trend: '+12%',
      label: 'FCFA',
      change: 'positive',
    },
  ];

  const recentActivity = [
    { id: 1, type: 'order', title: 'Nouvelle commande', description: 'Kouassi alex - Paracétamol 500mg', time: '10 min', amount: '5,400 FCFA' },
    { id: 2, type: 'stock', title: 'Stock mis à jour', description: 'Ibuprofène 400mg - 12 unités', time: '30 min', status: 'warning' },
    { id: 3, type: 'payment', title: 'Paiement reçu', description: 'Marie Martin - Carte bancaire', time: '1h', amount: '8,900 FCFA' },
    { id: 4, type: 'delivery', title: 'Commande livrée', description: '#CMD-0456 - Livraison Express', time: '2h', status: 'success' },
  ];

  const performanceMetrics = [
    { label: 'Taux de satisfaction', value: '94%', progress: 94, color: Colors.success },
    { label: 'Commandes traitées', value: '98%', progress: 98, color: Colors.primary },
    { label: 'Temps moyen préparation', value: '15 min', progress: 85, color: Colors.info },
  ];

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  }, []);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return { icon: 'cart', color: Colors.primary };
      case 'stock': return { icon: 'cube', color: Colors.warning };
      case 'payment': return { icon: 'card', color: Colors.success };
      case 'delivery': return { icon: 'checkmark-circle', color: Colors.secondary };
      default: return { icon: 'notifications', color: Colors.gray };
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={Colors.primary}
          colors={[Colors.primary]}
        />
      }
    >
      {/* En-tête élégant */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.greeting}>Bon retour,</Text>
            <Text style={styles.pharmacyName}>Pharmacie Delymed</Text>
            <View style={styles.locationBadge}>
              <Ionicons name="location" size={12} color={Colors.primary} />
              <Text style={styles.locationText}>Abidjan, Marcory</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.notificationContainer}
            onPress={() => router.push('/notifications')}
          >
            <View style={styles.notificationButton}>
              <Ionicons name="notifications" size={22} color={Colors.primaryDark} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationCount}>3</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        
        {/* Date et heure */}
        <View style={styles.dateContainer}>
          <Ionicons name="calendar" size={16} color={Colors.primary} />
          <Text style={styles.dateText}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })} {new Date().getFullYear()}</Text>
          <View style={styles.timeBadge}>
            <Ionicons name="time" size={12} color={Colors.white} />
            <Text style={styles.timeText}>{new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</Text>
          </View>
        </View>
      </View>

      {/* Statistiques en grille améliorée */}
      <View style={styles.statsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Aperçu du jour</Text>
          <TouchableOpacity onPress={() => router.push('/analytics')}>
            <Text style={styles.seeAllText}>Voir détails →</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, GlobalStyles.cardElevated]}>
              <View style={styles.statHeader}>
                <View style={[styles.statIconContainer, { backgroundColor: `${stat.color}15` }]}>
                  <Ionicons name={stat.icon as any} size={20} color={stat.color} />
                </View>
                <View style={[
                  styles.trendBadge,
                  { backgroundColor: stat.change === 'positive' ? Colors.successLight : 
                    stat.change === 'negative' ? Colors.errorLight : Colors.warningLight }
                ]}>
                  <Ionicons 
                    name={stat.change === 'positive' ? 'trending-up' : 
                           stat.change === 'negative' ? 'trending-down' : 'remove'} 
                    size={12} 
                    color={stat.change === 'positive' ? Colors.success : 
                           stat.change === 'negative' ? Colors.error : Colors.warning} 
                  />
                  <Text style={[
                    styles.trendText,
                    { color: stat.change === 'positive' ? Colors.success : 
                            stat.change === 'negative' ? Colors.error : Colors.warning }
                  ]}>
                    {stat.trend}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statCurrency}>{stat.label}</Text>
              <Text style={styles.statTitle}>{stat.title}</Text>
              
              <View style={styles.statFooter}>
                <View style={[styles.progressBar, { backgroundColor: `${stat.color}20` }]}>
                  <View style={[
                    styles.progressFill, 
                    { 
                      width: '75%',
                      backgroundColor: stat.color,
                    }
                  ]} />
                </View>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Activité récente */}
      <View style={styles.activitySection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Activité récente</Text>
          <TouchableOpacity onPress={() => router.push('/activity')}>
            <Text style={styles.seeAllText}>Voir tout →</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.activityList}>
          {recentActivity.map((activity) => {
            const { icon, color } = getActivityIcon(activity.type);
            return (
              <TouchableOpacity 
                key={activity.id} 
                style={[styles.activityItem, GlobalStyles.card]}
                onPress={() => console.log('Activity pressed:', activity.id)}
              >
                <View style={[styles.activityIcon, { backgroundColor: `${color}15` }]}>
                  <Ionicons name={icon as any} size={20} color={color} />
                </View>
                
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription} numberOfLines={1}>
                    {activity.description}
                  </Text>
                </View>
                
                <View style={styles.activityRight}>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                  {activity.amount && (
                    <Text style={styles.activityAmount}>{activity.amount}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Alertes importantes 
      <View style={[styles.alertCard, GlobalStyles.cardElevated]}>
        <View style={styles.alertHeader}>
          <MaterialCommunityIcons name="alert-circle" size={24} color={Colors.warning} />
          <Text style={styles.alertTitle}>Alertes importantes</Text>
        </View>
        
        <View style={styles.alertsList}>
          <View style={styles.alertItem}>
            <View style={[styles.alertIcon, { backgroundColor: Colors.errorLight }]}>
              <Ionicons name="warning" size={16} color={Colors.error} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertItemTitle}>8 médicaments en stock faible</Text>
              <Text style={styles.alertItemText}>Commander rapidement pour éviter la rupture</Text>
            </View>
            <TouchableOpacity 
              style={styles.alertButton}
              onPress={() => router.push('/(tabs)/inventory')}
            >
              <Text style={styles.alertButtonText}>Vérifier</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.alertItem}>
            <View style={[styles.alertIcon, { backgroundColor: Colors.infoLight }]}>
              <Ionicons name="time" size={16} color={Colors.info} />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertItemTitle}>3 commandes en attente</Text>
              <Text style={styles.alertItemText}>À préparer dans les 30 minutes</Text>
            </View>
            <TouchableOpacity 
              style={[styles.alertButton, { backgroundColor: Colors.primary }]}
              onPress={() => router.push('/(tabs)/orders')}
            >
              <Text style={[styles.alertButtonText, { color: Colors.white }]}>Traiter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View> */}

      {/* Message de bienvenue */}
      <View style={[styles.welcomeCard, GlobalStyles.cardElevated]}>
        <View style={styles.welcomeContent}>
          <MaterialCommunityIcons name="pharmacy" size={32} color={Colors.primary} />
          <View style={styles.welcomeText}>
            <Text style={styles.welcomeTitle}>Bienvenue sur Delymed Pharmacie</Text>
            <Text style={styles.welcomeSubtitle}>
              Gérez efficacement votre pharmacie avec nos outils professionnels
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          style={styles.welcomeButton}
          onPress={() => router.push('/tour')}
        >
          <Text style={styles.welcomeButtonText}>Découvrir les fonctionnalités</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.white} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 16,
    color: Colors.gray,
    fontWeight: '500',
  },
  pharmacyName: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginTop: 2,
  },
  locationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 4,
  },
  locationText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  notificationContainer: {
    padding: 8,
  },
  notificationButton: {
    position: 'relative',
    padding: 8,
  },
  notificationBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    color: Colors.darkGray,
    fontWeight: '500',
    flex: 1,
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  timeText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  seeAllText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: (width - 52) / 2,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  trendText: {
    fontSize: 12,
    fontWeight: '700',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 2,
  },
  statCurrency: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
    marginBottom: 8,
  },
  statTitle: {
    fontSize: 13,
    color: Colors.darkGray,
    fontWeight: '500',
    marginBottom: 12,
  },
  statFooter: {
    marginTop: 'auto',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  metricsCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  periodText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  metricsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricItem: {
    flex: 1,
    alignItems: 'center',
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  metricDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 8,
  },
  metricProgress: {
    width: '100%',
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  activitySection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.white,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: 2,
  },
  activityDescription: {
    fontSize: 13,
    color: Colors.gray,
  },
  activityRight: {
    alignItems: 'flex-end',
  },
  activityTime: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 4,
  },
  activityAmount: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  alertCard: {
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  alertHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  alertsList: {
    gap: 12,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.lightGray,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: 2,
  },
  alertItemText: {
    fontSize: 13,
    color: Colors.gray,
  },
  alertButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  welcomeCard: {
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 24,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primaryTransparent,
  },
  welcomeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 16,
  },
  welcomeText: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: Colors.darkGray,
    lineHeight: 20,
  },
  welcomeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  welcomeButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
});
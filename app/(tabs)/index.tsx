import React, { useCallback, useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import { getMedications, getOrders, Order } from '../../lib/storage';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [lowStockCount, setLowStockCount] = useState(0);

  const loadDashboard = useCallback(async () => {
    const [ordersData, medications] = await Promise.all([getOrders(), getMedications()]);
    setOrders(ordersData);
    setLowStockCount(medications.filter((m) => m.stock < m.minStock).length);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadDashboard();
    }, [loadDashboard])
  );

  const pendingCount = useMemo(
    () => orders.filter((o) => o.status === 'pending_pharmacy').length,
    [orders]
  );
  const acceptedCount = useMemo(
    () => orders.filter((o) => o.status === 'accepted').length,
    [orders]
  );
  const preparingCount = useMemo(
    () => orders.filter((o) => o.status === 'preparing').length,
    [orders]
  );
  const readyCount = useMemo(
    () => orders.filter((o) => o.status === 'ready').length,
    [orders]
  );
  const assignedCount = useMemo(
    () => orders.filter((o) => o.status === 'assigned').length,
    [orders]
  );
  const pickedUpCount = useMemo(
    () => orders.filter((o) => o.status === 'picked_up').length,
    [orders]
  );

  const totalRevenue = useMemo(() => {
    const total = orders.reduce((acc, order) => {
      const numeric = Number(order.total.replace(/[^\d]/g, ''));
      return acc + (Number.isNaN(numeric) ? 0 : numeric);
    }, 0);
    return total.toLocaleString('fr-FR');
  }, [orders]);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadDashboard().finally(() => setRefreshing(false));
  }, [loadDashboard]);

  const statusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending_pharmacy':
        return { label: 'En attente', color: Colors.info, bg: Colors.infoLight };
      case 'accepted':
        return { label: 'Acceptee', color: Colors.secondary, bg: Colors.secondaryLight };
      case 'preparing':
        return { label: 'Preparation', color: Colors.warning, bg: Colors.warningLight };
      case 'ready':
        return { label: 'Prete', color: Colors.success, bg: Colors.successLight };
      case 'assigned':
        return { label: 'Assignee', color: Colors.info, bg: Colors.infoLight };
      case 'picked_up':
        return { label: 'Recuperee', color: Colors.secondary, bg: Colors.secondaryLight };
      default:
        return { label: 'Inconnue', color: Colors.gray, bg: Colors.lightGray };
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />
      }
    >
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Bonjour,</Text>
            <Text style={styles.pharmacyName}>Pharmacie Delymed</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={12} color={Colors.primary} />
              <Text style={styles.locationText}>Abidjan, Marcory</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications" size={20} color={Colors.primaryDark} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationCount}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.headerStats}>
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{orders.length}</Text>
            <Text style={styles.headerStatLabel}>Commandes recues</Text>
          </View>
          <View style={styles.headerDivider} />
          <View style={styles.headerStat}>
            <Text style={styles.headerStatValue}>{pendingCount + preparingCount + acceptedCount}</Text>
            <Text style={styles.headerStatLabel}>A traiter</Text>
          </View>
        </View>

        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/inventory')}>
            <Ionicons name="cube" size={16} color={Colors.primary} />
            <Text style={styles.actionText}>Inventaire</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/(tabs)/orders')}>
            <Ionicons name="receipt" size={16} color={Colors.primary} />
            <Text style={styles.actionText}>Commandes</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Indicateurs cles</Text>
        <TouchableOpacity onPress={() => router.push('/analytics')}>
          <Text style={styles.sectionLink}>Voir analytics</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.kpiGrid}>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>A preparer</Text>
          <Text style={styles.kpiValue}>{pendingCount}</Text>
          <Text style={styles.kpiHint}>Commandes recues</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Acceptees</Text>
          <Text style={styles.kpiValue}>{acceptedCount}</Text>
          <Text style={styles.kpiHint}>A valider</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Preparation</Text>
          <Text style={styles.kpiValue}>{preparingCount}</Text>
          <Text style={styles.kpiHint}>En cours</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Pretes</Text>
          <Text style={styles.kpiValue}>{readyCount}</Text>
          <Text style={styles.kpiHint}>En attente d&lsquo;un livreur</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Assignees</Text>
          <Text style={styles.kpiValue}>{assignedCount}</Text>
          <Text style={styles.kpiHint}>Livreur confirme</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Revenus</Text>
          <Text style={styles.kpiValue}>{totalRevenue}</Text>
          <Text style={styles.kpiHint}>FCFA aujourd'hui</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Stock faible</Text>
          <Text style={styles.kpiValue}>{lowStockCount}</Text>
          <Text style={styles.kpiHint}>Produits a verifier</Text>
        </View>
        <View style={styles.kpiCard}>
          <Text style={styles.kpiLabel}>Recuperees</Text>
          <Text style={styles.kpiValue}>{pickedUpCount}</Text>
          <Text style={styles.kpiHint}>Pris en charge livreur</Text>
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Commandes recentes</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/orders')}>
          <Text style={styles.sectionLink}>Voir tout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listCard}>
        {recentOrders.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={32} color={Colors.mediumGray} />
            <Text style={styles.emptyText}>Aucune commande pour le moment.</Text>
          </View>
        ) : (
          recentOrders.map((order) => {
            const badge = statusBadge(order.status);
            return (
              <TouchableOpacity
                key={order.id}
                style={styles.orderRow}
                onPress={() => router.push(`/(modals)/order-details?id=${order.id}`)}
              >
                <View>
                  <Text style={styles.orderId}>#{order.id}</Text>
                  <Text style={styles.orderCustomer}>{order.customer}</Text>
                  <View style={styles.typeBadge}>
                    <Text style={styles.typeBadgeText}>
                      {order.type === 'prescription' ? 'Ordonnance' : 'Liste'}
                    </Text>
                  </View>
                </View>
                <View style={styles.orderRight}>
                  <View style={[styles.statusBadge, { backgroundColor: badge.bg }]}>
                    <Text style={[styles.statusText, { color: badge.color }]}>{badge.label}</Text>
                  </View>
                  <Text style={styles.orderTotal}>{order.total}</Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </View>

      <View style={styles.insightCard}>
        <View style={styles.insightHeader}>
          <Text style={styles.sectionnTitle}>Conseil du jour</Text>
        </View>
        <Text style={styles.insightText}>
          Priorisez les commandes urgentes et anticipez les ruptures avec les alertes stock.
        </Text>
        <TouchableOpacity style={styles.insightButton} onPress={() => router.push('/tour')}>
          <Text style={styles.insightButtonText}>Voir le tour rapide</Text>
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
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  headerCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  pharmacyName: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  locationText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationCount: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
  },
  headerStats: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerStat: {
    flex: 1,
  },
  headerStatValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  headerStatLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  headerDivider: {
    width: 1,
    height: 36,
    backgroundColor: Colors.lightGray,
    marginHorizontal: 16,
  },
  quickActions: {
    marginTop: 18,
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  sectionnTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.white,
  },
  sectionLink: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  kpiCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  kpiLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginBottom: 6,
  },
  kpiValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  kpiHint: {
    fontSize: 11,
    color: Colors.gray,
  },
  listCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  orderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  orderId: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  orderCustomer: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  typeBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  orderRight: {
    alignItems: 'flex-end',
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  orderTotal: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: Colors.gray,
  },
  insightCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: 18,
    padding: 18,
  },
  insightHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  insightText: {
    color: Colors.white,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  insightButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  insightButtonText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: '600',
  },
  driverRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  driverRowLast: {
    borderBottomWidth: 0,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  driverStatus: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  driverPill: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  driverPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
});

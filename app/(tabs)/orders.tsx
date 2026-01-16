import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getOrders, Order } from '../../lib/storage';

export default function PharmacyOrdersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = useCallback(async () => {
    const data = await getOrders();
    setOrders(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, [loadOrders])
  );

  const filters = useMemo(
    () => [
      { id: 'all', label: 'Toutes', count: orders.length },
      {
        id: 'pending_pharmacy',
        label: 'En attente',
        count: orders.filter((o) => o.status === 'pending_pharmacy').length,
      },
      {
        id: 'accepted',
        label: 'Acceptees',
        count: orders.filter((o) => o.status === 'accepted').length,
      },
      {
        id: 'preparing',
        label: 'En preparation',
        count: orders.filter((o) => o.status === 'preparing').length,
      },
      { id: 'ready', label: 'Pretes', count: orders.filter((o) => o.status === 'ready').length },
      {
        id: 'assigned',
        label: 'Assignees',
        count: orders.filter((o) => o.status === 'assigned').length,
      },
      {
        id: 'picked_up',
        label: 'Recuperees',
        count: orders.filter((o) => o.status === 'picked_up').length,
      },
      { id: 'urgent', label: 'Urgentes', count: orders.filter((o) => o.isUrgent).length },
    ],
    [orders]
  );

  const filteredOrders = useMemo(() => {
    if (filter === 'all') return orders;
    if (filter === 'urgent') return orders.filter((order) => order.isUrgent);
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders().finally(() => setRefreshing(false));
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ready':
        return { color: '#10B981', label: 'Prete', icon: 'checkmark-circle' };
      case 'preparing':
        return { color: '#F59E0B', label: 'En preparation', icon: 'sync' };
      case 'accepted':
        return { color: '#6366F1', label: 'Acceptee', icon: 'checkmark' };
      case 'pending_pharmacy':
        return { color: '#3B82F6', label: 'En attente', icon: 'time' };
      case 'assigned':
        return { color: '#8B5CF6', label: 'Assignee', icon: 'person' };
      case 'picked_up':
        return { color: '#8B5CF6', label: 'Recuperee', icon: 'bag-check' };
      default:
        return { color: '#6B7280', label: 'Inconnue', icon: 'help-circle' };
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const statusConfig = getStatusConfig(item.status);

    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/(modals)/order-details?id=${item.id}`)}
        activeOpacity={0.7}
      >
        <View style={styles.orderHeader}>
          <View style={styles.orderHeaderLeft}>
            <Text style={styles.orderId}>#{item.id}</Text>
            <Text style={styles.orderTime}>{item.time}</Text>
          </View>

          {item.isUrgent && (
            <View style={styles.urgentBadge}>
              <Ionicons name="flash" size={14} color="#fff" />
            </View>
          )}
        </View>

        <Text style={styles.customerName}>{item.customer}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="cube-outline" size={14} color="#6B7280" />
            <Text style={styles.infoText}>{item.items} articles</Text>
          </View>

          <View style={styles.separator} />

          <View style={styles.infoItem}>
            <Ionicons name={statusConfig.icon as any} size={14} color={statusConfig.color} />
            <Text style={[styles.infoText, { color: statusConfig.color }]}>
              {statusConfig.label}
            </Text>
          </View>
        </View>

        <View style={styles.typeRow}>
          <View style={[styles.typeBadge, item.type === 'prescription' && styles.typeBadgePrescription]}>
            <Text
              style={[
                styles.typeText,
                item.type === 'prescription' && styles.typeTextPrescription,
              ]}
            >
              {item.type === 'prescription' ? 'Ordonnance' : 'Liste'}
            </Text>
          </View>
          <View style={styles.badgeRow}>
            {item.status === 'assigned' && (
              <View style={styles.assignedBadge}>
                <Ionicons name="person" size={12} color="#fff" />
                <Text style={styles.assignedBadgeText}>Livreur assigne</Text>
              </View>
            )}
            {item.isUrgent && <Text style={styles.urgentText}>Urgent</Text>}
          </View>
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.orderTotal}>{item.total}</Text>
          <View style={styles.arrowButton}>
            <Ionicons name="chevron-forward" size={18} color="#9CA3AF" />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Commandes</Text>
          <Text style={styles.subtitle}>{filteredOrders.length} commande(s)</Text>
        </View>
        <View style={styles.newOrderButtonPlaceholder} />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="time-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {orders.filter((o) => o.status === 'pending_pharmacy').length}
            </Text>
            <Text style={styles.statLabel}>En attente</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
            <Ionicons name="sync-outline" size={20} color="#F59E0B" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {orders.filter((o) => o.status === 'preparing').length}
            </Text>
            <Text style={styles.statLabel}>Preparation</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {orders.filter((o) => o.status === 'ready').length}
            </Text>
            <Text style={styles.statLabel}>Pretes</Text>
          </View>
        </View>
      </View>

      <View style={styles.filtersSection}>
        <Text style={styles.sectionLabel}>Filtrer</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersContent}>
          {filters.map((filterItem) => {
            const isActive = filter === filterItem.id;
            return (
              <TouchableOpacity
                key={filterItem.id}
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setFilter(filterItem.id)}
                activeOpacity={0.7}
              >
                <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                  {filterItem.label}
                </Text>
                <View style={[styles.filterBadge, isActive && styles.filterBadgeActive]}>
                  <Text style={[styles.filterBadgeText, isActive && styles.filterBadgeTextActive]}>
                    {filterItem.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3B82F6" />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>
              {filter !== 'all'
                ? `Aucune commande ${filters.find((f) => f.id === filter)?.label.toLowerCase()}`
                : 'Creez votre premiere commande'}
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  newOrderButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  newOrderButtonPlaceholder: {
    width: 44,
    height: 44,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  statBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  filtersSection: {
    paddingTop: 12,
    paddingBottom: 16,
    backgroundColor: '#fff',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filtersContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 12,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F9FAFB',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    marginRight: 10,
    minHeight: 44,
  },
  filterChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  filterChipTextActive: {
    color: '#fff',
  },
  filterBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  filterBadgeTextActive: {
    color: '#fff',
  },
  ordersList: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  orderTime: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  urgentBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EF4444',
    alignItems: 'center',
    justifyContent: 'center',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  separator: {
    width: 1,
    height: 16,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  assignedBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#fff',
  },
  typeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: '#EFF6FF',
  },
  typeBadgePrescription: {
    backgroundColor: '#FEF3C7',
  },
  typeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1D4ED8',
  },
  typeTextPrescription: {
    color: '#B45309',
  },
  urgentText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#EF4444',
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  arrowButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});

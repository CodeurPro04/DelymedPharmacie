// app/(tabs)/orders.tsx
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Colors from '../../constants/Colors';

export default function PharmacyOrdersScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const orders = [
    {
      id: 'PH-001',
      customer: 'Kouassi Jean',
      status: 'pending',
      items: 3,
      total: '45000 FCFA',
      time: '10:30',
      isUrgent: false,
    },
    {
      id: 'PH-002',
      customer: 'Amani Marie',
      status: 'processing',
      items: 2,
      total: '28750 FCFA',
      time: '11:15',
      isUrgent: true,
    },
    {
      id: 'PH-003',
      customer: 'Brou Didier',
      status: 'ready',
      items: 5,
      total: '62300 FCFA',
      time: '11:45',
      isUrgent: false,
    },
    {
      id: 'PH-004',
      customer: 'Koné Fatou',
      status: 'pending',
      items: 1,
      total: '12500 FCFA',
      time: '12:00',
      isUrgent: false,
    },
    {
      id: 'PH-005',
      customer: 'Yao Paul',
      status: 'ready',
      items: 4,
      total: '38900 FCFA',
      time: '12:30',
      isUrgent: true,
    },
  ];

  const filters = [
    { id: 'all', label: 'Toutes', count: 5 },
    { id: 'pending', label: 'En attente', count: 2 },
    { id: 'processing', label: 'En cours', count: 1 },
    { id: 'ready', label: 'Prêtes', count: 2 },
    { id: 'urgent', label: 'Urgentes', count: 2 },
  ];

  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    if (filter === 'urgent') return order.isUrgent;
    return order.status === filter;
  });

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'ready': 
        return { color: '#10B981', label: 'Prête', icon: 'checkmark-circle' };
      case 'processing': 
        return { color: '#F59E0B', label: 'En cours', icon: 'sync' };
      case 'pending': 
        return { color: '#3B82F6', label: 'En attente', icon: 'time' };
      default: 
        return { color: '#6B7280', label: 'Inconnue', icon: 'help-circle' };
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => {
    const statusConfig = getStatusConfig(item.status);
    
    return (
      <TouchableOpacity
        style={styles.orderCard}
        onPress={() => router.push(`/(modals)/order-details?id=${item.id}`)}
        activeOpacity={0.7}
      >
        {/* Header */}
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

        {/* Customer */}
        <Text style={styles.customerName}>{item.customer}</Text>

        {/* Info Row */}
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

        {/* Footer */}
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
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Commandes</Text>
          <Text style={styles.subtitle}>{filteredOrders.length} commande(s)</Text>
        </View>
        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={() => router.push('/(modals)/new-order')}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#DBEAFE' }]}>
            <Ionicons name="time-outline" size={20} color="#3B82F6" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {orders.filter(o => o.status === 'pending').length}
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
              {orders.filter(o => o.status === 'processing').length}
            </Text>
            <Text style={styles.statLabel}>En cours</Text>
          </View>
        </View>

        <View style={styles.statBox}>
          <View style={[styles.statIcon, { backgroundColor: '#D1FAE5' }]}>
            <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
          </View>
          <View style={styles.statContent}>
            <Text style={styles.statValue}>
              {orders.filter(o => o.status === 'ready').length}
            </Text>
            <Text style={styles.statLabel}>Prêtes</Text>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View style={styles.filtersSection}>
        <Text style={styles.sectionLabel}>Filtrer</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filtersContent}
        >
          {filters.map((filterItem) => {
            const isActive = filter === filterItem.id;
            return (
              <TouchableOpacity
                key={filterItem.id}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setFilter(filterItem.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.filterChipText,
                  isActive && styles.filterChipTextActive,
                ]}>
                  {filterItem.label}
                </Text>
                <View style={[
                  styles.filterBadge,
                  isActive && styles.filterBadgeActive,
                ]}>
                  <Text style={[
                    styles.filterBadgeText,
                    isActive && styles.filterBadgeTextActive,
                  ]}>
                    {filterItem.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Orders List */}
      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>
              {filter !== 'all' 
                ? `Aucune commande ${filters.find(f => f.id === filter)?.label.toLowerCase()}`
                : 'Créez votre première commande'}
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
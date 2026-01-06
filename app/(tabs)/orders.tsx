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
import { GlobalStyles } from '../../constants/Styles';

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
  ];

  const filters = [
    { id: 'all', label: 'Toutes', icon: 'list' },
    { id: 'pending', label: 'En attente', icon: 'time' },
    { id: 'processing', label: 'En cours', icon: 'sync' },
    { id: 'ready', label: 'Prêtes', icon: 'checkmark-circle' },
    { id: 'urgent', label: 'Urgentes', icon: 'flash' },
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return Colors.success;
      case 'processing': return Colors.warning;
      case 'pending': return Colors.info;
      default: return Colors.gray;
    }
  };

  const renderOrderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[styles.orderCard, GlobalStyles.card]}
      onPress={() => router.push(`/(modals)/order-details?id=${item.id}`)}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(item.status)}20` }]}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status === 'ready' ? 'Prête' : 
             item.status === 'processing' ? 'En cours' : 'En attente'}
          </Text>
        </View>
      </View>
      
      <Text style={styles.customerName}>{item.customer}</Text>
      
      <View style={styles.orderDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="cube-outline" size={16} color={Colors.gray} />
          <Text style={styles.detailText}>{item.items} articles</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={Colors.gray} />
          <Text style={styles.detailText}>{item.time}</Text>
        </View>
      </View>
      
      <View style={styles.orderFooter}>
        <Text style={styles.orderTotal}>{item.total}</Text>
        {item.isUrgent && (
          <View style={styles.urgentBadge}>
            <Ionicons name="flash" size={12} color={Colors.white} />
            <Text style={styles.urgentText}>Urgent</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Commandes</Text>
        <TouchableOpacity
          style={styles.newOrderButton}
          onPress={() => router.push('/(modals)/new-order')}
        >
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {filters.map((filterItem) => (
          <TouchableOpacity
            key={filterItem.id}
            style={[
              styles.filterButton,
              filter === filterItem.id && styles.filterButtonActive,
            ]}
            onPress={() => setFilter(filterItem.id)}
          >
            <Ionicons
              name={filterItem.icon as any}
              size={20}
              color={filter === filterItem.id ? Colors.primary : Colors.gray}
            />
            <Text style={[
              styles.filterText,
              filter === filterItem.id && styles.filterTextActive,
            ]}>
              {filterItem.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.ordersList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={Colors.mediumGray} />
            <Text style={styles.emptyTitle}>Aucune commande</Text>
            <Text style={styles.emptyText}>
              {filter !== 'all' 
                ? `Aucune commande ${filters.find(f => f.id === filter)?.label.toLowerCase()}`
                : 'Créez votre première commande'}
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  newOrderButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersScroll: {
    marginVertical: 12,
  },
  filtersContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  filterButtonActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryTransparent,
  },
  filterText: {
    fontSize: 14,
    color: Colors.gray,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.primary,
  },
  ordersList: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  orderCard: {
    marginBottom: 12,
    padding: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGray,
    marginBottom: 12,
  },
  orderDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: Colors.gray,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  urgentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  urgentText: {
    fontSize: 12,
    color: Colors.white,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.darkGray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
});
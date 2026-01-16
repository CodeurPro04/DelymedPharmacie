import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Button from '../../components/common/Button';
import Colors from '../../constants/Colors';
import { addNotification, getOrders, saveOrders, Order, OrderStatus } from '../../lib/storage';

export default function OrderDetailsModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      const orders = await getOrders();
      const found = orders.find((item) => item.id === id);
      if (!found) {
        Alert.alert('Commande introuvable', "Cette commande n'existe plus.");
        router.back();
        return;
      }
      setOrder(found);
    };
    loadOrder();
  }, [id]);

  const updateStatus = async (status: OrderStatus, extra?: Partial<Order>) => {
    if (!order) return;
    const orders = await getOrders();
    const updated = orders.map((item) =>
      item.id === order.id ? { ...item, status, ...extra } : item
    );
    await saveOrders(updated);
    setOrder({ ...order, status, ...extra });
    if (status === 'ready') {
      await addNotification({
        id: `notif-${Date.now()}`,
        title: 'Commande prête',
        description: `Commande ${order.id} prête pour collecte livreur.`,
        time: "A l'instant",
        type: 'delivery',
        createdAt: new Date().toISOString(),
      });
    }
  };

  const generatePickupCode = () => String(Math.floor(100000 + Math.random() * 900000));
  const pickupExpiry = () => new Date(Date.now() + 60 * 60 * 1000).toISOString();

  if (!order) {
    return (
      <View style={styles.loader}>
        <Text style={styles.loaderText}>Chargement...</Text>
      </View>
    );
  }

  const timeline = [
    { label: 'Creee', status: 'created' },
    { label: 'Recue', status: 'pending_pharmacy' },
    { label: 'Acceptee', status: 'accepted' },
    { label: 'En preparation', status: 'preparing' },
    { label: 'Prete', status: 'ready' },
    { label: 'Assignee', status: 'assigned' },
    { label: 'Recuperee', status: 'picked_up' },
    { label: 'Livree', status: 'delivered' },
  ];

  const getStatusIndex = (status: OrderStatus) =>
    timeline.findIndex((step) => step.status === status);

  const statusIndex = getStatusIndex(order.status);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Commande {order.id}</Text>
      <Text style={styles.subtitle}>
        Client : {order.customer} - {order.type === 'prescription' ? 'Ordonnance' : 'Liste'}
      </Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{order.customerEmail || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Telephone</Text>
          <Text style={styles.value}>{order.customerPhone || '-'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Statut</Text>
          <Text style={styles.value}>{statusLabel(order.status)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Articles</Text>
          <Text style={styles.value}>{order.items}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Total</Text>
          <Text style={styles.value}>{order.total}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Heure</Text>
          <Text style={styles.value}>{order.time}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Urgence</Text>
          <Text style={styles.value}>{order.isUrgent ? 'Oui' : 'Non'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Type</Text>
          <Text style={styles.value}>
            {order.type === 'prescription' ? 'Ordonnance' : 'Liste medicaments'}
          </Text>
        </View>
        {order.pickupCode && (
          <View style={styles.row}>
            <Text style={styles.label}>Code de retrait</Text>
            <Text style={styles.value}>{order.pickupCode}</Text>
          </View>
        )}
        {order.pickupCodeExpiresAt && (
          <View style={styles.row}>
            <Text style={styles.label}>Expiration OTP</Text>
            <Text style={styles.value}>
              {new Date(order.pickupCodeExpiresAt).toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </View>
        )}
      </View>

      {order.type === 'prescription' && (
        <View style={styles.prescriptionCard}>
          <Text style={styles.prescriptionTitle}>Ordonnance</Text>
          <View style={styles.prescriptionPreview}>
            <Text style={styles.prescriptionPlaceholder}>
              {order.prescriptionImage ? 'Ordonnance jointe' : 'Aucune ordonnance'}
            </Text>
          </View>
        </View>
      )}

      <View style={styles.timelineCard}>
        <Text style={styles.sectionTitle}>Suivi de la commande</Text>
        {timeline.map((step, index) => {
          const isCompleted = index <= statusIndex;
          return (
            <View key={step.status} style={styles.timelineRow}>
              <View
                style={[
                  styles.timelineDot,
                  { backgroundColor: isCompleted ? Colors.primary : Colors.lightGray },
                ]}
              />
              <Text style={[styles.timelineLabel, isCompleted && styles.timelineLabelActive]}>
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>

      <View style={styles.actions}>
        {order.status === 'pending_pharmacy' && (
          <Button title="Accepter la commande" onPress={() => updateStatus('accepted')} />
        )}
        {order.status === 'accepted' && (
          <Button title="Commencer la preparation" onPress={() => updateStatus('preparing')} />
        )}
        {order.status === 'preparing' && (
          <Button
            title="Marquer prete"
            onPress={() =>
              updateStatus('ready', {
                pickupCode: order.pickupCode || generatePickupCode(),
                pickupCodeExpiresAt: pickupExpiry(),
              })
            }
          />
        )}
        {order.status === 'ready' && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              En attente d'un livreur. Le livreur acceptera la course et recuperera avec le code.
            </Text>
          </View>
        )}
        {order.status === 'assigned' && (
          <View style={styles.assignedSection}>
            <View style={styles.assignedCard}>
              <Text style={styles.assignedTitle}>Livreur assigne</Text>
              <Text style={styles.assignedValue}>{order.assignedDriverId || 'DRV-001'}</Text>
              <Text style={styles.assignedHint}>Code de retrait requis</Text>
              <Text style={styles.assignedCode}>{order.pickupCode}</Text>
            </View>
            <Button
              title="Confirmer recuperation"
              onPress={() => updateStatus('picked_up', { pickedUpAt: new Date().toISOString() })}
            />
          </View>
        )}
        {order.status === 'picked_up' && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>
              Commande remise au livreur. La livraison sera validee cote livraison.
            </Text>
          </View>
        )}
        {order.status === 'delivered' && (
          <View style={styles.infoBanner}>
            <Text style={styles.infoBannerText}>Commande livree au client.</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

  const statusLabel = (status: OrderStatus) => {
    switch (status) {
    case 'created':
      return 'Creee';
    case 'pending_pharmacy':
      return 'En attente';
    case 'accepted':
      return 'Acceptee';
    case 'preparing':
      return 'En preparation';
    case 'ready':
      return 'Prete';
    case 'assigned':
      return 'Assignee';
    case 'picked_up':
      return 'Recuperee';
    case 'delivered':
      return 'Livree';
    case 'cancelled':
      return 'Annulee';
    default:
      return 'Inconnue';
    }
  };

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
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    color: Colors.gray,
  },
  value: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  actions: {
    gap: 12,
  },
  infoBanner: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 12,
  },
  infoBannerText: {
    fontSize: 13,
    color: Colors.primaryDark,
    lineHeight: 18,
    textAlign: 'center',
  },
  assignedSection: {
    gap: 12,
  },
  assignedCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  assignedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 6,
  },
  assignedValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  assignedHint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 8,
  },
  assignedCode: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 6,
    letterSpacing: 2,
  },
  prescriptionCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  prescriptionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  prescriptionPreview: {
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  prescriptionPlaceholder: {
    fontSize: 13,
    color: Colors.gray,
  },
  timelineCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  timelineLabel: {
    fontSize: 13,
    color: Colors.gray,
  },
  timelineLabelActive: {
    color: Colors.primaryDark,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loaderText: {
    color: Colors.gray,
  },
});

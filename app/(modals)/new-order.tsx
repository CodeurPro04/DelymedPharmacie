import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Colors from '../../constants/Colors';
import { getOrders, saveOrders } from '../../lib/storage';

export default function NewOrderModal() {
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState('');
  const [total, setTotal] = useState('');
  const [isUrgent, setIsUrgent] = useState(false);
  const [orderType, setOrderType] = useState<'list' | 'prescription'>('list');
  const [prescriptionImage, setPrescriptionImage] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!customer || !items || !total) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires.');
      return;
    }
    setLoading(true);
    const orders = await getOrders();
    const nextIndex = orders.length + 1;
    const newOrder = {
      id: `PH-${String(nextIndex).padStart(3, '0')}`,
      customer,
      status: 'pending_pharmacy',
      type: orderType,
      items: Number(items),
      total,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isUrgent,
      prescriptionImage,
      createdAt: new Date().toISOString(),
    };
    await saveOrders([newOrder, ...orders]);
    setLoading(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Nouvelle commande</Text>
      <Text style={styles.subtitle}>
        Enregistrez une commande pour la préparer rapidement.
      </Text>

      <View style={styles.card}>
        <View style={styles.segment}>
          <TouchableOpacity
            style={[styles.segmentItem, orderType === 'list' && styles.segmentItemActive]}
            onPress={() => setOrderType('list')}
          >
            <Text style={[styles.segmentText, orderType === 'list' && styles.segmentTextActive]}>
              Liste médicaments
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentItem, orderType === 'prescription' && styles.segmentItemActive]}
            onPress={() => setOrderType('prescription')}
          >
            <Text
              style={[
                styles.segmentText,
                orderType === 'prescription' && styles.segmentTextActive,
              ]}
            >
              Ordonnance photo
            </Text>
          </TouchableOpacity>
        </View>

        <Input
          label="Client"
          value={customer}
          onChangeText={setCustomer}
          placeholder="Nom du client"
        />
        <Input
          label="Nombre d’articles"
          value={items}
          onChangeText={setItems}
          keyboardType="numeric"
        />
        <Input
          label="Total"
          value={total}
          onChangeText={setTotal}
          placeholder="45 000 FCFA"
        />

        {orderType === 'prescription' && (
          <View style={styles.prescriptionCard}>
            <Text style={styles.prescriptionTitle}>Ordonnance</Text>
            <Text style={styles.prescriptionHint}>
              Ajoutez une photo d’ordonnance pour la validation.
            </Text>
            <TouchableOpacity
              style={styles.prescriptionButton}
              onPress={() => setPrescriptionImage('mock://prescription')}
            >
              <Text style={styles.prescriptionButtonText}>
                {prescriptionImage ? 'Ordonnance ajoutée' : 'Ajouter une ordonnance'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Commande urgente</Text>
            <Text style={styles.switchHint}>Prioriser cette commande en préparation.</Text>
          </View>
          <Switch
            value={isUrgent}
            onValueChange={setIsUrgent}
            trackColor={{ false: Colors.mediumGray, true: Colors.primaryLight }}
            thumbColor={isUrgent ? Colors.primary : Colors.white}
          />
        </View>

        <Button
          title={loading ? 'Enregistrement...' : 'Enregistrer'}
          onPress={handleSave}
          loading={loading}
        />
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  segment: {
    flexDirection: 'row',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  segmentItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  segmentItemActive: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '600',
  },
  segmentTextActive: {
    color: Colors.primaryDark,
  },
  prescriptionCard: {
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },
  prescriptionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  prescriptionHint: {
    fontSize: 12,
    color: Colors.darkGray,
    marginBottom: 10,
  },
  prescriptionButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  prescriptionButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  switchHint: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
    maxWidth: 220,
  },
});

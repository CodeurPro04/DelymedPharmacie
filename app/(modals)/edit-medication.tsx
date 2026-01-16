import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Colors from '../../constants/Colors';
import { getMedications, saveMedications } from '../../lib/storage';

export default function EditMedicationModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');
  const [genericName, setGenericName] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [minStock, setMinStock] = useState('');
  const [price, setPrice] = useState('');
  const [manufacturer, setManufacturer] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [barcode, setBarcode] = useState('');
  const [requiresPrescription, setRequiresPrescription] = useState(false);

  useEffect(() => {
    const loadMedication = async () => {
      const medications = await getMedications();
      const medication = medications.find((item) => item.id === id);
      if (!medication) {
        Alert.alert('Introuvable', 'Ce médicament est introuvable.');
        router.back();
        return;
      }
      setName(medication.name);
      setGenericName(medication.genericName || '');
      setCategory(medication.category || '');
      setStock(String(medication.stock));
      setMinStock(String(medication.minStock));
      setPrice(medication.price);
      setManufacturer(medication.manufacturer || '');
      setExpiryDate(medication.expiryDate || '');
      setBarcode(medication.barcode || '');
      setRequiresPrescription(medication.requiresPrescription);
    };
    loadMedication();
  }, [id]);

  const handleSave = async () => {
    if (!name || !stock || !minStock || !price) {
      Alert.alert('Champs requis', 'Veuillez remplir les champs obligatoires.');
      return;
    }
    setLoading(true);
    const medications = await getMedications();
    const updated = medications.map((item) =>
      item.id === id
        ? {
            ...item,
            name,
            genericName,
            category: category || 'autre',
            stock: Number(stock),
            minStock: Number(minStock),
            price,
            manufacturer,
            expiryDate,
            barcode,
            requiresPrescription,
          }
        : item
    );
    await saveMedications(updated);
    setLoading(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Modifier le médicament</Text>
      <Text style={styles.subtitle}>Mettez à jour les informations et le stock.</Text>

      <View style={styles.card}>
        <Input label="Nom du médicament" value={name} onChangeText={setName} />
        <Input
          label="Nom générique"
          value={genericName}
          onChangeText={setGenericName}
        />
        <Input
          label="Catégorie"
          value={category}
          onChangeText={setCategory}
          placeholder="ex: antibiotique"
        />
        <Input
          label="Stock actuel"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
        />
        <Input
          label="Stock minimum"
          value={minStock}
          onChangeText={setMinStock}
          keyboardType="numeric"
        />
        <Input label="Prix" value={price} onChangeText={setPrice} />
        <Input label="Fabricant" value={manufacturer} onChangeText={setManufacturer} />
        <Input
          label="Date d’expiration"
          value={expiryDate}
          onChangeText={setExpiryDate}
          placeholder="2026-01-31"
        />
        <Input
          label="Code-barres"
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="numeric"
        />

        <View style={styles.switchRow}>
          <View>
            <Text style={styles.switchLabel}>Ordonnance requise</Text>
            <Text style={styles.switchHint}>Activer si ce médicament est soumis à prescription.</Text>
          </View>
          <Switch
            value={requiresPrescription}
            onValueChange={setRequiresPrescription}
            trackColor={{ false: Colors.mediumGray, true: Colors.primaryLight }}
            thumbColor={requiresPrescription ? Colors.primary : Colors.white}
          />
        </View>

        <Button
          title={loading ? 'Mise à jour...' : 'Enregistrer'}
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

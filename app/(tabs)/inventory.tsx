// app/(tabs)/inventory.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  RefreshControl,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';

const { width } = Dimensions.get('window');

export default function InventoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [medications, setMedications] = useState([
    {
      id: '1',
      name: 'Paracétamol 500mg',
      genericName: 'Acétaminophène',
      category: 'analgesique',
      stock: 45,
      minStock: 20,
      price: '3500 FCFA',
      requiresPrescription: false,
      barcode: '123456789012',
      manufacturer: 'Laboratoire X',
      expiryDate: '2025-12-31',
    },
    {
      id: '2',
      name: 'Ibuprofène 400mg',
      genericName: '',
      category: 'anti-inflammatoire',
      stock: 12,
      minStock: 15,
      price: '4200 FCFA',
      requiresPrescription: false,
      barcode: '234567890123',
      manufacturer: 'Laboratoire Y',
      expiryDate: '2025-10-15',
    },
    {
      id: '3',
      name: 'Amoxicilline 500mg',
      genericName: '',
      category: 'antibiotique',
      stock: 8,
      minStock: 10,
      price: '7800 FCFA',
      requiresPrescription: true,
      barcode: '345678901234',
      manufacturer: 'Laboratoire Z',
      expiryDate: '2025-09-30',
    },
    {
      id: '4',
      name: 'Vitamine C 1000mg',
      genericName: 'Acide ascorbique',
      category: 'vitamine',
      stock: 32,
      minStock: 15,
      price: '8900 FCFA',
      requiresPrescription: false,
      barcode: '456789012345',
      manufacturer: 'Laboratoire A',
      expiryDate: '2026-03-20',
    },
    {
      id: '5',
      name: 'Oméprazole 20mg',
      genericName: '',
      category: 'gastro',
      stock: 5,
      minStock: 10,
      price: '12500 FCFA',
      requiresPrescription: true,
      barcode: '567890123456',
      manufacturer: 'Laboratoire B',
      expiryDate: '2025-11-15',
    },
    {
      id: '6',
      name: 'Doliprane 1000mg',
      genericName: 'Paracétamol',
      category: 'analgesique',
      stock: 60,
      minStock: 25,
      price: '2800 FCFA',
      requiresPrescription: false,
      barcode: '678901234567',
      manufacturer: 'Sanofi',
      expiryDate: '2026-01-31',
    },
  ]);

  const categories = [
    { id: 'all', label: 'Tous', count: 6 },
    { id: 'analgesique', label: 'Analgésiques', count: 2 },
    { id: 'antibiotique', label: 'Antibiotiques', count: 1 },
    { id: 'vitamine', label: 'Vitamines', count: 1 },
    { id: 'low-stock', label: 'Stock faible', count: 3 },
  ];

  const filteredMedications = medications.filter(med => {
    if (selectedCategory === 'low-stock') {
      return med.stock < med.minStock;
    }
    if (selectedCategory !== 'all' && med.category !== selectedCategory) {
      return false;
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        med.name.toLowerCase().includes(query) ||
        (med.genericName && med.genericName.toLowerCase().includes(query)) ||
        med.manufacturer.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { color: '#EF4444', label: 'Rupture' };
    if (stock < minStock) return { color: '#F59E0B', label: 'Faible' };
    return { color: '#10B981', label: 'Normal' };
  };

  const handleEdit = (medication: any) => {
    router.push(`/(modals)/edit-medication?id=${medication.id}`);
  };

  const handleDelete = (medication: any) => {
    Alert.alert(
      'Supprimer médicament',
      `Êtes-vous sûr de vouloir supprimer "${medication.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            setMedications(prev => prev.filter(m => m.id !== medication.id));
            Alert.alert('Succès', 'Médicament supprimé avec succès');
          },
        },
      ]
    );
  };

  const handleAddMedication = () => {
    router.push('/(modals)/add-medication');
  };

  const renderMedicationItem = ({ item }: { item: any }) => {
    const stockStatus = getStockStatus(item.stock, item.minStock);
    
    return (
      <View style={styles.medicationCard}>
        <View style={styles.cardHeader}>
          <View style={styles.cardHeaderLeft}>
            <Text style={styles.medicationName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.genericName && (
              <Text style={styles.genericName}>{item.genericName}</Text>
            )}
          </View>
          <View style={[styles.stockBadge, { backgroundColor: stockStatus.color }]}>
            <Text style={styles.stockBadgeText}>{item.stock}</Text>
          </View>
        </View>
        
        <View style={styles.cardBody}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={14} color="#6B7280" />
            <Text style={styles.infoText}>{item.manufacturer}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
            <Text style={styles.infoText}>{item.price}</Text>
          </View>
          
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
            <Text style={styles.infoText}>Exp: {item.expiryDate}</Text>
          </View>
        </View>
        
        <View style={styles.cardFooter}>
          <View style={[styles.statusIndicator, { backgroundColor: `${stockStatus.color}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: stockStatus.color }]} />
            <Text style={[styles.statusText, { color: stockStatus.color }]}>
              {stockStatus.label}
            </Text>
          </View>
          
          <View style={styles.cardActions}>
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="pencil-outline" size={18} color="#3B82F6" />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Inventaire</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMedication}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{medications.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={[styles.statBox, styles.statDivider]}>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>
            {medications.filter(m => m.stock < m.minStock).length}
          </Text>
          <Text style={styles.statLabel}>Stock faible</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>
            {medications.filter(m => m.stock === 0).length}
          </Text>
          <Text style={styles.statLabel}>Rupture</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un médicament..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionLabel}>Filtrer par catégorie</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.categoryChipText,
                  isActive && styles.categoryChipTextActive,
                ]}>
                  {category.label}
                </Text>
                <View style={[
                  styles.categoryBadge,
                  isActive && styles.categoryBadgeActive,
                ]}>
                  <Text style={[
                    styles.categoryBadgeText,
                    isActive && styles.categoryBadgeTextActive,
                  ]}>
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* List */}
      <FlatList
        data={filteredMedications}
        renderItem={renderMedicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1500);
            }}
            tintColor="#3B82F6"
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Aucun médicament</Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Aucun résultat trouvé'
                : 'Ajoutez votre premier médicament'
              }
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
  },
  addButton: {
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
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#F3F4F6',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
    marginLeft: 12,
  },
  categoriesSection: {
    paddingTop: 20,
    paddingBottom: 12,
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
  categoriesContent: {
    paddingHorizontal: 20,
    paddingVertical: 4,
  },
  categoryChip: {
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
  categoryChipActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginRight: 8,
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  categoryBadge: {
    minWidth: 24,
    height: 24,
    paddingHorizontal: 8,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
  },
  categoryBadgeTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  medicationCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  genericName: {
    fontSize: 13,
    color: '#6B7280',
  },
  stockBadge: {
    minWidth: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  stockBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  cardBody: {
    gap: 8,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#6B7280',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  },
});
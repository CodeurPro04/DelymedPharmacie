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
  Modal,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';

const { width } = Dimensions.get('window');

export default function InventoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<any>(null);

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
    { id: 'all', label: 'Tous', icon: 'grid', count: 6 },
    { id: 'analgesique', label: 'Analgésiques', icon: 'thermometer', count: 2 },
    { id: 'antibiotique', label: 'Antibiotiques', icon: 'shield', count: 1 },
    { id: 'vitamine', label: 'Vitamines', icon: 'nutrition', count: 1 },
    { id: 'gastro', label: 'Digestif', icon: 'medical', count: 1 },
    { id: 'low-stock', label: 'Stock faible', icon: 'warning', count: 2 },
    { id: 'prescription', label: 'Ordonnance', icon: 'document-text', count: 2 },
  ];

  const filteredMedications = medications.filter(med => {
    // Filtre par catégorie spéciale
    if (selectedCategory === 'low-stock') {
      return med.stock < med.minStock;
    }
    if (selectedCategory === 'prescription') {
      return med.requiresPrescription;
    }
    if (selectedCategory !== 'all' && med.category !== selectedCategory) {
      return false;
    }
    
    // Filtre par recherche
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
    if (stock === 0) return { color: Colors.error, text: 'Rupture', icon: 'close-circle' };
    if (stock < minStock) return { color: Colors.warning, text: 'Stock faible', icon: 'warning' };
    if (stock < minStock * 2) return { color: Colors.info, text: 'Stock moyen', icon: 'alert-circle' };
    return { color: Colors.success, text: 'Stock suffisant', icon: 'checkmark-circle' };
  };

  const handleEdit = (medication: any) => {
    setSelectedMedication(medication);
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

  const handleViewDetails = (medication: any) => {
    setSelectedMedication(medication);
    setShowActionSheet(true);
  };

  const handleAddMedication = () => {
    router.push('/(modals)/add-medication');
  };

  const handleScanBarcode = () => {
    router.push('/(modals)/scan-barcode');
  };

  const handleExport = () => {
    Alert.alert('Export', 'Fonctionnalité d\'export à venir');
  };

  const renderMedicationItem = ({ item }: { item: any }) => {
    const stockStatus = getStockStatus(item.stock, item.minStock);
    const categoryData = categories.find(c => c.id === item.category);
    
    return (
      <TouchableOpacity
        style={[styles.medicationCard, GlobalStyles.cardElevated]}
        onPress={() => handleViewDetails(item)}
      >
        <View style={styles.medicationHeader}>
          <View style={styles.medicationMainInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.medicationName} numberOfLines={1}>
                {item.name}
              </Text>
              {item.requiresPrescription && (
                <View style={styles.prescriptionBadge}>
                  <Ionicons name="document-text" size={12} color={Colors.white} />
                  <Text style={styles.prescriptionText}>Rx</Text>
                </View>
              )}
            </View>
            
            {item.genericName && (
              <Text style={styles.genericName}>{item.genericName}</Text>
            )}
            
            <View style={styles.manufacturerRow}>
              <Ionicons name="business" size={12} color={Colors.gray} />
              <Text style={styles.manufacturerText}>{item.manufacturer}</Text>
            </View>
          </View>
          
          <View style={[styles.stockIndicator, { backgroundColor: `${stockStatus.color}15` }]}>
            <Ionicons name={stockStatus.icon as any} size={16} color={stockStatus.color} />
            <Text style={[styles.stockCount, { color: stockStatus.color }]}>
              {item.stock}
            </Text>
          </View>
        </View>
        
        <View style={styles.medicationDetails}>
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="pricetag" size={14} color={Colors.primary} />
              <Text style={styles.price}>{item.price}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name={categoryData?.icon as any || 'cube'} size={14} color={Colors.gray} />
              <Text style={styles.category}>{categoryData?.label || item.category}</Text>
            </View>
          </View>
          
          <View style={styles.detailRow}>
            <View style={styles.detailItem}>
              <Ionicons name="barcode" size={14} color={Colors.gray} />
              <Text style={styles.barcode}>{item.barcode}</Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="calendar" size={14} color={Colors.gray} />
              <Text style={styles.expiryDate}>Exp: {item.expiryDate}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.editButton]}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil" size={16} color={Colors.primary} />
            <Text style={styles.editButtonText}>Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={16} color={Colors.error} />
            <Text style={styles.deleteButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* En-tête élégant */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Inventaire</Text>
            <Text style={styles.subtitle}>Gestion des médicaments</Text>
          </View>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={handleScanBarcode}
          >
            <Ionicons name="barcode" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Statistiques rapides */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.statsScroll}
        contentContainerStyle={styles.statsContent}
      >
        <View style={[styles.statCard, GlobalStyles.cardElevated]}>
          <View style={[styles.statIcon, { backgroundColor: Colors.primaryLight }]}>
            <Ionicons name="medical" size={24} color={Colors.primary} />
          </View>
          <Text style={styles.statValue}>{medications.length}</Text>
          <Text style={styles.statLabel}>Total médicaments</Text>
        </View>
        
        <View style={[styles.statCard, GlobalStyles.cardElevated]}>
          <View style={[styles.statIcon, { backgroundColor: Colors.warningLight }]}>
            <Ionicons name="warning" size={24} color={Colors.warning} />
          </View>
          <Text style={[styles.statValue, { color: Colors.warning }]}>
            {medications.filter(m => m.stock < m.minStock).length}
          </Text>
          <Text style={styles.statLabel}>Stock faible</Text>
        </View>
        
        <View style={[styles.statCard, GlobalStyles.cardElevated]}>
          <View style={[styles.statIcon, { backgroundColor: Colors.errorLight }]}>
            <Ionicons name="close-circle" size={24} color={Colors.error} />
          </View>
          <Text style={[styles.statValue, { color: Colors.error }]}>
            {medications.filter(m => m.stock === 0).length}
          </Text>
          <Text style={styles.statLabel}>En rupture</Text>
        </View>
        
        <View style={[styles.statCard, GlobalStyles.cardElevated]}>
          <View style={[styles.statIcon, { backgroundColor: Colors.successLight }]}>
            <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
          </View>
          <Text style={[styles.statValue, { color: Colors.success }]}>
            {medications.filter(m => m.stock >= m.minStock * 2).length}
          </Text>
          <Text style={styles.statLabel}>Stock optimal</Text>
        </View>
      </ScrollView>

      {/* Barre de recherche et filtres */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={Colors.primary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom, fabricant..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={Colors.gray}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Ionicons name="close-circle" size={20} color={Colors.gray} />
            </TouchableOpacity>
          )}
        </View>
        
        <View style={styles.filterActions}>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleAddMedication}
          >
            <Ionicons name="add" size={20} color={Colors.primary} />
            <Text style={styles.filterButtonText}>Ajouter</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={handleExport}
          >
            <Ionicons name="download" size={20} color={Colors.primary} />
            <Text style={styles.filterButtonText}>Exporter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Catégories */}
      <View style={styles.categoriesSection}>
        <Text style={styles.sectionTitle}>Catégories</Text>
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
                  styles.categoryCard,
                  isActive && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={[
                  styles.categoryIcon,
                  isActive 
                    ? { backgroundColor: Colors.primary }
                    : { backgroundColor: Colors.lightGray }
                ]}>
                  <Ionicons 
                    name={category.icon as any} 
                    size={18} 
                    color={isActive ? Colors.white : Colors.gray} 
                  />
                </View>
                <Text style={[
                  styles.categoryLabel,
                  isActive && styles.categoryLabelActive,
                ]}>
                  {category.label}
                </Text>
                <Text style={[
                  styles.categoryCount,
                  isActive && styles.categoryCountActive,
                ]}>
                  {category.count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Liste des médicaments */}
      <FlatList
        data={filteredMedications}
        renderItem={renderMedicationItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.medicationsList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              setTimeout(() => setRefreshing(false), 1500);
            }}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons 
              name="pill" 
              size={80} 
              color={Colors.mediumGray} 
            />
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'Aucun résultat' : 'Inventaire vide'}
            </Text>
            <Text style={styles.emptyText}>
              {searchQuery 
                ? 'Aucun médicament ne correspond à votre recherche'
                : 'Commencez par ajouter vos premiers médicaments'
              }
            </Text>
            <TouchableOpacity 
              style={styles.emptyButton}
              onPress={handleAddMedication}
            >
              <Ionicons name="add" size={20} color={Colors.white} />
              <Text style={styles.emptyButtonText}>Ajouter un médicament</Text>
            </TouchableOpacity>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      {/* Bouton flottant pour ajouter */}
      <TouchableOpacity 
        style={styles.fab}
        onPress={handleAddMedication}
      >
        <Ionicons name="add" size={28} color={Colors.white} />
      </TouchableOpacity>
    </View>
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
    paddingTop: 50,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primaryDark,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray,
    marginTop: 4,
  },
  scanButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  statsScroll: {
    marginTop: -20,
    marginBottom: 16,
  },
  statsContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    width: 140,
    padding: 16,
    borderRadius: 16,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
    textAlign: 'center',
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  clearButton: {
    padding: 4,
  },
  filterActions: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primaryLight,
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 12,
  },
  categoriesContent: {
    gap: 10,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 12,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.lightGray,
    width: 100,
  },
  categoryCardActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryTransparent,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.darkGray,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryLabelActive: {
    color: Colors.primary,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.gray,
  },
  categoryCountActive: {
    color: Colors.primaryDark,
  },
  medicationsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  medicationCard: {
    marginBottom: 16,
    padding: 20,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  medicationMainInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primaryDark,
    flex: 1,
  },
  prescriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
    marginLeft: 8,
  },
  prescriptionText: {
    fontSize: 10,
    color: Colors.white,
    fontWeight: '700',
  },
  genericName: {
    fontSize: 14,
    color: Colors.gray,
    fontStyle: 'italic',
    marginBottom: 8,
  },
  manufacturerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  manufacturerText: {
    fontSize: 12,
    color: Colors.gray,
  },
  stockIndicator: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  stockCount: {
    fontSize: 16,
    fontWeight: '800',
  },
  medicationDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  category: {
    fontSize: 14,
    color: Colors.darkGray,
    fontWeight: '500',
  },
  barcode: {
    fontSize: 12,
    color: Colors.gray,
    fontFamily: 'monospace',
  },
  expiryDate: {
    fontSize: 12,
    color: Colors.gray,
    fontWeight: '500',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
  },
  editButton: {
    backgroundColor: Colors.primaryLight,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  deleteButton: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.error,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.darkGray,
    marginTop: 24,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
    marginBottom: 24,
    lineHeight: 24,
  },
  emptyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
  },
  emptyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.white,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    zIndex: 1000,
  },
});
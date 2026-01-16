import React, { useCallback, useMemo, useState } from 'react';
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
} from 'react-native';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { getMedications, saveMedications, Medication } from '../../lib/storage';

export default function InventoryScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [medications, setMedications] = useState<Medication[]>([]);

  const loadMedications = useCallback(async () => {
    const data = await getMedications();
    setMedications(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMedications();
    }, [loadMedications])
  );

  const counts = useMemo(() => {
    const lowStock = medications.filter((m) => m.stock < m.minStock).length;
    const outOfStock = medications.filter((m) => m.stock === 0).length;
    return { total: medications.length, lowStock, outOfStock };
  }, [medications]);

  const categories = useMemo(() => {
    const categoryLabels: Record<string, string> = {
      analgesique: 'Analgésiques',
      antibiotique: 'Antibiotiques',
      vitamine: 'Vitamines',
      gastro: 'Gastro',
      'anti-inflammatoire': 'Anti-inflammatoires',
      autre: 'Autres',
    };

    const tally = medications.reduce<Record<string, number>>((acc, med) => {
      acc[med.category] = (acc[med.category] || 0) + 1;
      return acc;
    }, {});

    const dynamic = Object.keys(tally).map((id) => ({
      id,
      label: categoryLabels[id] || id,
      count: tally[id],
    }));

    return [
      { id: 'all', label: 'Tous', count: medications.length },
      { id: 'low-stock', label: 'Stock faible', count: counts.lowStock },
      ...dynamic,
    ];
  }, [counts.lowStock, medications]);

  const filteredMedications = useMemo(() => {
    return medications.filter((med) => {
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
          (med.manufacturer && med.manufacturer.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [medications, searchQuery, selectedCategory]);

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) return { color: Colors.error, label: 'Rupture' };
    if (stock < minStock) return { color: Colors.warning, label: 'Faible' };
    return { color: Colors.success, label: 'Normal' };
  };

  const handleEdit = (medication: Medication) => {
    router.push(`/(modals)/edit-medication?id=${medication.id}`);
  };

  const handleDelete = (medication: Medication) => {
    Alert.alert(
      'Supprimer médicament',
      `Êtes-vous sûr de vouloir supprimer "${medication.name}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const updated = medications.filter((m) => m.id !== medication.id);
            await saveMedications(updated);
            setMedications(updated);
            Alert.alert('Succès', 'Médicament supprimé avec succès');
          },
        },
      ]
    );
  };

  const handleAddMedication = () => {
    router.push('/(modals)/add-medication');
  };

  const renderMedicationItem = ({ item }: { item: Medication }) => {
    const stockStatus = getStockStatus(item.stock, item.minStock);
    const percent = Math.min(100, Math.round((item.stock / Math.max(item.minStock, 1)) * 100));

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardTitleWrap}>
            <Text style={styles.medName} numberOfLines={1}>
              {item.name}
            </Text>
            {!!item.genericName && (
              <Text style={styles.medGeneric} numberOfLines={1}>
                {item.genericName}
              </Text>
            )}
          </View>
          <View style={styles.stockPill}>
            <Text style={styles.stockPillText}>{item.stock}</Text>
          </View>
        </View>

        <View style={styles.metaRow}>
          {!!item.manufacturer && (
            <View style={styles.metaItem}>
              <Ionicons name="business-outline" size={14} color={Colors.gray} />
              <Text style={styles.metaText}>{item.manufacturer}</Text>
            </View>
          )}
          <View style={styles.metaItem}>
            <Ionicons name="pricetag-outline" size={14} color={Colors.gray} />
            <Text style={styles.metaText}>{item.price}</Text>
          </View>
          {!!item.expiryDate && (
            <View style={styles.metaItem}>
              <Ionicons name="calendar-outline" size={14} color={Colors.gray} />
              <Text style={styles.metaText}>Exp {item.expiryDate}</Text>
            </View>
          )}
        </View>

        <View style={styles.stockRow}>
          <View style={[styles.statusBadge, { backgroundColor: `${stockStatus.color}20` }]}>
            <View style={[styles.statusDot, { backgroundColor: stockStatus.color }]} />
            <Text style={[styles.statusText, { color: stockStatus.color }]}>
              {stockStatus.label}
            </Text>
          </View>
          <Text style={styles.minStockText}>Min {item.minStock}</Text>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${percent}%`, backgroundColor: stockStatus.color },
            ]}
          />
        </View>

        <View style={styles.cardActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleEdit(item)}>
            <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
            <Text style={styles.actionText}>Modifier</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={() => handleDelete(item)}>
            <Ionicons name="trash-outline" size={16} color={Colors.error} />
            <Text style={[styles.actionText, styles.actionDelete]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Inventaire</Text>
          <Text style={styles.subtitle}>Gérez vos stocks en temps réel</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddMedication}>
          <Ionicons name="add" size={24} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.searchCard}>
        <Ionicons name="search" size={20} color={Colors.gray} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un médicament..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Colors.gray}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={Colors.gray} />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>{counts.total}</Text>
          <Text style={styles.statLabel}>Produits</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: Colors.warning }]}>{counts.lowStock}</Text>
          <Text style={styles.statLabel}>Stock faible</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statValue, { color: Colors.error }]}>{counts.outOfStock}</Text>
          <Text style={styles.statLabel}>Ruptures</Text>
        </View>
      </View>

      <View style={styles.categories}>
        <Text style={styles.sectionLabel}>Catégories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
          {categories.map((category) => {
            const isActive = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                  {category.label}
                </Text>
                <View style={[styles.categoryCount, isActive && styles.categoryCountActive]}>
                  <Text style={[styles.categoryCountText, isActive && styles.categoryCountTextActive]}>
                    {category.count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

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
              loadMedications().finally(() => setRefreshing(false));
            }}
            tintColor={Colors.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={56} color={Colors.mediumGray} />
            <Text style={styles.emptyTitle}>Aucun médicament</Text>
            <Text style={styles.emptyText}>
              {searchQuery ? 'Aucun résultat trouvé' : 'Ajoutez votre premier médicament'}
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
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.gray,
    marginTop: 4,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  searchCard: {
    marginHorizontal: 20,
    marginTop: 16,
    backgroundColor: Colors.white,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: Colors.primaryDark,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    shadowColor: Colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  categories: {
    marginTop: 18,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.gray,
    paddingHorizontal: 20,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  categoriesRow: {
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.lightGray,
    marginRight: 10,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.darkGray,
    marginRight: 8,
  },
  categoryTextActive: {
    color: Colors.white,
  },
  categoryCount: {
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
  },
  categoryCountActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  categoryCountText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.gray,
  },
  categoryCountTextActive: {
    color: Colors.white,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    paddingTop: 10,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.lightGray,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitleWrap: {
    flex: 1,
    marginRight: 10,
  },
  medName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  medGeneric: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  stockPill: {
    minWidth: 36,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
  },
  stockPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  metaRow: {
    marginTop: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metaText: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  stockRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
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
  minStockText: {
    fontSize: 12,
    color: Colors.gray,
  },
  progressTrack: {
    marginTop: 10,
    height: 6,
    borderRadius: 999,
    backgroundColor: Colors.lightGray,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
  cardActions: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primary,
  },
  actionDelete: {
    color: Colors.error,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
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
  },
});

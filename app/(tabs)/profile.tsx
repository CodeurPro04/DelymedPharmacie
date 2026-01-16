import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import { GlobalStyles } from '../../constants/Styles';
import { getProfile, setAuth } from '../../lib/storage';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Pharmacie Delymed',
    address: "Rue des Jardins, Plateau, Abidjan, Côte d'Ivoire",
    phone: '+225 01 02 03 04 05',
    email: 'contact@pharmaciedelymed.ci',
    licenseNumber: 'PH-CI-2024-001',
    verified: true,
    memberSince: 'Janvier 2024',
  });

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        const stored = await getProfile();
        setProfile((prev) => ({
          ...prev,
          ...stored,
        }));
      };
      loadProfile();
    }, [])
  );

  const menuItems = [
    {
      title: 'Informations pharmacie',
      icon: 'business',
      items: [
        { icon: 'location', label: 'Adresse', value: profile.address },
        { icon: 'call', label: 'Téléphone', value: profile.phone },
        { icon: 'mail', label: 'Email', value: profile.email },
        { icon: 'document-text', label: 'N° Licence', value: profile.licenseNumber },
      ],
    },
    {
      title: 'Préférences',
      icon: 'settings',
      items: [
        {
          type: 'toggle',
          icon: 'notifications',
          label: 'Notifications',
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          type: 'toggle',
          icon: 'moon',
          label: 'Mode sombre',
          value: darkModeEnabled,
          onToggle: setDarkModeEnabled,
        },
        {
          type: 'link',
          icon: 'language',
          label: 'Langue',
          value: 'Français',
          onPress: () => Alert.alert('Langue', 'Changer la langue'),
        },
      ],
    },
    {
      title: 'Sécurité',
      icon: 'shield-checkmark',
      items: [
        {
          type: 'link',
          icon: 'lock-closed',
          label: 'Changer mot de passe',
          onPress: () => Alert.alert('Mot de passe', 'Changer le mot de passe'),
        },
        {
          type: 'link',
          icon: 'fingerprint',
          label: 'Authentification à deux facteurs',
          value: 'Désactivée',
          onPress: () => Alert.alert('2FA', 'Configurer la 2FA'),
        },
      ],
    },
    {
      title: 'Support',
      icon: 'help-circle',
      items: [
        {
          type: 'link',
          icon: 'headset',
          label: "Centre d'aide",
          onPress: () => Alert.alert('Support', "Ouvrir le centre d'aide"),
        },
        {
          type: 'link',
          icon: 'document-text',
          label: "Conditions d'utilisation",
          onPress: () => Alert.alert('CGU', 'Voir les conditions'),
        },
        {
          type: 'link',
          icon: 'shield',
          label: 'Politique de confidentialité',
          onPress: () => Alert.alert('Confidentialité', 'Voir la politique'),
        },
      ],
    },
  ];

  const stats = [
    { label: 'Commandes ce mois', value: '142', change: '+12%' },
    { label: 'Clients actifs', value: '89', change: '+8%' },
    { label: 'Satisfaction', value: '4.8/5', change: '+0.2' },
  ];

  const handleEditProfile = () => {
    setIsEditing(!isEditing);
    Alert.alert(
      'Modification',
      isEditing ? 'Modifications enregistrées' : 'Mode édition activé'
    );
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Êtes-vous sûr de vouloir vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: async () => {
          await setAuth(false);
          router.replace('/auth/login');
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, GlobalStyles.card]}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="business" size={48} color={Colors.primary} />
            </View>
            {profile.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={16} color={Colors.white} />
              </View>
            )}
          </View>

          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.pharmacyName}>{profile.name}</Text>
              <TouchableOpacity onPress={handleEditProfile} style={styles.editButton}>
                <Ionicons
                  name={isEditing ? 'checkmark' : 'pencil'}
                  size={20}
                  color={isEditing ? Colors.success : Colors.primary}
                />
              </TouchableOpacity>
            </View>

            <View style={styles.verificationRow}>
              <Text style={styles.memberSince}>Membre depuis {profile.memberSince}</Text>
              <View style={styles.verificationStatus}>
                <Text style={styles.verificationText}>
                  {profile.verified ? 'Vérifié ✓' : 'Non vérifié'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text
                style={[
                  styles.statChange,
                  { color: stat.change.startsWith('+') ? Colors.success : Colors.error },
                ]}
              >
                {stat.change}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {menuItems.map((section, sectionIndex) => (
        <View key={sectionIndex} style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name={section.icon as any} size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>{section.title}</Text>
          </View>

          <View style={styles.sectionContent}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={[styles.menuItem, itemIndex === section.items.length - 1 && styles.lastMenuItem]}
                onPress={item.onPress}
                disabled={item.type === 'toggle'}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.menuIcon}>
                    <Ionicons name={item.icon as any} size={20} color={Colors.primary} />
                  </View>
                  <View style={styles.menuText}>
                    <Text style={styles.menuLabel}>{item.label}</Text>
                    {item.value && (
                      <Text style={styles.menuValue} numberOfLines={1}>
                        {item.value}
                      </Text>
                    )}
                  </View>
                </View>

                {item.type === 'toggle' ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: Colors.mediumGray, true: Colors.primaryLight }}
                    thumbColor={item.value ? Colors.primary : Colors.white}
                  />
                ) : (
                  <Ionicons name="chevron-forward" size={20} color={Colors.mediumGray} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color={Colors.error} />
          <Text style={styles.secondaryButtonText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.versionContainer}>
        <Text style={styles.versionText}>Delymed Pharmacie v1.1.0</Text>
        <Text style={styles.copyrightText}>
          © {new Date().getFullYear()} Tous droits réservés
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    marginBottom: 24,
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
  },
  profileHeader: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: Colors.primaryTransparent,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 12,
  },
  pharmacyName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primaryDark,
    flex: 1,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verificationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  memberSince: {
    fontSize: 14,
    color: Colors.gray,
  },
  verificationStatus: {
    backgroundColor: Colors.successLight,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verificationText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray,
    textAlign: 'center',
    marginBottom: 4,
  },
  statChange: {
    fontSize: 11,
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primaryDark,
    marginLeft: 8,
  },
  sectionContent: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    paddingHorizontal: 0,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightGray,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuText: {
    flex: 1,
  },
  menuLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.darkGray,
    marginBottom: 2,
  },
  menuValue: {
    fontSize: 14,
    color: Colors.gray,
  },
  actionsContainer: {
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  secondaryButton: {
    backgroundColor: Colors.errorLight,
    borderWidth: 1,
    borderColor: Colors.error,
  },
  secondaryButtonText: {
    color: Colors.error,
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  versionText: {
    fontSize: 14,
    color: Colors.gray,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: Colors.mediumGray,
  },
});

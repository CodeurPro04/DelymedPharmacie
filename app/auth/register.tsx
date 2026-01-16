import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Colors from '../../constants/Colors';
import { saveProfile, setAuth } from '../../lib/storage';

export default function RegisterScreen() {
  const [pharmacyName, setPharmacyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!pharmacyName || !email || !password || password !== confirm) {
      return;
    }
    setLoading(true);
    await saveProfile({
      name: pharmacyName,
      address: "Abidjan, Côte d'Ivoire",
      phone: phone || '+225',
      email,
      licenseNumber: licenseNumber || 'PH-CI-XXXX',
      memberSince: new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' }),
    });
    await setAuth(true);
    setLoading(false);
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brand}>
          <View style={styles.logo}>
            <Ionicons name="business" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Créer un compte pharmacie</Text>
          <Text style={styles.subtitle}>
            Démarrez votre espace Delymed pour gérer inventaire et commandes.
          </Text>
        </View>

        <View style={styles.card}>
          <Input
            label="Nom de la pharmacie"
            placeholder="Pharmacie Delymed"
            value={pharmacyName}
            onChangeText={setPharmacyName}
          />
          <Input
            label="Adresse email"
            placeholder="contact@pharmacie.ci"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Téléphone"
            placeholder="+225 01 02 03 04 05"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
          />
          <Input
            label="Numéro de licence"
            placeholder="PH-CI-2024-001"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
          />
          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            label="Confirmer le mot de passe"
            placeholder="••••••••"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
          />

          <Button
            title={loading ? 'Création...' : 'Créer le compte'}
            onPress={handleRegister}
            loading={loading}
            disabled={!pharmacyName || !email || !password || password !== confirm}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Déjà un compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/login')}>
              <Text style={styles.footerLink}>Se connecter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  brand: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primaryDark,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray,
    textAlign: 'center',
    lineHeight: 20,
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
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: Colors.gray,
  },
  footerLink: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

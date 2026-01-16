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
import { setAuth } from '../../lib/storage';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      return;
    }
    setLoading(true);
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
            <Ionicons name="medical" size={32} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Connexion pharmacie</Text>
          <Text style={styles.subtitle}>
            Accédez à votre espace Delymed pour gérer les commandes et l’inventaire.
          </Text>
        </View>

        <View style={styles.card}>
          <Input
            label="Adresse email"
            placeholder="contact@pharmacie.ci"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.forgot}>
            <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
          </TouchableOpacity>

          <Button
            title={loading ? 'Connexion...' : 'Se connecter'}
            onPress={handleLogin}
            loading={loading}
            disabled={!email || !password}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <TouchableOpacity onPress={() => router.push('/auth/register')}>
              <Text style={styles.footerLink}>Créer un compte</Text>
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
  forgot: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
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

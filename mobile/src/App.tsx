import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

import type { AuthResponse } from '../../shared/types/auth.js';
import { loadSession, loginUser, logoutSession, refreshSession, registerUser } from './api.js';
import { mobileTheme } from './theme.js';

type AuthMode = 'register' | 'login';

type FormState = {
  email: string;
  fullName: string;
  password: string;
};

const STORAGE_KEY = 'ehe-auth-session';

async function readSession() {
  const raw = await SecureStore.getItemAsync(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as AuthResponse) : null;
}

async function writeSession(session: AuthResponse | null) {
  if (!session) {
    await SecureStore.deleteItemAsync(STORAGE_KEY);
    return;
  }

  await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(session));
}

export default function App() {
  const [mode, setMode] = useState<AuthMode>('register');
  const [form, setForm] = useState<FormState>({ email: '', fullName: '', password: '' });
  const [session, setSession] = useState<AuthResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const stored = await readSession();
      if (!stored) {
        setIsLoading(false);
        return;
      }

      try {
        await loadSession(stored.accessToken);
        setSession(stored);
      } catch {
        try {
          const refreshed = await refreshSession(stored.refreshToken);
          setSession(refreshed);
          await writeSession(refreshed);
        } catch {
          await writeSession(null);
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  async function submit() {
    setError(null);
    setMessage(null);

    try {
      const nextSession =
        mode === 'register'
          ? await registerUser(form)
          : await loginUser({ email: form.email, password: form.password });
      setSession(nextSession);
      await writeSession(nextSession);
      setMessage(mode === 'register' ? 'Account created.' : 'Welcome back.');
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to authenticate.');
    }
  }

  async function rotate() {
    if (!session) {
      return;
    }

    const nextSession = await refreshSession(session.refreshToken);
    setSession(nextSession);
    await writeSession(nextSession);
    setMessage('Session rotated.');
  }

  async function logout() {
    if (!session) {
      return;
    }

    await logoutSession(session.refreshToken);
    setSession(null);
    await writeSession(null);
    setMessage('Signed out.');
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.screen}>
        <View style={styles.shell}>
          <Text style={styles.heading}>Loading session...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.shell}>
        <View style={styles.hero}>
          <Text style={styles.kicker}>Slice 1 mobile demo</Text>
          <Text style={styles.heading}>EHEStudio Ops</Text>
          <Text style={styles.body}>Register, login, refresh, and logout are now mirrored on mobile.</Text>
        </View>

        <View style={styles.panel}>
          {session ? (
            <View style={styles.stack}>
              <Text style={styles.sectionTitle}>Dashboard</Text>
              <Text style={styles.headingSmall} testID="dashboard-name">
                {session.user.fullName}
              </Text>
              <Text style={styles.body}>{session.user.email}</Text>
              <Pressable onPress={() => void rotate()} style={styles.secondaryButton} testID="refresh-button">
                <Text style={styles.secondaryButtonLabel}>Refresh session</Text>
              </Pressable>
              <Pressable onPress={() => void logout()} style={styles.primaryButton} testID="logout-button">
                <Text style={styles.primaryButtonLabel}>Log out</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.stack}>
              <View style={styles.tabRow}>
                <TabButton active={mode === 'register'} label="Register" onPress={() => setMode('register')} />
                <TabButton active={mode === 'login'} label="Login" onPress={() => setMode('login')} />
              </View>
              {error ? <Text style={styles.errorText}>{error}</Text> : null}
              {message ? <Text style={styles.successText}>{message}</Text> : null}
              <TextInput
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(email) => setForm((current) => ({ ...current, email }))}
                placeholder="Email"
                placeholderTextColor="#6A6A6A"
                style={styles.input}
                testID="email-input"
                value={form.email}
              />
              {mode === 'register' ? (
                <TextInput
                  onChangeText={(fullName) => setForm((current) => ({ ...current, fullName }))}
                  placeholder="Full name"
                  placeholderTextColor="#6A6A6A"
                  style={styles.input}
                  testID="full-name-input"
                  value={form.fullName}
                />
              ) : null}
              <TextInput
                onChangeText={(password) => setForm((current) => ({ ...current, password }))}
                placeholder="Password"
                placeholderTextColor="#6A6A6A"
                secureTextEntry
                style={styles.input}
                testID="password-input"
                value={form.password}
              />
              <Pressable onPress={() => void submit()} style={styles.primaryButton} testID="submit-auth-button">
                <Text style={styles.primaryButtonLabel}>
                  {mode === 'register' ? 'Create account' : 'Log in'}
                </Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function TabButton({ active, label, onPress }: { active: boolean; label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.tabButton, active ? styles.tabButtonActive : null]}
      testID={`${label.toLowerCase()}-tab`}
    >
      <Text style={[styles.tabLabel, active ? styles.tabLabelActive : null]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  body: {
    color: mobileTheme.colors.text,
    fontFamily: mobileTheme.typography.bodyFontFamily,
    fontSize: 16,
    lineHeight: 24,
  },
  errorText: {
    color: mobileTheme.colors.error,
    fontFamily: mobileTheme.typography.bodyFontFamily,
  },
  heading: {
    color: mobileTheme.colors.text,
    fontFamily: mobileTheme.typography.headingFontFamily,
    fontSize: 34,
  },
  headingSmall: {
    color: mobileTheme.colors.text,
    fontFamily: mobileTheme.typography.headingFontFamily,
    fontSize: 26,
  },
  hero: {
    gap: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: mobileTheme.colors.divider,
    borderRadius: mobileTheme.shape.borderRadius,
    borderWidth: 1,
    color: mobileTheme.colors.text,
    fontFamily: mobileTheme.typography.bodyFontFamily,
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  kicker: {
    color: mobileTheme.colors.secondary,
    fontFamily: mobileTheme.typography.headingFontFamily,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  panel: {
    backgroundColor: '#FFFFFF',
    borderColor: mobileTheme.colors.divider,
    borderRadius: mobileTheme.shape.borderRadius,
    borderWidth: 1,
    padding: 20,
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: mobileTheme.colors.primary,
    borderRadius: mobileTheme.shape.borderRadius,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  primaryButtonLabel: {
    color: '#FFFFFF',
    fontFamily: mobileTheme.typography.headingFontFamily,
    fontSize: 16,
  },
  screen: {
    backgroundColor: '#FDF6FA',
    flex: 1,
  },
  secondaryButton: {
    alignItems: 'center',
    borderColor: mobileTheme.colors.secondary,
    borderRadius: mobileTheme.shape.borderRadius,
    borderWidth: 1,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  secondaryButtonLabel: {
    color: mobileTheme.colors.secondary,
    fontFamily: mobileTheme.typography.headingFontFamily,
    fontSize: 16,
  },
  sectionTitle: {
    color: mobileTheme.colors.secondary,
    fontFamily: mobileTheme.typography.headingFontFamily,
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  shell: {
    gap: 24,
    padding: 24,
  },
  stack: {
    gap: 14,
  },
  successText: {
    color: '#15803D',
    fontFamily: mobileTheme.typography.bodyFontFamily,
  },
  tabButton: {
    alignItems: 'center',
    borderColor: mobileTheme.colors.divider,
    borderRadius: mobileTheme.shape.borderRadius,
    borderWidth: 1,
    flex: 1,
    paddingVertical: 12,
  },
  tabButtonActive: {
    backgroundColor: '#FCE4F1',
    borderColor: mobileTheme.colors.primary,
  },
  tabLabel: {
    color: mobileTheme.colors.text,
    fontFamily: mobileTheme.typography.headingFontFamily,
  },
  tabLabelActive: {
    color: mobileTheme.colors.primary,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 12,
  },
});

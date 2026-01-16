import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { IconApple, IconGithub, IconGoogle } from '../components/ProviderIcons';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';
import { useApp } from '../hooks/useApp';

export const AccessScreen: React.FC = () => {
  const { login } = useApp();
  const { animatedStyle } = useEntranceAnimation();
  const [showEmail, setShowEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(false);

  const handleEmailLogin = () => {
    if (!email.trim()) return;
    if (!useMagicLink && !password.trim()) return;
    login('email');
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={[styles.content, animatedStyle]}>
        <Text style={styles.title}>offgrid</Text>
        <Text style={styles.subtitle}>
          Privacy-first social space. No tracking. No ranking.
        </Text>

        <GlassPanel style={styles.panel}>
          <Pressable style={styles.option} onPress={() => login('anonymous')}>
            <Text style={styles.optionText}>Continue Anonymously</Text>
            <Text style={styles.optionHint}>No account required. No tracking.</Text>
          </Pressable>
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <Pressable style={styles.option} onPress={() => setShowEmail((prev) => !prev)}>
            <Text style={styles.optionText}>Continue with Email</Text>
            <Text style={styles.optionHint}>Private and direct. No marketing.</Text>
          </Pressable>
          {showEmail ? (
            <View style={styles.emailRow}>
              <TextInput
                style={styles.input}
                placeholder="you@offgrid.example"
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {useMagicLink ? null : (
                <TextInput
                  style={[styles.input, styles.inputSmall]}
                  placeholder="password"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              )}
              <Pressable style={styles.emailButton} onPress={handleEmailLogin}>
                <Text style={styles.emailButtonText}>
                  {useMagicLink ? 'Send link' : 'Continue'}
                </Text>
              </Pressable>
            </View>
          ) : null}
          {showEmail ? (
            <Pressable
              style={styles.magicToggle}
              onPress={() => setUseMagicLink((prev) => !prev)}
            >
              <Text style={styles.magicText}>
                {useMagicLink ? 'Use password instead' : 'Use magic link instead'}
              </Text>
            </Pressable>
          ) : null}
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <Text style={styles.sectionLabel}>Continue with Provider</Text>
          <View style={styles.providerRow}>
            <Pressable style={styles.providerButton} onPress={() => login('apple')}>
              <IconApple />
              <Text style={styles.providerText}>Apple</Text>
            </Pressable>
            <Pressable style={styles.providerButton} onPress={() => login('google')}>
              <IconGoogle />
              <Text style={styles.providerText}>Google</Text>
            </Pressable>
            <Pressable style={styles.providerButton} onPress={() => login('github')}>
              <IconGithub />
              <Text style={styles.providerText}>GitHub</Text>
            </Pressable>
          </View>
        </GlassPanel>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#040404',
    paddingHorizontal: 20,
    paddingTop: 90,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#f2f2f2',
    fontSize: 28,
    letterSpacing: 4,
    fontWeight: '300',
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 10,
    marginBottom: 24,
    fontSize: 13,
    lineHeight: 18,
  },
  panel: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
  },
  option: {
    paddingVertical: 4,
  },
  optionText: {
    color: '#f2f2f2',
    fontSize: 15,
    letterSpacing: 0.4,
  },
  optionHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 6,
  },
  emailRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    color: '#f2f2f2',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 10,
    fontSize: 13,
  },
  emailButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emailButtonText: {
    color: '#f2f2f2',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  inputSmall: {
    flex: 0.8,
  },
  magicToggle: {
    marginTop: 10,
  },
  magicText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  sectionLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 12,
    letterSpacing: 0.6,
  },
  providerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  providerButton: {
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  providerText: {
    color: '#f2f2f2',
    fontSize: 11,
    marginTop: 6,
  },
});

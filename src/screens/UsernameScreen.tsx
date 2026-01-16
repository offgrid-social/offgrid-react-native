import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { MediaService } from '../services/MediaService';
import { UserService } from '../services/UserService';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';

const usernamePattern = /^[a-z0-9_]{3,20}$/;

export const UsernameScreen: React.FC = () => {
  const { setUserProfile, setView, userProfile, ageGroup } = useApp();
  const { animatedStyle } = useEntranceAnimation();
  const [username, setUsername] = useState(userProfile?.username ?? '');
  const [displayName, setDisplayName] = useState(userProfile?.displayName ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(userProfile?.avatarUri ?? null);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handlePickAvatar = async () => {
    const uri = await MediaService.pickImage();
    setAvatarUri(uri);
  };

  const handleContinue = async () => {
    const trimmed = username.trim();
    const display = displayName.trim();
    if (!trimmed || !display) {
      setError('Username and display name are required.');
      return;
    }
    if (!usernamePattern.test(trimmed)) {
      setError('Use lowercase letters, numbers, or underscore (3-20).');
      return;
    }
    setChecking(true);
    const available = await UserService.isUsernameAvailable(trimmed);
    setChecking(false);
    if (!available) {
      setError('Username is taken in this mock network.');
      return;
    }
    await setUserProfile({
      id: 'you',
      username: trimmed,
      displayName: display,
      avatarUri,
      bio: '',
      links: [],
      isAdult: ageGroup !== 'minor',
      privacy: {
        privateAccount: false,
        showActivity: true,
        allowDMs: 'everyone',
      },
    });
    setView('personalization');
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.content, animatedStyle]}>
        <Text style={styles.title}>Choose your username</Text>
        <Text style={styles.subtitle}>Lowercase only. No spaces. 3-20 characters.</Text>

        <GlassPanel style={styles.panel}>
          <TextInput
            style={styles.input}
            placeholder="username"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={username}
            onChangeText={(value) => {
              setUsername(value.toLowerCase());
              setError('');
            }}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="display name"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={displayName}
            onChangeText={(value) => {
              setDisplayName(value);
              setError('');
            }}
          />
          <Pressable style={styles.avatarButton} onPress={handlePickAvatar}>
            <Text style={styles.avatarText}>
              {avatarUri ? 'Change avatar' : 'Add profile photo (mock)'}
            </Text>
          </Pressable>
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </GlassPanel>

        <Pressable style={styles.continueButton} onPress={handleContinue} disabled={checking}>
          <Text style={styles.continueText}>{checking ? 'Checking...' : 'Continue'}</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#040404',
    paddingTop: 90,
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#f2f2f2',
    fontSize: 20,
    letterSpacing: 0.6,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 16,
  },
  panel: {
    padding: 16,
    borderRadius: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#f2f2f2',
    marginBottom: 12,
    fontSize: 13,
  },
  avatarButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
  },
  avatarText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  error: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 10,
    fontSize: 12,
  },
  continueButton: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginTop: 18,
  },
  continueText: {
    color: '#f2f2f2',
    fontSize: 12,
    letterSpacing: 0.6,
  },
});

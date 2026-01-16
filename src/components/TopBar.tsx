import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { IconHeart, IconPlus } from './Icons';
import { useApp } from '../hooks/useApp';
import type { ViewId } from '../types';

const titleMap: Record<ViewId, string> = {
  home: 'Home',
  discover: 'Discover',
  create: 'Create',
  messages: 'Messages',
  profile: 'Profile',
  preferences: 'Preferences',
  settings: 'Settings',
  activity: 'Activity',
  safety: 'Safety & Trust',
  moderation: 'Moderation',
  access: 'Home',
  personalization: 'Personalize',
  username: 'Set Username',
  storyViewer: 'Story',
  chatThread: 'Messages',
  ageGate: 'Age',
  profilePosts: 'Posts',
  profileConnections: 'Connections',
  profileLists: 'Lists',
  savedPosts: 'Saved',
};

export const TopBar: React.FC = () => {
  const { view, setView, setCreateType } = useApp();
  const title = titleMap[view] ?? 'Explore';

  return (
    <View style={styles.topBar}>
      <Pressable
        style={styles.iconSlot}
        onPress={() => {
          setCreateType('text');
          setView('create');
        }}
      >
        <IconPlus active={view === 'create'} />
      </Pressable>
      <Text style={styles.title}>{title}</Text>
      <Pressable style={styles.iconSlot} onPress={() => setView('activity')}>
        <IconHeart active={view === 'activity'} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingTop: 54,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconSlot: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: '#f2f2f2',
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 1,
  },
});

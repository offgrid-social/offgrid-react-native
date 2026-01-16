import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { GlassPanel } from './GlassPanel';
import { IconChat, IconHome, IconPlus, IconProfile, IconSearch } from './Icons';
import { useApp } from '../hooks/useApp';

export const BottomNav: React.FC = () => {
  const { view, setView, setCreateType } = useApp();

  return (
    <View style={styles.wrap}>
      <GlassPanel style={styles.navBar} intensity={36}>
        <Pressable onPress={() => setView('home')} style={styles.navItem}>
          <IconHome active={view === 'home'} />
        </Pressable>
        <Pressable onPress={() => setView('discover')} style={styles.navItem}>
          <IconSearch active={view === 'discover'} />
        </Pressable>
        <Pressable
          onPress={() => {
            setCreateType('text');
            setView('create');
          }}
          style={styles.navItem}
        >
          <IconPlus size={20} active={view === 'create'} />
        </Pressable>
        <Pressable onPress={() => setView('messages')} style={styles.navItem}>
          <IconChat active={view === 'messages'} />
        </Pressable>
        <Pressable onPress={() => setView('profile')} style={styles.navItem}>
          <IconProfile active={view === 'profile'} />
        </Pressable>
      </GlassPanel>
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 28,
    alignItems: 'center',
  },
  navBar: {
    width: '84%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  navItem: {
    width: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';

const connections = [
  { id: 'c1', name: 'Avery', handle: '@avery', connectedSince: '2024-11-02' },
  { id: 'c2', name: 'Rowan', handle: '@rowan', connectedSince: '2025-03-18' },
  { id: 'c3', name: 'Mira', handle: '@mira', connectedSince: '2025-07-09' },
];

export const ProfileConnectionsScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {connections.map((item) => (
          <GlassPanel key={item.id} style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.handle}>{item.handle}</Text>
            <Text style={styles.meta}>Connected since {item.connectedSince}</Text>
          </GlassPanel>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 96,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  scroll: {
    paddingBottom: 20,
  },
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
  },
  name: {
    color: '#f2f2f2',
    fontSize: 13,
  },
  handle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 4,
  },
  meta: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 6,
  },
});

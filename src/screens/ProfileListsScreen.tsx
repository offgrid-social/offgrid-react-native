import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';

const lists = [
  { id: 'l1', name: 'Close circle', count: 12 },
  { id: 'l2', name: 'Local artists', count: 8 },
  { id: 'l3', name: 'Research contacts', count: 5 },
];

export const ProfileListsScreen: React.FC = () => {
  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {lists.map((item) => (
          <GlassPanel key={item.id} style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.meta}>{item.count} members</Text>
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
  meta: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 6,
  },
});

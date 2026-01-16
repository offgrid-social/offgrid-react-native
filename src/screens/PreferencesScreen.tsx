import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { InterestTile } from '../components/InterestTile';
import { INTERESTS } from '../data/interests';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';

export const PreferencesScreen: React.FC = () => {
  const { selectedInterests, toggleInterest, resetPersonalization, setView } = useApp();
  const { animatedStyle } = useEntranceAnimation();

  return (
    <View style={styles.screen}>
      <Animated.View style={animatedStyle}>
      <GlassPanel style={styles.panel}>
        <Text style={styles.title}>Preferences</Text>
        <Text style={styles.subtitle}>
          Edit your interests anytime. These only filter what you see.
        </Text>
        <View style={styles.grid}>
          {INTERESTS.map((interest) => (
            <InterestTile
              key={interest.id}
              label={interest.label}
              selected={selectedInterests.includes(interest.id)}
              onToggle={() => toggleInterest(interest.id)}
            />
          ))}
        </View>
      </GlassPanel>

      <View style={styles.actions}>
        <Pressable style={styles.resetButton} onPress={resetPersonalization}>
          <Text style={styles.resetText}>Reset personalization</Text>
        </Pressable>
        <Pressable style={styles.doneButton} onPress={() => setView('profile')}>
          <Text style={styles.doneText}>Done</Text>
        </Pressable>
      </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 110,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  panel: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 18,
  },
  title: {
    color: '#f2f2f2',
    fontSize: 16,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resetButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  resetText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  doneButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  doneText: {
    color: '#f2f2f2',
    fontSize: 11,
    letterSpacing: 0.5,
  },
});

import React from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';
import { useApp } from '../hooks/useApp';

export const AgeGateScreen: React.FC = () => {
  const { animatedStyle } = useEntranceAnimation();
  const { setAgeGroup, showToast, setView, auth } = useApp();

  const handleSelect = (group: 'adult' | 'minor') => {
    setAgeGroup(group);
    showToast('Age setting saved');
    if (!auth.isAnonymous) {
      setView('username');
    } else {
      setView('personalization');
    }
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={animatedStyle}>
        <Text style={styles.title}>Are you 18 or older?</Text>
        <Text style={styles.subtitle}>
          Age settings are used only to filter visible content.
        </Text>
        <GlassPanel style={styles.panel}>
          <Pressable style={styles.option} onPress={() => handleSelect('adult')}>
            <Text style={styles.optionText}>Yes, I am 18+</Text>
          </Pressable>
          <Pressable style={styles.option} onPress={() => handleSelect('minor')}>
            <Text style={styles.optionText}>No, I am under 18</Text>
          </Pressable>
        </GlassPanel>
      </Animated.View>
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
  title: {
    color: '#f2f2f2',
    fontSize: 18,
    marginBottom: 8,
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
  option: {
    paddingVertical: 10,
  },
  optionText: {
    color: '#f2f2f2',
    fontSize: 13,
  },
});

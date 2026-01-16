import React, { useEffect } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';

export const ActivityScreen: React.FC = () => {
  const { activity, loadActivity, showToast } = useApp();
  const { animatedStyle } = useEntranceAnimation();

  useEffect(() => {
    loadActivity();
  }, [loadActivity]);

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Animated.View style={animatedStyle}>
          {activity.length === 0 ? (
            <Text style={styles.empty}>No activity yet.</Text>
          ) : (
            activity.map((item) => (
              <Pressable key={item.id} onPress={() => showToast('Opening context')}>
                <GlassPanel style={styles.card}>
                  <Text style={styles.text}>{item.text}</Text>
                </GlassPanel>
              </Pressable>
            ))
          )}
        </Animated.View>
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
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 12,
  },
  empty: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 20,
  },
});

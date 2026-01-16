import React from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';

export const SafetyTrustScreen: React.FC = () => {
  const { safetySettings, updateSafetySettings, ageGroup } = useApp();
  const { animatedStyle } = useEntranceAnimation();

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Animated.View style={animatedStyle}>
        <GlassPanel style={styles.panel}>
          <Text style={styles.title}>Safety & Trust</Text>
          <Text style={styles.subtitle}>
            Age settings are used only to filter visible content.
          </Text>
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <Text style={styles.section}>Content filters</Text>
          <Pressable
            style={styles.row}
            onPress={() =>
              updateSafetySettings({ blurSensitiveContent: !safetySettings.blurSensitiveContent })
            }
          >
            <Text style={styles.rowText}>Blur sensitive content</Text>
            <Text style={styles.rowHint}>
              {safetySettings.blurSensitiveContent ? 'On' : 'Off'}
            </Text>
          </Pressable>
          <Pressable
            style={styles.row}
            onPress={() =>
              updateSafetySettings({ allowTapToReveal: !safetySettings.allowTapToReveal })
            }
            disabled={ageGroup === 'minor'}
          >
            <Text style={styles.rowText}>Allow tap-to-reveal</Text>
            <Text style={styles.rowHint}>
              {ageGroup === 'minor'
                ? 'Disabled for minors'
                : safetySettings.allowTapToReveal
                ? 'On'
                : 'Off'}
            </Text>
          </Pressable>
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <Text style={styles.section}>Age group</Text>
          <Text style={styles.rowHint}>{ageGroup ?? 'Not set'}</Text>
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <Text style={styles.section}>How reporting works</Text>
          <Text style={styles.rowHint}>
            Reports are reviewed by moderators. No automatic punishment.
          </Text>
        </GlassPanel>

        <GlassPanel style={styles.panel}>
          <Text style={styles.section}>Community principles</Text>
          <Text style={styles.rowHint}>
            Calm, chronological, human-first. No ranking, no tracking.
          </Text>
        </GlassPanel>
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
  panel: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  title: {
    color: '#f2f2f2',
    fontSize: 14,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  section: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginBottom: 6,
  },
  row: {
    paddingVertical: 6,
  },
  rowText: {
    color: '#f2f2f2',
    fontSize: 12,
  },
  rowHint: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 4,
  },
});

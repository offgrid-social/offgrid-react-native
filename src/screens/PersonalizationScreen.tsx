import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { InterestTile } from '../components/InterestTile';
import { INTERESTS } from '../data/interests';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';
import { useApp } from '../hooks/useApp';

export const PersonalizationScreen: React.FC = () => {
  const { selectedInterests, toggleInterest, completeOnboarding } = useApp();
  const { animatedStyle } = useEntranceAnimation();
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitTranslate = useRef(new Animated.Value(0)).current;
  const [skipWarning, setSkipWarning] = useState(false);

  const canContinue = selectedInterests.length > 0;

  const handleContinue = () => {
    if (!canContinue) {
      setSkipWarning(true);
      return;
    }
    Animated.parallel([
      Animated.timing(exitOpacity, {
        toValue: 0,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(exitTranslate, {
        toValue: -12,
        duration: 260,
        useNativeDriver: true,
      }),
    ]).start(() => {
      completeOnboarding();
    });
  };

  const handleSkip = () => {
    setSkipWarning(false);
    completeOnboarding();
  };

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[
          styles.content,
          animatedStyle,
          { opacity: exitOpacity, transform: [{ translateY: exitTranslate }] },
        ]}
      >
        <Text style={styles.title}>What are you interested in?</Text>
        <Text style={styles.subtitle}>Choose a few to filter what you see.</Text>

        <GlassPanel style={styles.panel}>
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

        <GlassPanel style={styles.note}>
          <Text style={styles.noteText}>
            Your choices are not used for tracking or ranking. They only filter what you see.
          </Text>
        </GlassPanel>

        <View style={styles.actions}>
          <Pressable
            style={[styles.skipButton, !skipWarning && styles.skipButtonHidden]}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip for now (feeds will be generic)</Text>
          </Pressable>
          <Pressable
            style={[styles.continueButton, !canContinue && styles.continueButtonDisabled]}
            onPress={handleContinue}
          >
            <Text style={styles.continueText}>Continue</Text>
          </Pressable>
        </View>
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
    paddingBottom: 60,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#f2f2f2',
    fontSize: 20,
    letterSpacing: 0.6,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 13,
    marginBottom: 18,
  },
  panel: {
    padding: 14,
    borderRadius: 20,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  note: {
    padding: 14,
    borderRadius: 18,
    marginBottom: 18,
  },
  noteText: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 12,
    lineHeight: 16,
  },
  continueButton: {
    alignSelf: 'flex-end',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  continueButtonDisabled: {
    opacity: 0.4,
  },
  continueText: {
    color: '#f2f2f2',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  actions: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  skipButton: {
    marginBottom: 10,
  },
  skipButtonHidden: {
    opacity: 0,
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
});

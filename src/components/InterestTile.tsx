import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text } from 'react-native';

type InterestTileProps = {
  label: string;
  selected: boolean;
  onToggle: () => void;
};

export const InterestTile: React.FC<InterestTileProps> = ({ label, selected, onToggle }) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scale, {
      toValue: 0.97,
      duration: 160,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scale, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={onToggle} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.tile,
          selected && styles.tileSelected,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  tile: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 10,
    marginRight: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  tileSelected: {
    borderColor: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  label: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  labelSelected: {
    color: '#f2f2f2',
  },
});

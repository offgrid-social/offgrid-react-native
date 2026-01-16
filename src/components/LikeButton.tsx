import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';

import { IconHeart } from './Icons';

type LikeButtonProps = {
  liked: boolean;
  loading?: boolean;
  count: number;
  hideCount?: boolean;
  onPress: () => void;
};

export const LikeButton: React.FC<LikeButtonProps> = ({
  liked,
  loading = false,
  count,
  hideCount,
  onPress,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 1.08, duration: 120, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 140, useNativeDriver: true }),
    ]).start();
  }, [liked, scale]);

  useEffect(() => {
    if (!loading) {
      opacity.setValue(1);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.5, duration: 220, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [loading, opacity]);

  return (
    <Pressable onPress={onPress} style={styles.wrap}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <IconHeart active={liked} />
      </Animated.View>
      {hideCount ? null : <Text style={styles.text}>{count}</Text>}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginLeft: 6,
  },
});

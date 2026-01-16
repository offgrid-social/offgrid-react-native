import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';

type GlassPanelProps = {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  intensity?: number;
  testID?: string;
};

export const GlassPanel: React.FC<GlassPanelProps> = ({
  children,
  style,
  intensity = 18,
  testID,
}) => {
  return (
    <BlurView intensity={intensity} tint="dark" style={[styles.panel, style]} testID={testID}>
      {children}
    </BlurView>
  );
};

const styles = StyleSheet.create({
  panel: {
    backgroundColor: 'rgba(10, 20, 30, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
    overflow: 'hidden',
  },
});

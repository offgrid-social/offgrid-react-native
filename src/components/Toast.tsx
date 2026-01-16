import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type ToastProps = {
  message: string;
};

export const Toast: React.FC<ToastProps> = ({ message }) => {
  return (
    <View style={styles.toast}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 120,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  text: {
    color: '#f2f2f2',
    fontSize: 11,
  },
});

import React from 'react';
import { StyleSheet, View } from 'react-native';

export const IconApple: React.FC = () => {
  return <View style={styles.apple} />;
};

export const IconGoogle: React.FC = () => {
  return (
    <View style={styles.google}>
      <View style={styles.googleInner} />
    </View>
  );
};

export const IconGithub: React.FC = () => {
  return (
    <View style={styles.github}>
      <View style={styles.githubEyeLeft} />
      <View style={styles.githubEyeRight} />
    </View>
  );
};

const styles = StyleSheet.create({
  apple: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
  },
  google: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff',
  },
  github: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  githubEyeLeft: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    borderWidth: 1,
    borderColor: '#fff',
    left: 4,
    top: 6,
  },
  githubEyeRight: {
    position: 'absolute',
    width: 3,
    height: 3,
    borderRadius: 1.5,
    borderWidth: 1,
    borderColor: '#fff',
    right: 4,
    top: 6,
  },
});

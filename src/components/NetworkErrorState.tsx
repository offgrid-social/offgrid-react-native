import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from './GlassPanel';

type NetworkErrorStateProps = {
  variant: 'text' | 'image' | 'video';
  onRetry: () => void;
  onReportBug: () => void;
  header?: React.ReactNode;
};

const placeholderItems = Array.from({ length: 4 }, (_, index) => ({ id: `placeholder_${index}` }));

export const NetworkErrorState: React.FC<NetworkErrorStateProps> = ({
  variant,
  onRetry,
  onReportBug,
  header,
}) => {
  const banner = (
    <GlassPanel style={styles.header}>
      <Text style={styles.title}>Network issue</Text>
      <Text style={styles.subtitle}>Your feed stays in place while we reconnect.</Text>
      <View style={styles.actions}>
        <Pressable style={styles.action} onPress={onRetry}>
          <Text style={styles.actionText}>Retry</Text>
        </Pressable>
        <Pressable style={styles.action} onPress={onReportBug}>
          <Text style={styles.actionText}>Report a bug</Text>
        </Pressable>
      </View>
    </GlassPanel>
  );

  if (variant === 'image') {
    return (
      <View style={styles.container}>
        {header}
        {banner}
        <FlatList
          data={placeholderItems}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={() => (
            <View style={styles.imageCard} testID="network-error-image-card">
              <View style={styles.imageMedia} />
              <View style={styles.row}>
                <View style={styles.dot} />
                <View style={styles.dot} />
                <View style={styles.dot} />
              </View>
              <View style={styles.lineShort} />
            </View>
          )}
          contentContainerStyle={styles.imageList}
        />
      </View>
    );
  }

  if (variant === 'video') {
    return (
      <View style={styles.container}>
        {header}
        {banner}
        <FlatList
          data={placeholderItems}
          keyExtractor={(item) => item.id}
          renderItem={() => (
            <View style={styles.videoCard} testID="network-error-video-card">
              <View style={styles.videoMedia} />
              <View style={styles.lineShort} />
            </View>
          )}
          contentContainerStyle={styles.videoList}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {header}
      {banner}
      <FlatList
        data={placeholderItems}
        keyExtractor={(item) => item.id}
        renderItem={() => (
          <GlassPanel style={styles.textCard} testID="network-error-text-card">
            <View style={styles.line} />
            <View style={styles.lineWide} />
            <View style={styles.lineShort} />
          </GlassPanel>
        )}
        contentContainerStyle={styles.textList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 14,
    borderRadius: 18,
    marginHorizontal: 20,
    marginTop: 96,
    marginBottom: 12,
  },
  title: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  action: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  actionText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  textList: {
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  textCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 18,
  },
  line: {
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 10,
    width: '40%',
  },
  lineWide: {
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 10,
    width: '80%',
  },
  lineShort: {
    height: 10,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    width: '55%',
  },
  imageList: {
    paddingTop: 8,
    paddingBottom: 140,
    paddingHorizontal: 20,
  },
  imageCard: {
    width: 300,
    marginRight: 16,
  },
  imageMedia: {
    height: 320,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: 8,
  },
  videoList: {
    paddingTop: 8,
    paddingBottom: 140,
  },
  videoCard: {
    height: 520,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  videoMedia: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
});

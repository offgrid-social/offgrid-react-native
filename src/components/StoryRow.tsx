import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import type { Story } from '../types';
import { GlassPanel } from './GlassPanel';
import { useApp } from '../hooks/useApp';

type StoryRowProps = {
  stories: Story[];
};

export const StoryRow: React.FC<StoryRowProps> = ({ stories }) => {
  const { setView, setActiveStoryIndex, setCreateType } = useApp();

  const handleOpenStory = (index: number) => {
    setActiveStoryIndex(index);
    setView('storyViewer');
  };

  return (
    <View style={styles.wrap}>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={stories}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Pressable
            style={styles.addStory}
            onPress={() => {
              setCreateType('story');
              setView('create');
            }}
          >
            <GlassPanel style={styles.addCircle}>
              <Text style={styles.addPlus}>+</Text>
            </GlassPanel>
            <Text style={styles.label}>Add story</Text>
          </Pressable>
        }
        renderItem={({ item, index }) => (
          <Pressable style={styles.storyItem} onPress={() => handleOpenStory(index)}>
            <GlassPanel style={styles.circle} />
            <Text style={styles.label}>{item.username}</Text>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 12,
  },
  list: {
    paddingHorizontal: 4,
  },
  addStory: {
    alignItems: 'center',
    marginRight: 12,
  },
  addCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPlus: {
    color: '#f2f2f2',
    fontSize: 20,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 12,
  },
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  label: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginTop: 6,
  },
});

import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';

export const MessagesScreen: React.FC = () => {
  const { threads, loadThreads, setActiveThreadId, setView } = useApp();
  const { animatedStyle } = useEntranceAnimation();
  const [query, setQuery] = useState('');

  useEffect(() => {
    loadThreads();
  }, [loadThreads]);

  const filtered = threads.filter((thread) =>
    `${thread.participant.name} ${thread.participant.handle}`
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <View style={styles.screen}>
      <Animated.View style={animatedStyle}>
        <GlassPanel style={styles.searchPanel}>
          <TextInput
            style={styles.input}
            placeholder="Search messages"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={query}
            onChangeText={setQuery}
          />
        </GlassPanel>

        {filtered.length === 0 ? (
          <Text style={styles.empty}>No conversations yet.</Text>
        ) : (
          filtered.map((thread) => (
            <Pressable
              key={thread.id}
              style={styles.threadRow}
              onPress={() => {
                setActiveThreadId(thread.id);
                setView('chatThread');
              }}
            >
              <View>
                <Text style={styles.name}>{thread.participant.name}</Text>
                <Text style={styles.preview}>
                  {thread.messages[thread.messages.length - 1]?.body ?? 'Start a conversation'}
                </Text>
              </View>
              {thread.unreadCount > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{thread.unreadCount}</Text>
                </View>
              ) : null}
            </Pressable>
          ))
        )}
      </Animated.View>
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
  searchPanel: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 12,
  },
  input: {
    color: '#f2f2f2',
    fontSize: 13,
  },
  threadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  name: {
    color: '#f2f2f2',
    fontSize: 13,
  },
  preview: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 4,
  },
  badge: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#f2f2f2',
    fontSize: 10,
  },
  empty: {
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 20,
  },
});

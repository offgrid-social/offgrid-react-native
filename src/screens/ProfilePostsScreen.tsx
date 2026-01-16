import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { useApp } from '../hooks/useApp';

export const ProfilePostsScreen: React.FC = () => {
  const { allPosts, userProfile } = useApp();
  const userId = userProfile?.id ?? 'you';
  const authored = allPosts
    .filter((post) => post.authorId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {authored.length ? (
          authored.map((post) => (
            <GlassPanel key={post.id} style={styles.card}>
              <Text style={styles.body}>{post.body}</Text>
              {post.editHistory.length ? <Text style={styles.edited}>Edited</Text> : null}
              <Text style={styles.time}>{new Date(post.createdAt).toLocaleString()}</Text>
            </GlassPanel>
          ))
        ) : (
          <Text style={styles.empty}>No posts yet.</Text>
        )}
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
  card: {
    padding: 16,
    borderRadius: 20,
    marginBottom: 14,
  },
  body: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 8,
  },
  edited: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
    marginBottom: 6,
  },
  time: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 10,
  },
  empty: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
});

import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';
import { SearchService } from '../services/SearchService';
import { ContentFilterService } from '../services/ContentFilterService';
import type { Post } from '../types';

type Tab = 'people' | 'posts' | 'tags' | 'media';

const RECENTS_KEY = 'offgrid:recentSearches';

export const DiscoverScreen: React.FC = () => {
  const { animatedStyle } = useEntranceAnimation();
  const { ageGroup } = useApp();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<Tab>('people');
  const [people, setPeople] = useState<{ id: string; name: string; handle: string; followed: boolean }[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [media, setMedia] = useState<Post[]>([]);
  const [trending, setTrending] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const loadTrending = async () => {
      const data = await SearchService.getTrendingTags();
      setTrending(data);
    };
    loadTrending();
  }, []);

  useEffect(() => {
    const loadRecent = async () => {
      const stored = await AsyncStorage.getItem(RECENTS_KEY);
      if (stored) {
        setRecent(JSON.parse(stored) as string[]);
      }
    };
    loadRecent();
  }, []);

  const saveRecent = async (value: string) => {
    const next = [value, ...recent.filter((item) => item !== value)].slice(0, 5);
    setRecent(next);
    await AsyncStorage.setItem(RECENTS_KEY, JSON.stringify(next));
  };

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (!value.trim()) return;
    await saveRecent(value.trim());
    setPeople(await SearchService.searchPeople(value));
    setPosts(ContentFilterService.filterPosts(await SearchService.searchPosts(value), ageGroup));
    setTags(await SearchService.searchTags(value));
    setMedia(ContentFilterService.filterPosts(await SearchService.searchMedia(value), ageGroup));
  };

  const toggleFollow = (id: string) => {
    setPeople((prev) =>
      prev.map((person) =>
        person.id === id ? { ...person, followed: !person.followed } : person
      )
    );
  };

  return (
    <View style={styles.screen}>
      <Animated.View style={animatedStyle}>
        <GlassPanel style={styles.searchPanel}>
          <TextInput
            style={styles.input}
            placeholder="Search offgrid"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={query}
          onChangeText={handleSearch}
        />
        </GlassPanel>

        <GlassPanel style={styles.tabs}>
        {(['people', 'posts', 'tags', 'media'] as Tab[]).map((item) => (
          <Pressable key={item} style={styles.tab} onPress={() => setTab(item)}>
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Text>
          </Pressable>
        ))}
        </GlassPanel>

        <View style={styles.results}>
          {query.trim().length === 0 ? (
            <>
            <Text style={styles.sectionTitle}>Trending tags</Text>
            <View style={styles.chipRow}>
              {trending.map((tag) => (
                <Pressable key={tag} style={styles.chip} onPress={() => handleSearch(tag)}>
                  <Text style={styles.chipText}>#{tag}</Text>
                </Pressable>
              ))}
            </View>
            {recent.length ? (
              <>
                <Text style={styles.sectionTitle}>Recent searches</Text>
                {recent.map((item) => (
                  <Pressable key={item} style={styles.resultRow} onPress={() => handleSearch(item)}>
                    <Text style={styles.resultText}>{item}</Text>
                  </Pressable>
                ))}
              </>
            ) : null}
          </>
        ) : null}

        {query.trim().length > 0 && tab === 'people' ? (
          people.length ? (
            people.map((person) => (
              <View key={person.id} style={styles.resultRow}>
                <Text style={styles.resultText}>{person.name}</Text>
                <Pressable style={styles.followButton} onPress={() => toggleFollow(person.id)}>
                  <Text style={styles.followText}>{person.followed ? 'Following' : 'Follow'}</Text>
                </Pressable>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>No people found.</Text>
          )
        ) : null}

        {query.trim().length > 0 && tab === 'posts' ? (
          posts.length ? (
            posts.map((post) => (
              <View key={post.id} style={styles.resultRow}>
                <Text style={styles.resultText}>{post.body}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>No posts found.</Text>
          )
        ) : null}

        {query.trim().length > 0 && tab === 'tags' ? (
          tags.length ? (
            tags.map((tag) => (
              <View key={tag} style={styles.resultRow}>
                <Text style={styles.resultText}>#{tag}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>No tags found.</Text>
          )
        ) : null}

        {query.trim().length > 0 && tab === 'media' ? (
          media.length ? (
            media.map((post) => (
              <View key={post.id} style={styles.resultRow}>
                <Text style={styles.resultText}>{post.body}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.empty}>No media found.</Text>
          )
        ) : null}
        </View>
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
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    marginBottom: 12,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: '#f2f2f2',
  },
  results: {
    marginTop: 8,
  },
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  resultText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    flex: 1,
    marginRight: 10,
  },
  followButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  followText: {
    color: '#f2f2f2',
    fontSize: 10,
  },
  empty: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    marginTop: 12,
  },
});

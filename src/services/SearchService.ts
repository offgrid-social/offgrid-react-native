import type { Post } from '../types';
import { getMockFeed } from '../data/mockFeed';
import { mockDelay } from './mockDelay';

const tags = ['privacy', 'calm', 'open-source', 'offline', 'chronological'];

export const SearchService = {
  async searchPeople(query: string) {
    await mockDelay(120);
    // TODO: backend hook - search people.
    const people = [
      { id: 'u1', name: 'Avery', handle: '@avery', followed: false },
      { id: 'u2', name: 'Mira', handle: '@mira', followed: true },
      { id: 'u3', name: 'Rowan', handle: '@rowan', followed: false },
    ];
    return people.filter((person) =>
      `${person.name} ${person.handle}`.toLowerCase().includes(query.toLowerCase())
    );
  },
  async searchPosts(query: string): Promise<Post[]> {
    await mockDelay(120);
    // TODO: backend hook - search posts.
    return getMockFeed().filter((post) => post.body.toLowerCase().includes(query.toLowerCase()));
  },
  async searchTags(query: string) {
    await mockDelay(120);
    // TODO: backend hook - search tags.
    return tags.filter((tag) => tag.includes(query.toLowerCase()));
  },
  async searchMedia(query: string) {
    await mockDelay(120);
    // TODO: backend hook - search media.
    return getMockFeed().filter(
      (post) => post.type !== 'text' && post.body.toLowerCase().includes(query.toLowerCase())
    );
  },
  async getTrendingTags() {
    await mockDelay(120);
    // TODO: backend hook - fetch trending tags.
    return tags.slice(0, 3);
  },
};

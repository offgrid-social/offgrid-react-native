import type { Story } from '../types';
import { mockDelay } from './mockDelay';

let stories: Story[] = [
  {
    id: 's1',
    userId: 'u1',
    username: 'avery',
    mediaType: 'image',
    uri: 'mock://story/1',
    caption: 'Morning light.',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
    isNSFW: false,
  },
  {
    id: 's2',
    userId: 'u2',
    username: 'rowan',
    mediaType: 'video',
    uri: 'mock://story/2',
    caption: 'Quiet tide.',
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
    isNSFW: true,
  },
];

export const StoryService = {
  async getStories(): Promise<Story[]> {
    await mockDelay(240);
    // TODO: backend hook - fetch stories.
    return [...stories];
  },
  async createStory(story: Story): Promise<Story> {
    await mockDelay(240);
    // TODO: backend hook - create story.
    stories = [story, ...stories];
    return story;
  },
};

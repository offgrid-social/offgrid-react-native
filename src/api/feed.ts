import { getMockFeed } from '../data/mockFeed';
import type { Post } from '../types';

export const fetchFeed = async (): Promise<Post[]> => {
  // Replace with real feed API call.
  return getMockFeed();
};

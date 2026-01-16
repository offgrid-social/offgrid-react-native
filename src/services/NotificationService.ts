import type { NotificationItem } from '../types';
import { mockDelay } from './mockDelay';

const items: NotificationItem[] = [
  {
    id: 'n1',
    type: 'like',
    text: 'Mira liked your post.',
    createdAt: new Date(Date.now() - 3600_000).toISOString(),
  },
  {
    id: 'n2',
    type: 'follow',
    text: 'Rowan followed you.',
    createdAt: new Date(Date.now() - 7200_000).toISOString(),
  },
  {
    id: 'n3',
    type: 'comment',
    text: 'Avery commented on your update.',
    createdAt: new Date(Date.now() - 10_800_000).toISOString(),
  },
  {
    id: 'n4',
    type: 'mention',
    text: 'Mira mentioned you in a post.',
    createdAt: new Date(Date.now() - 12_000_000).toISOString(),
  },
  {
    id: 'n5',
    type: 'story_reply',
    text: 'Rowan replied to your story.',
    createdAt: new Date(Date.now() - 14_000_000).toISOString(),
  },
];

export const NotificationService = {
  async getActivity(): Promise<NotificationItem[]> {
    await mockDelay(200);
    // TODO: backend hook - fetch activity.
    return [...items];
  },
};

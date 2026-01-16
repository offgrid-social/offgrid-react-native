import type { Message, Thread } from '../types';
import { mockDelay } from './mockDelay';

let threads: Thread[] = [
  {
    id: 't1',
    participant: { id: 'u2', name: 'Mira', handle: '@mira' },
    unreadCount: 1,
    messages: [
      {
        id: 'm1',
        senderId: 'u2',
        body: 'Quiet day. Want to sync later?',
        createdAt: new Date(Date.now() - 7200_000).toISOString(),
        reactions: [],
        seen: false,
      },
    ],
  },
  {
    id: 't2',
    participant: { id: 'u3', name: 'Rowan', handle: '@rowan' },
    unreadCount: 0,
    messages: [
      {
        id: 'm2',
        senderId: 'u3',
        body: 'No rankings. Just order.',
        createdAt: new Date(Date.now() - 3600_000).toISOString(),
        reactions: ['+1'],
        seen: true,
      },
    ],
  },
];

const createMessage = (body: string, mediaUri?: string): Message => ({
  id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  senderId: 'you',
  body,
  createdAt: new Date().toISOString(),
  reactions: [],
  seen: true,
  mediaUri,
});

export const MessageService = {
  async fetchThreads(): Promise<Thread[]> {
    await mockDelay(240);
    // TODO: backend hook - fetch threads.
    return [...threads];
  },
  async fetchThread(threadId: string): Promise<Thread | null> {
    await mockDelay(200);
    // TODO: backend hook - fetch thread detail.
    return threads.find((thread) => thread.id === threadId) ?? null;
  },
  async sendMessage(threadId: string, body: string): Promise<Thread | null> {
    await mockDelay(180);
    // TODO: backend hook - send message.
    threads = threads.map((thread) => {
      if (thread.id !== threadId) return thread;
      return {
        ...thread,
        messages: [...thread.messages, createMessage(body)],
        unreadCount: 0,
      };
    });
    return threads.find((thread) => thread.id === threadId) ?? null;
  },
  async sendImage(threadId: string, uri: string): Promise<Thread | null> {
    await mockDelay(180);
    // TODO: backend hook - send image.
    threads = threads.map((thread) => {
      if (thread.id !== threadId) return thread;
      return {
        ...thread,
        messages: [...thread.messages, createMessage('Sent an image', uri)],
        unreadCount: 0,
      };
    });
    return threads.find((thread) => thread.id === threadId) ?? null;
  },
  async reactToMessage(threadId: string, messageId: string, emoji: string): Promise<Thread | null> {
    await mockDelay(140);
    // TODO: backend hook - react to message.
    threads = threads.map((thread) => {
      if (thread.id !== threadId) return thread;
      return {
        ...thread,
        messages: thread.messages.map((message) =>
          message.id === messageId
            ? { ...message, reactions: [...message.reactions, emoji] }
            : message
        ),
      };
    });
    return threads.find((thread) => thread.id === threadId) ?? null;
  },
};

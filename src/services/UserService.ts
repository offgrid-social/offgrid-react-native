import type { UserProfile } from '../types';
import { mockDelay } from './mockDelay';

const mockUsers = new Map<string, UserProfile>();

const seedUser = {
  id: 'u1',
  username: 'avery',
  displayName: 'Avery',
  avatarUri: null,
  bio: 'Quiet observer.',
  links: ['https://offgrid.local'],
  isAdult: true,
  privacy: {
    privateAccount: false,
    showActivity: true,
    allowDMs: 'everyone' as const,
  },
};

mockUsers.set(seedUser.username, seedUser);

export const UserService = {
  async isUsernameAvailable(username: string): Promise<boolean> {
    await mockDelay(240);
    // TODO: backend hook - check username availability.
    return !mockUsers.has(username);
  },
  async saveUserProfile(profile: UserProfile): Promise<UserProfile> {
    await mockDelay(200);
    // TODO: backend hook - persist user profile.
    mockUsers.set(profile.username, profile);
    return profile;
  },
  async updateUserProfile(profile: UserProfile, previousUsername?: string): Promise<UserProfile> {
    await mockDelay(200);
    // TODO: backend hook - update user profile.
    if (previousUsername && previousUsername !== profile.username) {
      mockUsers.delete(previousUsername);
    }
    mockUsers.set(profile.username, profile);
    return profile;
  },
  async getUserProfile(username: string): Promise<UserProfile | null> {
    await mockDelay(200);
    // TODO: backend hook - fetch user profile.
    return mockUsers.get(username) ?? null;
  },
};

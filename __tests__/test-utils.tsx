import React from 'react';
import { render } from '@testing-library/react-native';

import type { AppContextValue } from '../src/state/AppContext';
import { AppContext } from '../src/state/AppContext';

const defaultContext: AppContextValue = {
  view: 'profile',
  loading: false,
  auth: { loggedIn: true, isAnonymous: false, provider: 'email' },
  userProfile: {
    id: 'you',
    username: 'you',
    displayName: 'You',
    avatarUri: null,
    bio: '',
    links: [],
    isAdult: true,
    privacy: {
      privateAccount: false,
      showActivity: true,
      allowDMs: 'everyone',
    },
  },
  selectedInterests: [],
  onboardingCompleted: true,
  ageGroup: 'adult',
  safetySettings: { blurSensitiveContent: true, allowTapToReveal: true },
  quietMode: { hideLikes: false, hideCounts: false, pauseNotifications: false },
  feedType: 'text',
  posts: [],
  allPosts: [],
  stories: [],
  threads: [],
  activity: [],
  toast: null,
  simulateNetworkError: false,
  feedError: null,
  likePending: {},
  profileNotes: {},
  connectionInsights: {},
  activeStoryIndex: 0,
  activeThreadId: null,
  createType: 'text',
  role: 'user',
  setView: jest.fn(),
  setActiveStoryIndex: jest.fn(),
  setActiveThreadId: jest.fn(),
  setCreateType: jest.fn(),
  setFeedType: jest.fn(),
  login: jest.fn(async () => {}),
  logout: jest.fn(async () => {}),
  completeOnboarding: jest.fn(),
  setAgeGroup: jest.fn(),
  updateSafetySettings: jest.fn(),
  updateQuietMode: jest.fn(),
  setRole: jest.fn(),
  setProfileNote: jest.fn(),
  setConnectionInsight: jest.fn(),
  toggleInterest: jest.fn(),
  setInterests: jest.fn(),
  resetPersonalization: jest.fn(),
  setUserProfile: jest.fn(async () => {}),
  updateUserProfile: jest.fn(async () => {}),
  refreshFeed: jest.fn(async () => {}),
  refreshAllPosts: jest.fn(async () => {}),
  createPost: jest.fn(async () => {}),
  toggleLike: jest.fn(async () => {}),
  toggleBookmark: jest.fn(async () => {}),
  repost: jest.fn(async () => {}),
  addComment: jest.fn(async () => {}),
  addReply: jest.fn(async () => {}),
  sharePost: jest.fn(async () => {}),
  reportPost: jest.fn(async () => {}),
  loadStories: jest.fn(async () => {}),
  createStory: jest.fn(async () => {}),
  loadThreads: jest.fn(async () => {}),
  updateThread: jest.fn(),
  loadActivity: jest.fn(async () => {}),
  showToast: jest.fn(),
  setSimulateNetworkError: jest.fn(),
};

export const createAppContextValue = (overrides: Partial<AppContextValue> = {}) => ({
  ...defaultContext,
  ...overrides,
});

export const renderWithApp = (
  ui: React.ReactElement,
  overrides: Partial<AppContextValue> = {}
) => {
  const value = createAppContextValue(overrides);
  return render(<AppContext.Provider value={value}>{ui}</AppContext.Provider>);
};

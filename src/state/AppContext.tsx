import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';

import { INTERESTS } from '../data/interests';
import { AuthService } from '../services/AuthService';
import { MessageService } from '../services/MessageService';
import { NotificationService } from '../services/NotificationService';
import { PostService } from '../services/PostService';
import { StoryService } from '../services/StoryService';
import { ContentFilterService } from '../services/ContentFilterService';
import { UserService } from '../services/UserService';
import type {
  AgeGroup,
  AuthState,
  ContentSafetySettings,
  FeedType,
  QuietModeSettings,
  ConnectionInsight,
  NotificationItem,
  Post,
  Story,
  Thread,
  UserProfile,
  ViewId,
} from '../types';

type Toast = {
  message: string;
  visible: boolean;
};

type AppState = {
  view: ViewId;
  loading: boolean;
  auth: AuthState;
  userProfile: UserProfile | null;
  selectedInterests: string[];
  onboardingCompleted: boolean;
  ageGroup: AgeGroup | null;
  safetySettings: ContentSafetySettings;
  quietMode: QuietModeSettings;
  feedType: FeedType;
  posts: Post[];
  allPosts: Post[];
  stories: Story[];
  threads: Thread[];
  activity: NotificationItem[];
  toast: Toast | null;
  simulateNetworkError: boolean;
  feedError: string | null;
  likePending: Record<string, boolean>;
  profileNotes: Record<string, string>;
  connectionInsights: Record<string, ConnectionInsight>;
  activeStoryIndex: number;
  activeThreadId: string | null;
  createType: 'text' | 'image' | 'video' | 'story';
  role: 'user' | 'moderator' | 'admin';
};

type AppActions = {
  setView: (view: ViewId) => void;
  setActiveStoryIndex: (index: number) => void;
  setActiveThreadId: (threadId: string | null) => void;
  setCreateType: (type: 'text' | 'image' | 'video' | 'story') => void;
  setFeedType: (feed: FeedType) => void;
  login: (provider: AuthState['provider']) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => void;
  setAgeGroup: (group: AgeGroup) => void;
  updateSafetySettings: (settings: Partial<ContentSafetySettings>) => void;
  updateQuietMode: (settings: Partial<QuietModeSettings>) => void;
  setRole: (role: 'user' | 'moderator' | 'admin') => void;
  setProfileNote: (userId: string, note: string) => void;
  setConnectionInsight: (userId: string, insight: ConnectionInsight) => void;
  toggleInterest: (interestId: string) => void;
  setInterests: (interestIds: string[]) => void;
  resetPersonalization: () => void;
  setUserProfile: (profile: UserProfile) => Promise<void>;
  updateUserProfile: (profile: UserProfile, previousUsername?: string) => Promise<void>;
  refreshFeed: () => Promise<void>;
  refreshAllPosts: () => Promise<void>;
  createPost: (partial: Pick<Post, 'body' | 'type' | 'media' | 'interests'>) => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  toggleBookmark: (postId: string) => Promise<void>;
  repost: (postId: string) => Promise<void>;
  addComment: (postId: string, body: string) => Promise<void>;
  addReply: (postId: string, commentId: string, body: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  reportPost: (postId: string) => Promise<void>;
  loadStories: () => Promise<void>;
  createStory: (story: Story) => Promise<void>;
  loadThreads: () => Promise<void>;
  updateThread: (thread: Thread) => void;
  loadActivity: () => Promise<void>;
  showToast: (message: string) => void;
  setSimulateNetworkError: (value: boolean) => void;
};

export type AppContextValue = AppState & AppActions;

export const AppContext = createContext<AppContextValue | undefined>(undefined);

const STORAGE_KEY = 'offgrid:state';

const defaultAuth: AuthState = {
  loggedIn: false,
  isAnonymous: false,
  provider: null,
};

const defaultProfile: UserProfile = {
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
};

const defaultSafety: ContentSafetySettings = {
  blurSensitiveContent: true,
  allowTapToReveal: true,
};

const defaultQuietMode: QuietModeSettings = {
  hideLikes: false,
  hideCounts: false,
  pauseNotifications: false,
};

const toggleLikeLocal = (post: Post, userId: string): Post => {
  const alreadyLiked = post.likedBy.includes(userId);
  const likedBy = alreadyLiked ? post.likedBy.filter((id) => id !== userId) : [...post.likedBy, userId];
  const liked = !alreadyLiked;
  return {
    ...post,
    liked,
    likedBy,
    likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1),
  };
};

const toggleSaveLocal = (post: Post, userId: string): Post => {
  const alreadySaved = post.savedBy.includes(userId);
  const savedBy = alreadySaved ? post.savedBy.filter((id) => id !== userId) : [...post.savedBy, userId];
  return {
    ...post,
    bookmarked: !alreadySaved,
    savedBy,
  };
};

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [view, setView] = useState<ViewId>('access');
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState<AuthState>(defaultAuth);
  const [userProfile, setUserProfileState] = useState<UserProfile | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [ageGroup, setAgeGroupState] = useState<AgeGroup | null>(null);
  const [safetySettings, setSafetySettings] = useState<ContentSafetySettings>(defaultSafety);
  const [quietMode, setQuietMode] = useState<QuietModeSettings>(defaultQuietMode);
  const [feedType, setFeedTypeState] = useState<FeedType>('text');
  const [posts, setPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [activity, setActivity] = useState<NotificationItem[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [simulateNetworkError, setSimulateNetworkError] = useState(false);
  const [feedError, setFeedError] = useState<string | null>(null);
  const [likePending, setLikePending] = useState<Record<string, boolean>>({});
  const [profileNotes, setProfileNotes] = useState<Record<string, string>>({});
  const [connectionInsights, setConnectionInsights] = useState<Record<string, ConnectionInsight>>(
    {}
  );
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [createType, setCreateType] = useState<'text' | 'image' | 'video' | 'story'>('text');
  const [role, setRole] = useState<'user' | 'moderator' | 'admin'>('user');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      let nextFeed: FeedType = 'text';
      let nextInterests: string[] = [];
      let nextAgeGroup: AgeGroup | null = null;
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && mounted) {
          const parsed = JSON.parse(stored) as {
            auth?: AuthState;
            selectedInterests?: string[];
            onboardingCompleted?: boolean;
            feedType?: FeedType;
            userProfile?: UserProfile;
            ageGroup?: AgeGroup | null;
            safetySettings?: ContentSafetySettings;
            quietMode?: QuietModeSettings;
            profileNotes?: Record<string, string>;
            connectionInsights?: Record<string, ConnectionInsight>;
          };
          const nextAuth = parsed.auth ?? defaultAuth;
          setAuth(nextAuth);
          nextInterests = parsed.selectedInterests ?? [];
          setSelectedInterests(nextInterests);
          setOnboardingCompleted(!!parsed.onboardingCompleted);
          nextFeed = parsed.feedType ?? 'text';
          setFeedTypeState(nextFeed);
          nextAgeGroup = parsed.ageGroup ?? null;
          setAgeGroupState(nextAgeGroup);
          setSafetySettings(parsed.safetySettings ?? defaultSafety);
          setQuietMode(parsed.quietMode ?? defaultQuietMode);
          setProfileNotes(parsed.profileNotes ?? {});
          setConnectionInsights(parsed.connectionInsights ?? {});
          setUserProfileState(parsed.userProfile ?? (nextAuth.loggedIn ? defaultProfile : null));
          if (!nextAuth.loggedIn) {
            setView('access');
          } else if (!parsed.ageGroup) {
            setView('ageGate');
          } else if (!parsed.userProfile && !nextAuth.isAnonymous) {
            setView('username');
          } else if (!parsed.onboardingCompleted) {
            setView('personalization');
          } else {
            setView('home');
          }
        }
      } catch {
        // Ignore storage errors in mock mode.
      }
      if (mounted) {
        const data = await PostService.getFeed(nextFeed, nextInterests);
        setPosts(ContentFilterService.filterPosts(data, nextAgeGroup));
        const all = await PostService.getAllPosts();
        setAllPosts(all);
        setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const persist = async () => {
      const payload = {
        auth,
        selectedInterests,
        onboardingCompleted,
        ageGroup,
        safetySettings,
        quietMode,
        feedType,
        userProfile,
        profileNotes,
        connectionInsights,
      };
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch {
        // Ignore storage errors in mock mode.
      }
    };
    persist();
  }, [
    auth,
    selectedInterests,
    onboardingCompleted,
    ageGroup,
    safetySettings,
    quietMode,
    feedType,
    userProfile,
    profileNotes,
    connectionInsights,
  ]);

  const showToast = useCallback((message: string) => {
    setToast({ message, visible: true });
    setTimeout(() => {
      setToast(null);
    }, 2000);
  }, []);

  const login = useCallback(async (provider: AuthState['provider']) => {
    if (simulateNetworkError) {
      showToast('Network error. Try again.');
      return;
    }
    const nextAuth = await AuthService.login(provider);
    setAuth(nextAuth);
    if (nextAuth.isAnonymous) {
      setView('ageGate');
    } else {
      setView('ageGate');
    }
  }, [showToast, simulateNetworkError]);

  const logout = useCallback(async () => {
    await AuthService.logout();
    setAuth(defaultAuth);
    setUserProfileState(null);
    setSelectedInterests([]);
    setOnboardingCompleted(false);
    setAgeGroupState(null);
    setSafetySettings(defaultSafety);
    setQuietMode(defaultQuietMode);
    setProfileNotes({});
    setConnectionInsights({});
    setFeedError(null);
    setLikePending({});
    setView('access');
  }, []);

  const completeOnboarding = useCallback(() => {
    setOnboardingCompleted(true);
    setView('home');
  }, []);

  const toggleInterest = useCallback((interestId: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interestId)
        ? prev.filter((id) => id !== interestId)
        : [...prev, interestId]
    );
  }, []);

  const setInterests = useCallback((interestIds: string[]) => {
    const valid = interestIds.filter((id) => INTERESTS.some((item) => item.id === id));
    setSelectedInterests(valid);
  }, []);

  const resetPersonalization = useCallback(() => {
    setSelectedInterests([]);
    setOnboardingCompleted(false);
    setView('personalization');
  }, []);

  const setUserProfile = useCallback(async (profile: UserProfile) => {
    const saved = await UserService.saveUserProfile(profile);
    setUserProfileState(saved);
  }, []);

  const updateUserProfile = useCallback(async (profile: UserProfile, previousUsername?: string) => {
    const updated = await UserService.updateUserProfile(profile, previousUsername);
    setUserProfileState(updated);
  }, []);

  const setAgeGroup = useCallback((group: AgeGroup) => {
    setAgeGroupState(group);
    if (group === 'minor') {
      setSafetySettings((prev) => ({ ...prev, allowTapToReveal: false }));
    }
    if (userProfile) {
      setUserProfileState({ ...userProfile, isAdult: group === 'adult' });
    }
  }, [userProfile]);

  const updateSafetySettings = useCallback((settings: Partial<ContentSafetySettings>) => {
    setSafetySettings((prev) => ({ ...prev, ...settings }));
  }, []);

  const updateQuietMode = useCallback((settings: Partial<QuietModeSettings>) => {
    setQuietMode((prev) => ({ ...prev, ...settings }));
  }, []);

  const setProfileNote = useCallback((userId: string, note: string) => {
    setProfileNotes((prev) => ({ ...prev, [userId]: note }));
  }, []);

  const setConnectionInsight = useCallback((userId: string, insight: ConnectionInsight) => {
    setConnectionInsights((prev) => ({ ...prev, [userId]: insight }));
  }, []);

  const setFeedType = useCallback((feed: FeedType) => {
    setFeedTypeState(feed);
  }, []);

  const refreshFeed = useCallback(async () => {
    if (simulateNetworkError) {
      setFeedError('Network error. Check your connection.');
      return;
    }
    const data = await PostService.getFeed(feedType, selectedInterests);
    setPosts(ContentFilterService.filterPosts(data, ageGroup));
    setFeedError(null);
  }, [feedType, selectedInterests, ageGroup, simulateNetworkError]);

  const refreshAllPosts = useCallback(async () => {
    const data = await PostService.getAllPosts();
    setAllPosts(data);
  }, []);

  const createPost = useCallback(
    async (partial: Pick<Post, 'body' | 'type' | 'media' | 'interests'>) => {
      const authorId = userProfile?.id ?? 'you';
      const newPost: Post = {
        id: `p_${Date.now()}`,
        authorId,
        author: userProfile?.displayName ?? 'You',
        handle: `@${userProfile?.username ?? 'you'}`,
        body: partial.body,
        createdAt: new Date().toISOString(),
        interests: partial.interests,
        type: partial.type,
        media: partial.media ?? null,
        isNSFW: false,
        commentsList: [],
        reposts: 0,
        bookmarked: false,
        likes: 0,
        comments: 0,
        shares: 0,
        liked: false,
        likedBy: [],
        savedBy: [],
        editHistory: [],
      };
      await PostService.createPost(newPost);
      await refreshFeed();
      await refreshAllPosts();
      showToast('Posted');
    },
    [refreshFeed, refreshAllPosts, showToast, userProfile]
  );

  const toggleLike = useCallback(async (postId: string) => {
    const userId = userProfile?.id ?? 'you';
    setLikePending((prev) => ({ ...prev, [postId]: true }));
    setPosts((prev) => prev.map((post) => (post.id === postId ? toggleLikeLocal(post, userId) : post)));
    setAllPosts((prev) => prev.map((post) => (post.id === postId ? toggleLikeLocal(post, userId) : post)));
    const updated = await PostService.toggleLike(postId, userId);
    if (updated) {
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      setAllPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
    }
    setLikePending((prev) => {
      const next = { ...prev };
      delete next[postId];
      return next;
    });
  }, [userProfile]);

  const toggleBookmark = useCallback(async (postId: string) => {
    const userId = userProfile?.id ?? 'you';
    setPosts((prev) => prev.map((post) => (post.id === postId ? toggleSaveLocal(post, userId) : post)));
    setAllPosts((prev) => prev.map((post) => (post.id === postId ? toggleSaveLocal(post, userId) : post)));
    const updated = await PostService.toggleBookmark(postId, userId);
    if (updated) {
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      setAllPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
    }
  }, [userProfile]);

  const repost = useCallback(async (postId: string) => {
    const updated = await PostService.repost(postId);
    if (updated) {
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      setAllPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      showToast('Reposted');
    }
  }, [showToast]);

  const addComment = useCallback(async (postId: string, body: string) => {
    const updated = await PostService.addComment(postId, body);
    if (updated) {
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      setAllPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
    }
  }, []);

  const addReply = useCallback(async (postId: string, commentId: string, body: string) => {
    const updated = await PostService.addReply(postId, commentId, body);
    if (updated) {
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      setAllPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
    }
  }, []);

  const sharePost = useCallback(async (postId: string) => {
    const updated = await PostService.share(postId);
    if (updated) {
      setPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      setAllPosts((prev) => prev.map((post) => (post.id === postId ? updated : post)));
      showToast('Share sheet opened');
    }
  }, [showToast]);

  const reportPost = useCallback(async (postId: string) => {
    await PostService.report(postId);
    showToast('Report submitted');
  }, [showToast]);

  const loadStories = useCallback(async () => {
    const data = await StoryService.getStories();
    setStories(ContentFilterService.filterStories(data, ageGroup));
  }, [ageGroup]);

  const createStory = useCallback(async (story: Story) => {
    await StoryService.createStory(story);
    await loadStories();
    showToast('Story posted');
  }, [loadStories, showToast]);

  const loadThreads = useCallback(async () => {
    const data = await MessageService.fetchThreads();
    setThreads(data);
  }, []);

  const updateThread = useCallback((thread: Thread) => {
    setThreads((prev) => prev.map((item) => (item.id === thread.id ? thread : item)));
  }, []);

  const loadActivity = useCallback(async () => {
    if (quietMode.pauseNotifications) {
      setActivity([]);
      return;
    }
    const data = await NotificationService.getActivity();
    setActivity(data);
  }, [quietMode.pauseNotifications]);

  const value = useMemo(
    () => ({
      view,
      loading,
      auth,
      userProfile,
      selectedInterests,
      onboardingCompleted,
      ageGroup,
      safetySettings,
      quietMode,
      feedType,
      posts,
      allPosts,
      stories,
      threads,
      activity,
      toast,
      simulateNetworkError,
      feedError,
      likePending,
      profileNotes,
      connectionInsights,
      activeStoryIndex,
      activeThreadId,
      createType,
      role,
      setView,
      setActiveStoryIndex,
      setActiveThreadId,
      setCreateType,
      setFeedType,
      login,
      logout,
      completeOnboarding,
      setAgeGroup,
      updateSafetySettings,
      updateQuietMode,
      setRole,
      setProfileNote,
      setConnectionInsight,
      toggleInterest,
      setInterests,
      resetPersonalization,
      setUserProfile,
      updateUserProfile,
      refreshFeed,
      refreshAllPosts,
      createPost,
      toggleLike,
      toggleBookmark,
      repost,
      addComment,
      addReply,
      sharePost,
      reportPost,
      loadStories,
      createStory,
      loadThreads,
      updateThread,
      loadActivity,
      showToast,
      setSimulateNetworkError,
    }),
    [
      view,
      loading,
      auth,
      userProfile,
      selectedInterests,
      onboardingCompleted,
      ageGroup,
      safetySettings,
      quietMode,
      feedType,
      posts,
      allPosts,
      stories,
      threads,
      activity,
      toast,
      simulateNetworkError,
      feedError,
      likePending,
      profileNotes,
      connectionInsights,
      activeStoryIndex,
      activeThreadId,
      createType,
      role,
      setView,
      setActiveStoryIndex,
      setActiveThreadId,
      setCreateType,
      setFeedType,
      login,
      logout,
      completeOnboarding,
      setAgeGroup,
      updateSafetySettings,
      updateQuietMode,
      setRole,
      setProfileNote,
      setConnectionInsight,
      toggleInterest,
      setInterests,
      resetPersonalization,
      setUserProfile,
      updateUserProfile,
      refreshFeed,
      refreshAllPosts,
      createPost,
      toggleLike,
      toggleBookmark,
      repost,
      addComment,
      addReply,
      sharePost,
      reportPost,
      loadStories,
      createStory,
      loadThreads,
      updateThread,
      loadActivity,
      showToast,
      setSimulateNetworkError,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

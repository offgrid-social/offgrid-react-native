export type ViewId =
  | 'access'
  | 'ageGate'
  | 'username'
  | 'personalization'
  | 'home'
  | 'discover'
  | 'create'
  | 'messages'
  | 'profile'
  | 'preferences'
  | 'settings'
  | 'activity'
  | 'storyViewer'
  | 'chatThread'
  | 'safety'
  | 'moderation'
  | 'profilePosts'
  | 'profileConnections'
  | 'profileLists'
  | 'savedPosts';

export type AuthState = {
  loggedIn: boolean;
  isAnonymous: boolean;
  provider: 'anonymous' | 'email' | 'apple' | 'google' | 'github' | null;
};

export type Interest = {
  id: string;
  label: string;
};

export type FeedType = 'text' | 'image' | 'video';

export type AgeGroup = 'adult' | 'minor';

export type ContentSafetySettings = {
  blurSensitiveContent: boolean;
  allowTapToReveal: boolean;
};

export type QuietModeSettings = {
  hideLikes: boolean;
  hideCounts: boolean;
  pauseNotifications: boolean;
};

export type UserProfile = {
  id: string;
  username: string;
  displayName: string;
  avatarUri: string | null;
  bio: string;
  links: string[];
  isAdult: boolean;
  privacy: {
    privateAccount: boolean;
    showActivity: boolean;
    allowDMs: 'everyone' | 'following' | 'no_one';
  };
};

export type EditHistoryItem = {
  body: string;
  editedAt: string;
};

export type Comment = {
  id: string;
  author: string;
  body: string;
  createdAt: string;
  replies: Comment[];
};

export type Post = {
  id: string;
  authorId: string;
  author: string;
  handle: string;
  body: string;
  createdAt: string;
  interests: string[];
  type: FeedType;
  media: string | null;
  isNSFW: boolean;
  commentsList: Comment[];
  reposts: number;
  bookmarked: boolean;
  likes: number;
  comments: number;
  shares: number;
  liked: boolean;
  likedBy: string[];
  savedBy: string[];
  editHistory: EditHistoryItem[];
};

export type Story = {
  id: string;
  userId: string;
  username: string;
  mediaType: 'image' | 'video';
  uri: string;
  caption?: string;
  createdAt: string;
  isNSFW: boolean;
};

export type Message = {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  reactions: string[];
  seen: boolean;
  mediaUri?: string;
};

export type Thread = {
  id: string;
  participant: {
    id: string;
    name: string;
    handle: string;
  };
  messages: Message[];
  unreadCount: number;
};

export type NotificationItem = {
  id: string;
  type: 'like' | 'follow' | 'comment' | 'mention' | 'story_reply';
  text: string;
  createdAt: string;
};

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'nsfw'
  | 'misinformation'
  | 'impersonation'
  | 'other';

export type ReportStatus = 'new' | 'in_review' | 'resolved';

export type ReportItem = {
  id: string;
  contentType: 'post' | 'comment' | 'story' | 'profile' | 'message';
  contentId: string;
  reason: ReportReason;
  note?: string;
  createdAt: string;
  status: ReportStatus;
  assignedModerator?: string;
  resolutionNote?: string;
};

export type BugReportCategory = 'ui' | 'network' | 'crash' | 'data' | 'other';

export type BugReportSeverity = 'low' | 'medium' | 'high' | 'critical';

export type BugReport = {
  id: string;
  category: BugReportCategory;
  description: string;
  steps?: string;
  expected?: string;
  actual?: string;
  severity: BugReportSeverity;
  allowLogs: boolean;
  includeMetadata: boolean;
  screenshot?: string;
  metadata?: {
    appVersion: string;
    platform: string;
    screen: string;
    errorState?: string;
    backend?: string;
  };
  userId?: string;
  isAnonymous: boolean;
  createdAt: string;
};

export type ConnectionInsight = {
  userId: string;
  connectedSince: string;
  lastInteraction: string;
  sharedConnections: number;
};

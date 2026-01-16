import React from 'react';

import { useApp } from '../hooks/useApp';
import { ActivityScreen } from './ActivityScreen';
import { AgeGateScreen } from './AgeGateScreen';
import { ChatThreadScreen } from './ChatThreadScreen';
import { CreateScreen } from './CreateScreen';
import { DiscoverScreen } from './DiscoverScreen';
import { HomeScreen } from './HomeScreen';
import { ModerationQueueScreen } from './ModerationQueueScreen';
import { PreferencesScreen } from './PreferencesScreen';
import { ProfileScreen } from './ProfileScreen';
import { ProfileConnectionsScreen } from './ProfileConnectionsScreen';
import { ProfileListsScreen } from './ProfileListsScreen';
import { ProfilePostsScreen } from './ProfilePostsScreen';
import { SafetyTrustScreen } from './SafetyTrustScreen';
import { SavedPostsScreen } from './SavedPostsScreen';
import { SettingsScreen } from './SettingsScreen';
import { AccessScreen } from './AccessScreen';
import { PersonalizationScreen } from './PersonalizationScreen';
import { StoryViewerScreen } from './StoryViewerScreen';
import { UsernameScreen } from './UsernameScreen';
import { MessagesScreen } from './MessagesScreen';

export const ScreenRouter: React.FC = () => {
  const { view, auth, onboardingCompleted, userProfile, ageGroup } = useApp();

  if (!auth.loggedIn) {
    return <AccessScreen />;
  }

  if (!ageGroup) {
    return <AgeGateScreen />;
  }

  if (!auth.isAnonymous && !userProfile) {
    return <UsernameScreen />;
  }

  if (!onboardingCompleted) {
    return <PersonalizationScreen />;
  }

  switch (view) {
    case 'home':
      return <HomeScreen />;
    case 'discover':
      return <DiscoverScreen />;
    case 'create':
      return <CreateScreen />;
    case 'messages':
      return <MessagesScreen />;
    case 'profile':
      return <ProfileScreen />;
    case 'preferences':
      return <PreferencesScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'activity':
      return <ActivityScreen />;
    case 'safety':
      return <SafetyTrustScreen />;
    case 'moderation':
      return <ModerationQueueScreen />;
    case 'profilePosts':
      return <ProfilePostsScreen />;
    case 'profileConnections':
      return <ProfileConnectionsScreen />;
    case 'profileLists':
      return <ProfileListsScreen />;
    case 'savedPosts':
      return <SavedPostsScreen />;
    case 'storyViewer':
      return <StoryViewerScreen />;
    case 'chatThread':
      return <ChatThreadScreen />;
    default:
      return <HomeScreen />;
  }
};

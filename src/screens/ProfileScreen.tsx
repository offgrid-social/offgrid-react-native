import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { BugReportModal } from '../components/BugReportModal';
import { ReportModal } from '../components/ReportModal';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';
import { ReportService } from '../services/ReportService';

export const ProfileScreen: React.FC = () => {
  const {
    auth,
    setView,
    logout,
    userProfile,
    updateUserProfile,
    allPosts,
    profileNotes,
    setProfileNote,
    connectionInsights,
    setConnectionInsight,
    quietMode,
  } = useApp();
  const [tab, setTab] = useState<'text' | 'images' | 'videos' | 'likes'>('text');
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(userProfile?.displayName ?? '');
  const [username, setUsername] = useState(userProfile?.username ?? '');
  const [bio, setBio] = useState(userProfile?.bio ?? '');
  const [links, setLinks] = useState(userProfile?.links.join(', ') ?? '');
  const [error, setError] = useState('');
  const usernamePattern = /^[a-z0-9_]{3,20}$/;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { animatedStyle } = useEntranceAnimation();
  const [showReport, setShowReport] = useState(false);
  const [showBugReport, setShowBugReport] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');

  const profileId = userProfile?.id ?? 'you';
  const noteValue = profileNotes[profileId] ?? '';

  useEffect(() => {
    setNoteDraft(noteValue);
  }, [noteValue]);

  useEffect(() => {
    if (!profileId || connectionInsights[profileId]) return;
    setConnectionInsight(profileId, {
      userId: profileId,
      connectedSince: '2025-06-01T00:00:00.000Z',
      lastInteraction: '2026-01-10T18:20:00.000Z',
      sharedConnections: 12,
    });
  }, [connectionInsights, profileId, setConnectionInsight]);

  const authoredPosts = useMemo(
    () => allPosts.filter((post) => post.authorId === profileId),
    [allPosts, profileId]
  );

  const likedPosts = useMemo(
    () => allPosts.filter((post) => post.likedBy.includes(profileId)),
    [allPosts, profileId]
  );

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Animated.View style={animatedStyle}>
      <GlassPanel style={styles.header}>
        <View style={styles.avatar} />
        <Text style={styles.name}>{userProfile?.displayName ?? 'You'}</Text>
        <Text style={styles.handle}>@{userProfile?.username ?? 'you'}</Text>
        <Text style={styles.bio}>
          {userProfile?.bio || 'Quiet observer. Minimal signal. Offline-first mind.'}
        </Text>
        {userProfile?.links.length ? (
          <View style={styles.linkRow}>
            {userProfile.links.map((link) => (
              <Text key={link} style={styles.linkText}>
                {link}
              </Text>
            ))}
          </View>
        ) : null}
        <Text style={styles.meta}>
          {auth.isAnonymous ? 'Anonymous access' : 'Signed in'}
        </Text>
        <View style={styles.headerActions}>
          <Pressable style={styles.editButton} onPress={() => setEditing(true)}>
            <Text style={styles.editText}>Edit profile</Text>
          </Pressable>
          <Pressable style={styles.moreButton} onPress={() => setShowBugReport(true)}>
            <Text style={styles.editText}>...</Text>
          </Pressable>
        </View>
      </GlassPanel>
      <View style={styles.statsRow}>
        <Pressable style={styles.statWrap} onPress={() => setView('profilePosts')}>
          <GlassPanel style={styles.statCard}>
            <Text style={styles.statNumber}>
              {quietMode.hideCounts ? '--' : authoredPosts.length}
            </Text>
            <Text style={styles.statLabel}>Posts</Text>
          </GlassPanel>
        </Pressable>
        <Pressable style={styles.statWrap} onPress={() => setView('profileConnections')}>
          <GlassPanel style={styles.statCard}>
            <Text style={styles.statNumber}>{quietMode.hideCounts ? '--' : 146}</Text>
            <Text style={styles.statLabel}>Connections</Text>
          </GlassPanel>
        </Pressable>
        <Pressable style={styles.statWrap} onPress={() => setView('profileLists')}>
          <GlassPanel style={styles.statCard}>
            <Text style={styles.statNumber}>{quietMode.hideCounts ? '--' : 8}</Text>
            <Text style={styles.statLabel}>Lists</Text>
          </GlassPanel>
        </Pressable>
      </View>
      <GlassPanel style={styles.tabs}>
        {(['text', 'images', 'videos', 'likes'] as const).map((item) => (
          <Pressable key={item} style={styles.tab} onPress={() => setTab(item)}>
            <Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text>
          </Pressable>
        ))}
      </GlassPanel>

      <GlassPanel style={styles.tabContent}>
        {tab === 'images' ? (
          <View style={styles.grid}>
            {authoredPosts.filter((post) => post.type === 'image').length ? (
              authoredPosts
                .filter((post) => post.type === 'image')
                .map((post) => (
                  <Pressable
                    key={post.id}
                    style={styles.gridItem}
                    onPress={() => setSelectedImage(post.id)}
                  />
                ))
            ) : (
              <Text style={styles.tabEmpty}>No images yet.</Text>
            )}
          </View>
        ) : tab === 'videos' ? (
          <View>
            {authoredPosts.filter((post) => post.type === 'video').length ? (
              authoredPosts
                .filter((post) => post.type === 'video')
                .map((post) => (
                  <Text key={post.id} style={styles.tabEmpty}>
                    {post.body}
                  </Text>
                ))
            ) : (
              <Text style={styles.tabEmpty}>No videos yet.</Text>
            )}
          </View>
        ) : tab === 'likes' ? (
          <View>
            {likedPosts.length ? (
              likedPosts.map((post) => (
                <Text key={post.id} style={styles.tabEmpty}>
                  {post.body}
                </Text>
              ))
            ) : (
              <Text style={styles.tabEmpty}>No likes yet.</Text>
            )}
          </View>
        ) : (
          <View>
            {authoredPosts.filter((post) => post.type === 'text').length ? (
              authoredPosts
                .filter((post) => post.type === 'text')
                .map((post) => (
                  <Text key={post.id} style={styles.tabEmpty}>
                    {post.body}
                  </Text>
                ))
            ) : (
              <Text style={styles.tabEmpty}>No text posts yet.</Text>
            )}
          </View>
        )}
      </GlassPanel>
      <GlassPanel style={styles.settings}>
        <Pressable style={styles.settingsRow} onPress={() => setView('savedPosts')}>
          <Text style={styles.settingsText}>Saved posts</Text>
          <Text style={styles.settingsHint}>Private bookmarks</Text>
        </Pressable>
        <Pressable style={styles.settingsRow} onPress={() => setView('preferences')}>
          <Text style={styles.settingsText}>Preferences</Text>
          <Text style={styles.settingsHint}>Edit interests</Text>
        </Pressable>
        <Pressable style={styles.settingsRow} onPress={() => setView('settings')}>
          <Text style={styles.settingsText}>Settings</Text>
          <Text style={styles.settingsHint}>Privacy, notifications</Text>
        </Pressable>
        <Pressable style={styles.settingsRow} onPress={() => setShowReport(true)}>
          <Text style={styles.settingsText}>Report profile</Text>
          <Text style={styles.settingsHint}>Mock report</Text>
        </Pressable>
        <Pressable style={styles.settingsRow} onPress={() => setShowBugReport(true)}>
          <Text style={styles.settingsText}>Report a bug</Text>
          <Text style={styles.settingsHint}>Share feedback</Text>
        </Pressable>
        <Pressable style={styles.settingsRow} onPress={logout}>
          <Text style={styles.settingsText}>Log out</Text>
          <Text style={styles.settingsHint}>Return to access screen</Text>
        </Pressable>
      </GlassPanel>

      <GlassPanel style={styles.notesPanel}>
        <Text style={styles.settingsText}>Private notes</Text>
        <Text style={styles.settingsHint}>Only visible to you</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Add a private note"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={noteDraft}
          onChangeText={setNoteDraft}
          onBlur={() => setProfileNote(profileId, noteDraft.trim())}
        />
      </GlassPanel>

      <GlassPanel style={styles.notesPanel}>
        <Text style={styles.settingsText}>Connection insights</Text>
        <Text style={styles.settingsHint}>
          Connected since: {connectionInsights[profileId]?.connectedSince.split('T')[0] ?? '---'}
        </Text>
        <Text style={styles.settingsHint}>
          Last interaction: {connectionInsights[profileId]?.lastInteraction.split('T')[0] ?? '---'}
        </Text>
        <Text style={styles.settingsHint}>
          Shared connections: {connectionInsights[profileId]?.sharedConnections ?? 0}
        </Text>
      </GlassPanel>

      <GlassPanel style={styles.privacyPanel}>
        <Text style={styles.settingsText}>Privacy</Text>
        <Pressable
          style={styles.settingsRow}
          onPress={() => {
            if (!userProfile) return;
            updateUserProfile({
              ...userProfile,
              privacy: { ...userProfile.privacy, privateAccount: !userProfile.privacy.privateAccount },
            });
          }}
        >
          <Text style={styles.settingsHint}>
            Private account: {userProfile?.privacy.privateAccount ? 'On' : 'Off'}
          </Text>
        </Pressable>
        <Pressable
          style={styles.settingsRow}
          onPress={() => {
            if (!userProfile) return;
            updateUserProfile({
              ...userProfile,
              privacy: { ...userProfile.privacy, showActivity: !userProfile.privacy.showActivity },
            });
          }}
        >
          <Text style={styles.settingsHint}>
            Show activity: {userProfile?.privacy.showActivity ? 'On' : 'Off'}
          </Text>
        </Pressable>
        <Pressable
          style={styles.settingsRow}
          onPress={() => {
            if (!userProfile) return;
            const next =
              userProfile.privacy.allowDMs === 'everyone'
                ? 'following'
                : userProfile.privacy.allowDMs === 'following'
                ? 'no_one'
                : 'everyone';
            updateUserProfile({
              ...userProfile,
              privacy: { ...userProfile.privacy, allowDMs: next },
            });
          }}
        >
          <Text style={styles.settingsHint}>
            Allow DMs: {userProfile?.privacy.allowDMs.replace('_', ' ')}
          </Text>
        </Pressable>
      </GlassPanel>
      </Animated.View>
      </ScrollView>

      <Modal transparent visible={editing} animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modal}>
            <Text style={styles.modalTitle}>Edit profile</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Display name"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={displayName}
              onChangeText={setDisplayName}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Username"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={username}
              onChangeText={(value) => setUsername(value.toLowerCase())}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Bio"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={bio}
              onChangeText={setBio}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Links (comma separated)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={links}
              onChangeText={setLinks}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={() => setEditing(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={async () => {
                  if (!userProfile) return;
                  const nextUsername = username.trim();
                  if (nextUsername && !usernamePattern.test(nextUsername)) {
                    setError('Username must be lowercase (3-20, no spaces).');
                    return;
                  }
                  if (nextUsername && nextUsername !== userProfile.username) {
                    const { UserService } = await import('../services/UserService');
                    const available = await UserService.isUsernameAvailable(nextUsername);
                    if (!available) {
                      setError('Username is taken.');
                      return;
                    }
                  }
                  await updateUserProfile(
                    {
                      ...userProfile,
                      displayName: displayName.trim() || userProfile.displayName,
                      username: nextUsername || userProfile.username,
                      bio: bio.trim(),
                      links: links
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean),
                    },
                    userProfile.username
                  );
                  setError('');
                  setEditing(false);
                }}
              >
                <Text style={styles.modalButtonText}>Save</Text>
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      </Modal>
      <Modal transparent visible={!!selectedImage} animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modal}>
            <Text style={styles.modalTitle}>Post detail</Text>
            <View style={styles.detailImage} />
            <Pressable style={styles.modalButton} onPress={() => setSelectedImage(null)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </GlassPanel>
        </View>
      </Modal>
      <ReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={async (reason, note) => {
          if (!userProfile) return;
          await ReportService.submitReport({
            contentType: 'profile',
            contentId: userProfile.id,
            reason,
            note,
          });
          setShowReport(false);
        }}
        title="Report profile"
      />
      <BugReportModal
        visible={showBugReport}
        onClose={() => setShowBugReport(false)}
        contextLabel="Profile"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 110,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  scroll: {
    paddingBottom: 20,
  },
  header: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 12,
  },
  name: {
    color: '#f2f2f2',
    fontSize: 18,
    letterSpacing: 0.6,
  },
  handle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  bio: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    lineHeight: 18,
  },
  linkRow: {
    marginTop: 10,
  },
  linkText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginBottom: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statWrap: {
    flex: 1,
    marginHorizontal: 4,
  },
  statCard: {
    padding: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  statNumber: {
    color: '#f2f2f2',
    fontSize: 16,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 4,
  },
  meta: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginTop: 10,
  },
  editButton: {
    marginTop: 12,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  moreButton: {
    marginLeft: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  editText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  tabs: {
    marginTop: 14,
    paddingVertical: 10,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  tabTextActive: {
    color: '#f2f2f2',
  },
  tabContent: {
    marginTop: 12,
    padding: 16,
    borderRadius: 16,
  },
  tabEmpty: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridItem: {
    width: '30%',
    height: 80,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginRight: '3.3%',
    marginBottom: 10,
  },
  detailImage: {
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  settings: {
    marginTop: 18,
    padding: 16,
    borderRadius: 18,
  },
  notesPanel: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#f2f2f2',
    fontSize: 12,
    marginTop: 10,
  },
  settingsRow: {
    paddingVertical: 10,
  },
  settingsText: {
    color: '#f2f2f2',
    fontSize: 13,
  },
  settingsHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginTop: 4,
  },
  privacyPanel: {
    marginTop: 12,
    padding: 16,
    borderRadius: 18,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    padding: 16,
    borderRadius: 20,
    width: '85%',
  },
  modalTitle: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f2f2f2',
    fontSize: 12,
    marginBottom: 10,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  modalButtonText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  error: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginBottom: 8,
  },
});

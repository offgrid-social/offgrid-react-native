import { BlurView } from 'expo-blur';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { FeedCard } from '../components/FeedCard';
import { GlassPanel } from '../components/GlassPanel';
import { LikeButton } from '../components/LikeButton';
import { NetworkErrorState } from '../components/NetworkErrorState';
import { StoryRow } from '../components/StoryRow';
import { useApp } from '../hooks/useApp';
import type { FeedType, Post } from '../types';
import {
  IconBookmark,
  IconComment,
  IconMute,
  IconPause,
  IconPlay,
  IconShare,
} from '../components/Icons';
import { ContentFilterService } from '../services/ContentFilterService';
import { ReportService } from '../services/ReportService';
import { BugReportModal } from '../components/BugReportModal';

const feedLabels: Record<FeedType, string> = {
  text: 'Text',
  image: 'Images',
  video: 'Video',
};

export const HomeScreen: React.FC = () => {
  const {
    feedType,
    setFeedType,
    posts,
    refreshFeed,
    stories,
    loadStories,
    toggleLike,
    toggleBookmark,
    addComment,
    addReply,
    sharePost,
    ageGroup,
    safetySettings,
    showToast,
    feedError,
    quietMode,
    likePending,
  } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [videoPaused, setVideoPaused] = useState(false);
  const [videoMuted, setVideoMuted] = useState(false);
  const [lastTap, setLastTap] = useState(0);
  const [imageCommentPost, setImageCommentPost] = useState<Post | null>(null);
  const [imageCommentText, setImageCommentText] = useState('');
  const [imageReplyTo, setImageReplyTo] = useState<string | null>(null);
  const [imageReplyText, setImageReplyText] = useState('');
  const [videoCommentPost, setVideoCommentPost] = useState<Post | null>(null);
  const [videoCommentText, setVideoCommentText] = useState('');
  const [revealedImages, setRevealedImages] = useState<Record<string, boolean>>({});
  const [revealedVideos, setRevealedVideos] = useState<Record<string, boolean>>({});
  const [showBugReport, setShowBugReport] = useState(false);
  const feedOpacity = useRef(new Animated.Value(0)).current;
  const feedTranslate = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    refreshFeed();
    loadStories();
  }, [feedType, refreshFeed, loadStories]);

  useEffect(() => {
    feedOpacity.setValue(0);
    feedTranslate.setValue(12);
    Animated.parallel([
      Animated.timing(feedOpacity, {
        toValue: 1,
        duration: 320,
        useNativeDriver: true,
      }),
      Animated.timing(feedTranslate, {
        toValue: 0,
        duration: 320,
        useNativeDriver: true,
      }),
    ]).start();
  }, [feedType, feedOpacity, feedTranslate]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshFeed();
    setRefreshing(false);
  };

  const segmented = useMemo(
    () => (
      <GlassPanel style={styles.segmented}>
        {(['text', 'image', 'video'] as FeedType[]).map((type) => (
          <Pressable key={type} style={styles.segmentButton} onPress={() => setFeedType(type)}>
            <Text style={[styles.segmentText, feedType === type && styles.segmentTextActive]}>
              {feedLabels[type]}
            </Text>
          </Pressable>
        ))}
      </GlassPanel>
    ),
    [feedType, setFeedType]
  );

  const header = (
    <View>
      {segmented}
      {(feedType === 'text' || feedType === 'image') && stories.length ? (
        <StoryRow stories={stories} />
      ) : null}
    </View>
  );

  const errorHeader = (
    <View style={styles.errorHeader}>
      {segmented}
      {(feedType === 'text' || feedType === 'image') && stories.length ? (
        <StoryRow stories={stories} />
      ) : null}
    </View>
  );

  if (feedError) {
    return (
      <View style={styles.screen}>
        <NetworkErrorState
          variant={feedType}
          onRetry={refreshFeed}
          onReportBug={() => setShowBugReport(true)}
          header={errorHeader}
        />
        <BugReportModal
          visible={showBugReport}
          onClose={() => setShowBugReport(false)}
          contextLabel="Home feed"
          errorState={feedError}
        />
      </View>
    );
  }

  if (feedType === 'image') {
    return (
      <View style={styles.screen}>
        <Animated.View style={{ flex: 1, opacity: feedOpacity, transform: [{ translateY: feedTranslate }] }}>
          <FlatList
            data={posts}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            ListHeaderComponent={header}
            renderItem={({ item }) => (
              <View style={styles.imageCard}>
                <Pressable
                  style={styles.imageMedia}
                  onPress={() => {
                    const now = Date.now();
                    if (now - lastTap < 280) {
                      toggleLike(item.id);
                    }
                    setLastTap(now);
                  }}
                >
                  {ContentFilterService.shouldBlur(item.isNSFW, ageGroup, safetySettings) &&
                  !revealedImages[item.id] ? (
                    <BlurView intensity={30} tint="dark" style={styles.mediaOverlay}>
                      <Text style={styles.mediaText}>Sensitive content</Text>
                      {ContentFilterService.canReveal(item.isNSFW, ageGroup, safetySettings) ? (
                        <Pressable
                          style={styles.mediaButton}
                          onPress={() =>
                            setRevealedImages((prev) => ({ ...prev, [item.id]: true }))
                          }
                        >
                          <Text style={styles.mediaButtonText}>Tap to reveal</Text>
                        </Pressable>
                      ) : null}
                    </BlurView>
                  ) : null}
                  {item.liked ? (
                    <View style={styles.imageLike}>
                      <LikeButton
                        liked
                        loading={!!likePending[item.id]}
                        count={item.likes}
                        hideCount
                        onPress={() => toggleLike(item.id)}
                      />
                    </View>
                  ) : null}
                </Pressable>
                <View style={styles.imageActions}>
                  <View style={styles.imageAction}>
                    <LikeButton
                      liked={item.liked}
                      loading={!!likePending[item.id]}
                      count={item.likes}
                      hideCount={quietMode.hideLikes}
                      onPress={() => toggleLike(item.id)}
                    />
                  </View>
                  <Pressable onPress={() => setImageCommentPost(item)} style={styles.imageAction}>
                    <IconComment />
                    {quietMode.hideCounts ? null : (
                      <Text style={styles.imageActionText}>{item.comments}</Text>
                    )}
                  </Pressable>
                  <Pressable onPress={() => toggleBookmark(item.id)} style={styles.imageAction}>
                    <IconBookmark active={item.bookmarked} />
                  </Pressable>
                </View>
                <Text style={styles.imageCaption}>{item.body}</Text>
              </View>
            )}
            contentContainerStyle={styles.imageList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>No images yet.</Text>}
          />
        </Animated.View>
        <Modal transparent visible={!!imageCommentPost} animationType="slide">
          <View style={styles.modalBackdrop}>
            <GlassPanel style={styles.commentSheet}>
              <Text style={styles.sheetTitle}>Comments</Text>
              {imageCommentPost?.commentsList.length ? (
                imageCommentPost.commentsList.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentBody}>{comment.body}</Text>
                    {comment.replies.map((reply) => (
                      <View key={reply.id} style={styles.replyRow}>
                        <Text style={styles.replyAuthor}>{reply.author}</Text>
                        <Text style={styles.replyBody}>{reply.body}</Text>
                      </View>
                    ))}
                    <View style={styles.commentActions}>
                      <Pressable
                        style={styles.replyButton}
                        onPress={() => setImageReplyTo(comment.id)}
                      >
                        <Text style={styles.replyText}>Reply</Text>
                      </Pressable>
                      <Pressable
                        style={styles.replyButton}
                        onPress={async () => {
                          await ReportService.submitReport({
                            contentType: 'comment',
                            contentId: comment.id,
                            reason: 'other',
                            note: '',
                          });
                          showToast('Report submitted');
                        }}
                      >
                        <Text style={styles.replyText}>Report</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.empty}>No comments yet.</Text>
              )}
              {imageReplyTo ? (
                <View style={styles.commentRow}>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Write a reply..."
                    placeholderTextColor="rgba(255, 255, 255, 0.4)"
                    value={imageReplyText}
                    onChangeText={setImageReplyText}
                  />
                  <Pressable
                    style={styles.commentSend}
                    onPress={() => {
                      if (imageCommentPost && imageReplyText.trim()) {
                        addReply(imageCommentPost.id, imageReplyTo, imageReplyText.trim());
                        setImageReplyText('');
                        setImageReplyTo(null);
                      }
                    }}
                  >
                    <Text style={styles.commentSendText}>Reply</Text>
                  </Pressable>
                </View>
              ) : null}
              <View style={styles.commentRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={imageCommentText}
                  onChangeText={setImageCommentText}
                />
                <Pressable
                  style={styles.commentSend}
                  onPress={() => {
                    if (imageCommentPost && imageCommentText.trim()) {
                      addComment(imageCommentPost.id, imageCommentText.trim());
                      setImageCommentText('');
                    }
                  }}
                >
                  <Text style={styles.commentSendText}>Send</Text>
                </Pressable>
              </View>
              <Pressable style={styles.sheetClose} onPress={() => setImageCommentPost(null)}>
                <Text style={styles.sheetCloseText}>Close</Text>
              </Pressable>
            </GlassPanel>
          </View>
        </Modal>
      </View>
    );
  }

  if (feedType === 'video') {
    return (
      <View style={styles.screen}>
        <Animated.View style={{ flex: 1, opacity: feedOpacity, transform: [{ translateY: feedTranslate }] }}>
          <FlatList
            data={posts}
            pagingEnabled
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.videoCard}>
                <Pressable
                  style={styles.videoMedia}
                  onPress={() => setVideoPaused((prev) => !prev)}
                >
                  {ContentFilterService.shouldBlur(item.isNSFW, ageGroup, safetySettings) &&
                  !revealedVideos[item.id] ? (
                    <BlurView intensity={30} tint="dark" style={styles.mediaOverlay}>
                      <Text style={styles.mediaText}>Sensitive content</Text>
                      {ContentFilterService.canReveal(item.isNSFW, ageGroup, safetySettings) ? (
                        <Pressable
                          style={styles.mediaButton}
                          onPress={() =>
                            setRevealedVideos((prev) => ({ ...prev, [item.id]: true }))
                          }
                        >
                          <Text style={styles.mediaButtonText}>Tap to reveal</Text>
                        </Pressable>
                      ) : null}
                    </BlurView>
                  ) : null}
                  <View style={styles.videoControls}>
                    {videoPaused ? <IconPlay /> : <IconPause />}
                    <Pressable onPress={() => setVideoMuted((prev) => !prev)}>
                      <IconMute active={!videoMuted} />
                    </Pressable>
                  </View>
                </Pressable>
                <View style={styles.videoOverlay}>
                  <Text style={styles.videoUser}>{item.handle}</Text>
                  <Text style={styles.videoCaption}>{item.body}</Text>
                  <View style={styles.videoActions}>
                    <View style={styles.videoAction}>
                      <LikeButton
                        liked={item.liked}
                        loading={!!likePending[item.id]}
                        count={item.likes}
                        hideCount={quietMode.hideLikes}
                        onPress={() => toggleLike(item.id)}
                      />
                    </View>
                    <Pressable
                      style={styles.videoAction}
                      onPress={() => setVideoCommentPost(item)}
                    >
                      <IconComment />
                      {quietMode.hideCounts ? null : (
                        <Text style={styles.videoActionText}>{item.comments}</Text>
                      )}
                    </Pressable>
                    <Pressable style={styles.videoAction} onPress={() => sharePost(item.id)}>
                      <IconShare />
                    </Pressable>
                  </View>
                </View>
              </View>
            )}
            contentContainerStyle={styles.videoList}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            ListEmptyComponent={<Text style={styles.empty}>No videos yet.</Text>}
          />
        </Animated.View>
        <View style={styles.videoHeader}>{segmented}</View>
        <Modal transparent visible={!!videoCommentPost} animationType="slide">
          <View style={styles.modalBackdrop}>
            <GlassPanel style={styles.commentSheet}>
              <Text style={styles.sheetTitle}>Comments</Text>
              {videoCommentPost?.commentsList.length ? (
                videoCommentPost.commentsList.map((comment) => (
                  <View key={comment.id} style={styles.commentItem}>
                    <Text style={styles.commentAuthor}>{comment.author}</Text>
                    <Text style={styles.commentBody}>{comment.body}</Text>
                    <View style={styles.commentActions}>
                      <Pressable
                        style={styles.replyButton}
                        onPress={async () => {
                          await ReportService.submitReport({
                            contentType: 'comment',
                            contentId: comment.id,
                            reason: 'other',
                            note: '',
                          });
                          showToast('Report submitted');
                        }}
                      >
                        <Text style={styles.replyText}>Report</Text>
                      </Pressable>
                    </View>
                  </View>
                ))
              ) : (
                <Text style={styles.empty}>No comments yet.</Text>
              )}
              <View style={styles.commentRow}>
                <TextInput
                  style={styles.commentInput}
                  placeholder="Write a comment..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={videoCommentText}
                  onChangeText={setVideoCommentText}
                />
                <Pressable
                  style={styles.commentSend}
                  onPress={() => {
                    if (videoCommentPost && videoCommentText.trim()) {
                      addComment(videoCommentPost.id, videoCommentText.trim());
                      setVideoCommentText('');
                    }
                  }}
                >
                  <Text style={styles.commentSendText}>Send</Text>
                </Pressable>
              </View>
              <Pressable style={styles.sheetClose} onPress={() => setVideoCommentPost(null)}>
                <Text style={styles.sheetCloseText}>Close</Text>
              </Pressable>
            </GlassPanel>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <Animated.View style={{ flex: 1, opacity: feedOpacity, transform: [{ translateY: feedTranslate }] }}>
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item }: { item: Post }) => <FeedCard post={item} />}
          contentContainerStyle={styles.list}
          ListHeaderComponent={header}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListEmptyComponent={<Text style={styles.empty}>No posts yet. Create one.</Text>}
        />
      </Animated.View>
      <BugReportModal
        visible={showBugReport}
        onClose={() => setShowBugReport(false)}
        contextLabel="Home feed"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#040404',
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 96,
    paddingBottom: 140,
  },
  segmented: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 18,
    marginBottom: 12,
  },
  errorHeader: {
    paddingTop: 96,
    paddingHorizontal: 20,
  },
  segmentButton: {
    flex: 1,
    alignItems: 'center',
  },
  segmentText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    letterSpacing: 0.4,
  },
  segmentTextActive: {
    color: '#f2f2f2',
  },
  empty: {
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    marginTop: 40,
  },
  imageList: {
    paddingTop: 96,
    paddingBottom: 140,
    paddingHorizontal: 20,
  },
  imageCard: {
    width: 300,
    marginRight: 16,
  },
  imageMedia: {
    height: 320,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageLike: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  imageCaption: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  imageActions: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  imageAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 14,
  },
  imageActionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginLeft: 6,
  },
  videoList: {
    paddingTop: 96,
    paddingBottom: 140,
  },
  videoCard: {
    height: 520,
    marginHorizontal: 20,
    marginBottom: 18,
  },
  videoMedia: {
    flex: 1,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  videoControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 120,
  },
  videoOverlay: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 20,
  },
  videoUser: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 6,
  },
  videoCaption: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  videoActions: {
    flexDirection: 'row',
    marginTop: 10,
  },
  videoAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  videoActionText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginLeft: 6,
  },
  videoHeader: {
    position: 'absolute',
    top: 80,
    left: 20,
    right: 20,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  commentSheet: {
    padding: 16,
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    maxHeight: '70%',
  },
  sheetTitle: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 10,
  },
  commentItem: {
    marginBottom: 10,
  },
  commentAuthor: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  commentBody: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    marginTop: 4,
  },
  replyRow: {
    marginTop: 6,
    marginLeft: 10,
  },
  replyAuthor: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  replyBody: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 2,
  },
  replyButton: {
    marginTop: 6,
  },
  replyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#f2f2f2',
    fontSize: 12,
    marginRight: 10,
  },
  commentSend: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  commentSendText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  sheetClose: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  sheetCloseText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  mediaText: {
    color: '#f2f2f2',
    fontSize: 12,
    marginBottom: 8,
  },
  mediaButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  mediaButtonText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
});

import { BlurView } from 'expo-blur';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import type { Post } from '../types';
import { GlassPanel } from './GlassPanel';
import { LikeButton } from './LikeButton';
import { IconBookmark, IconComment, IconReport, IconRepost, IconShare } from './Icons';
import { useApp } from '../hooks/useApp';
import { ContentFilterService } from '../services/ContentFilterService';
import { ReportModal } from './ReportModal';
import { ReportService } from '../services/ReportService';

type FeedCardProps = {
  post: Post;
};

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return date.toLocaleString();
};

export const FeedCard: React.FC<FeedCardProps> = ({ post }) => {
  const {
    addComment,
    sharePost,
    toggleBookmark,
    repost,
    addReply,
    setView,
    reportPost,
    ageGroup,
    safetySettings,
    quietMode,
    likePending,
    toggleLike,
  } = useApp();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportTarget, setReportTarget] = useState<'post' | 'comment'>('post');
  const [reportId, setReportId] = useState<string>('');
  const [showHistory, setShowHistory] = useState(false);

  const shouldBlur = ContentFilterService.shouldBlur(post.isNSFW, ageGroup, safetySettings);
  const canReveal = ContentFilterService.canReveal(post.isNSFW, ageGroup, safetySettings);
  const hideMedia = shouldBlur && !revealed;

  const handleComment = () => {
    if (!comment.trim()) return;
    addComment(post.id, comment.trim());
    setComment('');
  };

  const handleReply = () => {
    if (!replyTo || !replyText.trim()) return;
    addReply(post.id, replyTo, replyText.trim());
    setReplyText('');
    setReplyTo(null);
  };

  return (
    <GlassPanel style={styles.card}>
      <View style={styles.header}>
        <Pressable onPress={() => setView('profile')}>
          <Text style={styles.author}>{post.author}</Text>
          <Text style={styles.handle}>{post.handle}</Text>
        </Pressable>
        <Text style={styles.time}>{formatTimestamp(post.createdAt)}</Text>
      </View>
      <Text style={styles.body}>{post.body}</Text>
      {post.media ? (
        <View style={styles.imagePlaceholder}>
          {hideMedia ? (
            <BlurView intensity={30} tint="dark" style={styles.blurOverlay}>
              <Text style={styles.nsfwText}>Sensitive content</Text>
              {canReveal ? (
                <Pressable style={styles.nsfwButton} onPress={() => setRevealed(true)}>
                  <Text style={styles.nsfwButtonText}>Tap to reveal</Text>
                </Pressable>
              ) : null}
            </BlurView>
          ) : null}
        </View>
      ) : null}
      <View style={styles.actionsRow}>
        <View style={styles.action}>
          <LikeButton
            liked={post.liked}
            loading={!!likePending[post.id]}
            count={post.likes}
            hideCount={quietMode.hideLikes}
            onPress={() => toggleLike(post.id)}
          />
        </View>
        <Pressable style={styles.action} onPress={() => setShowComments(true)}>
          <IconComment />
          {quietMode.hideCounts ? null : <Text style={styles.actionText}>{post.comments}</Text>}
        </Pressable>
        <Pressable style={styles.action} onPress={() => repost(post.id)}>
          <IconRepost />
          {quietMode.hideCounts ? null : <Text style={styles.actionText}>{post.reposts}</Text>}
        </Pressable>
        <Pressable style={styles.action} onPress={() => toggleBookmark(post.id)}>
          <IconBookmark active={post.bookmarked} />
        </Pressable>
        <Pressable style={styles.action} onPress={() => sharePost(post.id)}>
          <IconShare />
          {quietMode.hideCounts ? null : <Text style={styles.actionText}>{post.shares}</Text>}
        </Pressable>
        <Pressable
          style={styles.action}
          onPress={() => {
            setReportTarget('post');
            setReportId(post.id);
            setShowReport(true);
          }}
        >
          <IconReport />
        </Pressable>
      </View>
      <View style={styles.commentRow}>
        <TextInput
          style={styles.commentInput}
          placeholder="Leave a comment..."
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={comment}
          onChangeText={setComment}
        />
        <Pressable style={styles.commentButton} onPress={handleComment}>
          <Text style={styles.commentButtonText}>Send</Text>
        </Pressable>
      </View>

      <Modal transparent visible={showComments} animationType="slide">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.commentSheet}>
            <Text style={styles.sheetTitle}>Comments</Text>
            {post.commentsList.length === 0 ? (
              <Text style={styles.emptyText}>No comments yet. Start the thread.</Text>
            ) : null}
            {post.commentsList.map((item) => (
              <View key={item.id} style={styles.commentItem}>
                <Text style={styles.commentAuthor}>{item.author}</Text>
                <Text style={styles.commentBody}>{item.body}</Text>
                {item.replies.map((reply) => (
                  <View key={reply.id} style={styles.replyRow}>
                    <Text style={styles.replyAuthor}>{reply.author}</Text>
                    <Text style={styles.replyBody}>{reply.body}</Text>
                  </View>
                ))}
                <View style={styles.commentActions}>
                  <Pressable style={styles.replyButton} onPress={() => setReplyTo(item.id)}>
                    <Text style={styles.replyText}>Reply</Text>
                  </Pressable>
                  <Pressable
                    style={styles.replyButton}
                    onPress={() => {
                      setReportTarget('comment');
                      setReportId(item.id);
                      setShowReport(true);
                    }}
                  >
                    <Text style={styles.replyText}>Report</Text>
                  </Pressable>
                </View>
              </View>
            ))}
            {replyTo ? (
              <View style={styles.replyInputRow}>
                <TextInput
                  style={styles.replyInput}
                  placeholder="Write a reply..."
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  value={replyText}
                  onChangeText={setReplyText}
                />
                <Pressable style={styles.replySend} onPress={handleReply}>
                  <Text style={styles.replySendText}>Send</Text>
                </Pressable>
              </View>
            ) : null}
            <View style={styles.sheetFooter}>
              <Pressable
                style={styles.sheetButton}
                onPress={() => setShowComments(false)}
              >
                <Text style={styles.sheetButtonText}>Close</Text>
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      </Modal>
      <Modal transparent visible={showHistory} animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.commentSheet}>
            <Text style={styles.sheetTitle}>Edit history</Text>
            {post.editHistory.length ? (
              post.editHistory.map((item, index) => (
                <View key={`${post.id}_${index}`} style={styles.commentItem}>
                  <Text style={styles.commentBody}>{item.body}</Text>
                  <Text style={styles.time}>{formatTimestamp(item.editedAt)}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.emptyText}>No edits yet.</Text>
            )}
            <View style={styles.sheetFooter}>
              <Pressable style={styles.sheetButton} onPress={() => setShowHistory(false)}>
                <Text style={styles.sheetButtonText}>Close</Text>
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      </Modal>
      <ReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={async (reason, note) => {
          await ReportService.submitReport({
            contentType: reportTarget,
            contentId: reportId,
            reason,
            note,
          });
          await reportPost(post.id);
        }}
        title="Report"
      />
      {post.editHistory.length ? (
        <Pressable style={styles.editedBadge} onPress={() => setShowHistory(true)}>
          <Text style={styles.editedText}>Edited</Text>
        </Pressable>
      ) : null}
    </GlassPanel>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 18,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  author: {
    color: '#f2f2f2',
    fontSize: 16,
    letterSpacing: 0.5,
  },
  handle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  body: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  imagePlaceholder: {
    height: 180,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    marginBottom: 14,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nsfwText: {
    color: '#f2f2f2',
    fontSize: 12,
    marginBottom: 8,
  },
  nsfwButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  nsfwButtonText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  actionText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  commentInput: {
    flex: 1,
    color: '#f2f2f2',
    fontSize: 13,
  },
  commentButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  commentButtonText: {
    color: '#f2f2f2',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  commentSheet: {
    padding: 16,
    borderRadius: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    maxHeight: '70%',
  },
  sheetTitle: {
    color: '#f2f2f2',
    fontSize: 14,
    marginBottom: 12,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 12,
  },
  commentItem: {
    marginBottom: 12,
  },
  commentAuthor: {
    color: '#f2f2f2',
    fontSize: 12,
  },
  commentBody: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    marginTop: 4,
  },
  replyRow: {
    marginTop: 6,
    marginLeft: 12,
  },
  replyAuthor: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
  },
  replyBody: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginTop: 2,
  },
  replyButton: {
    marginTop: 6,
  },
  replyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
  },
  commentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  replyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  replyInput: {
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
  replySend: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  replySendText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  sheetFooter: {
    alignItems: 'flex-end',
    marginTop: 10,
  },
  sheetButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  sheetButtonText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  editedBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  editedText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
});

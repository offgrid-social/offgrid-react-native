import { BlurView } from 'expo-blur';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { IconBack } from '../components/Icons';
import { ReportModal } from '../components/ReportModal';
import { useApp } from '../hooks/useApp';
import { ContentFilterService } from '../services/ContentFilterService';
import { ReportService } from '../services/ReportService';

export const StoryViewerScreen: React.FC = () => {
  const {
    stories,
    activeStoryIndex,
    setActiveStoryIndex,
    setView,
    showToast,
    ageGroup,
    safetySettings,
  } = useApp();
  const [reply, setReply] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const story = stories[activeStoryIndex];

  useEffect(() => {
    if (!story) {
      setView('home');
    }
  }, [story, setView]);

  useEffect(() => {
    setRevealed(false);
  }, [activeStoryIndex]);

  const handleNext = () => {
    if (activeStoryIndex < stories.length - 1) {
      setActiveStoryIndex(activeStoryIndex + 1);
    } else {
      setView('home');
    }
  };

  const handlePrev = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(activeStoryIndex - 1);
    } else {
      setView('home');
    }
  };

  const handleReply = () => {
    if (!reply.trim()) return;
    showToast('Reply sent');
    setReply('');
  };

  const shouldBlur = ContentFilterService.shouldBlur(
    story?.isNSFW ?? false,
    ageGroup,
    safetySettings
  );
  const canReveal = ContentFilterService.canReveal(
    story?.isNSFW ?? false,
    ageGroup,
    safetySettings
  );

  return (
    <View style={styles.screen}>
      <View style={styles.progressTrack}>
        <View style={styles.progressFill} />
      </View>
      <Pressable style={styles.close} onPress={() => setView('home')}>
        <IconBack />
        <Text style={styles.closeText}>Back</Text>
      </Pressable>
      <Pressable style={styles.report} onPress={() => setShowReport(true)}>
        <Text style={styles.closeText}>Report</Text>
      </Pressable>
      <Pressable style={styles.navAreaLeft} onPress={handlePrev} />
      <Pressable style={styles.navAreaRight} onPress={handleNext} />

      <View style={styles.storyCard}>
        <Text style={styles.storyUser}>{story?.username ?? ''}</Text>
        <View style={styles.mediaPlaceholder}>
          {shouldBlur && !revealed ? (
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
        <Text style={styles.caption}>{story?.caption ?? ''}</Text>
      </View>

      <View style={styles.footer}>
        <GlassPanel style={styles.replyBar}>
          <TextInput
            style={styles.input}
            placeholder="Reply..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={reply}
            onChangeText={setReply}
          />
          <Pressable style={styles.sendButton} onPress={handleReply}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </GlassPanel>
        <View style={styles.reactionRow}>
          {['+1', '*', '<3'].map((emoji) => (
            <Pressable key={emoji} style={styles.reaction} onPress={() => showToast('Reacted')}>
              <Text style={styles.reactionText}>{emoji}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <ReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={async (reason, note) => {
          if (!story) return;
          await ReportService.submitReport({
            contentType: 'story',
            contentId: story.id,
            reason,
            note,
          });
          showToast('Report submitted');
        }}
        title="Report story"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#040404',
    paddingTop: 60,
  },
  progressTrack: {
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginHorizontal: 20,
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    width: '40%',
    height: 2,
    backgroundColor: '#f2f2f2',
    borderRadius: 2,
  },
  close: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  report: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginBottom: 12,
  },
  closeText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginLeft: 6,
  },
  storyCard: {
    marginHorizontal: 20,
  },
  storyUser: {
    color: '#f2f2f2',
    fontSize: 14,
    marginBottom: 12,
  },
  mediaPlaceholder: {
    height: 420,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 12,
    overflow: 'hidden',
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
  caption: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 24,
    paddingHorizontal: 20,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    color: '#f2f2f2',
    fontSize: 12,
  },
  sendButton: {
    paddingHorizontal: 8,
  },
  sendText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  reactionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  reaction: {
    marginRight: 10,
  },
  reactionText: {
    fontSize: 16,
  },
  navAreaLeft: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '40%',
  },
  navAreaRight: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '40%',
  },
});

import React, { useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';
import { MediaService } from '../services/MediaService';
type CreateMode = 'text' | 'image' | 'video' | 'story';

export const CreateScreen: React.FC = () => {
  const {
    createPost,
    createStory,
    setView,
    createType,
    setCreateType,
    selectedInterests,
    userProfile,
  } = useApp();
  const [textDraft, setTextDraft] = useState('');
  const [imageDraft, setImageDraft] = useState('');
  const [videoDraft, setVideoDraft] = useState('');
  const [storyDraft, setStoryDraft] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [storyUri, setStoryUri] = useState<string | null>(null);
  const [textMediaUri, setTextMediaUri] = useState<string | null>(null);
  const [storyMediaType, setStoryMediaType] = useState<'image' | 'video'>('image');
  const { animatedStyle } = useEntranceAnimation();

  const handlePick = async (mode: CreateMode) => {
    if (mode === 'image') {
      setImageUri(await MediaService.pickImage());
    } else if (mode === 'video') {
      setVideoUri(await MediaService.pickVideo());
    } else if (mode === 'text') {
      setTextMediaUri(await MediaService.pickImage());
    } else {
      if (storyMediaType === 'video') {
        setStoryUri(await MediaService.pickVideo());
      } else {
        setStoryUri(await MediaService.pickImage());
      }
    }
  };

  const handlePost = async () => {
    if (createType === 'text') {
      if (!textDraft.trim()) return;
      await createPost({
        body: textDraft.trim(),
        type: 'text',
        media: textMediaUri,
        interests: selectedInterests,
      });
      setTextDraft('');
      setTextMediaUri(null);
    }
    if (createType === 'image') {
      if (!imageUri) return;
      await createPost({
        body: imageDraft.trim() || 'New photo',
        type: 'image',
        media: imageUri,
        interests: selectedInterests,
      });
      setImageDraft('');
      setImageUri(null);
    }
    if (createType === 'video') {
      if (!videoUri) return;
      await createPost({
        body: videoDraft.trim() || 'New video',
        type: 'video',
        media: videoUri,
        interests: selectedInterests,
      });
      setVideoDraft('');
      setVideoUri(null);
    }
    if (createType === 'story') {
      if (!storyUri) return;
      await createStory({
        id: `s_${Date.now()}`,
        userId: userProfile?.id ?? 'you',
        username: userProfile?.username ?? 'you',
        mediaType: storyMediaType,
        uri: storyUri,
        caption: storyDraft.trim(),
        createdAt: new Date().toISOString(),
        isNSFW: false,
      });
      setStoryDraft('');
      setStoryUri(null);
    }
    setView('home');
  };

  const renderField = () => {
    if (createType === 'text') {
      return (
        <>
          <Pressable style={styles.mediaPick} onPress={() => handlePick('text')}>
            <Text style={styles.mediaPickText}>
              {textMediaUri ? 'Change image' : 'Add image (optional)'}
            </Text>
          </Pressable>
          <TextInput
            style={styles.input}
            placeholder="Write something calm and useful..."
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            multiline
            value={textDraft}
            onChangeText={setTextDraft}
          />
        </>
      );
    }

    const draft = createType === 'image' ? imageDraft : createType === 'video' ? videoDraft : storyDraft;
    const setDraft =
      createType === 'image'
        ? setImageDraft
        : createType === 'video'
        ? setVideoDraft
        : setStoryDraft;
    const uri = createType === 'image' ? imageUri : createType === 'video' ? videoUri : storyUri;

    return (
      <>
        {createType === 'story' ? (
          <View style={styles.storyToggle}>
            {(['image', 'video'] as const).map((mode) => (
              <Pressable
                key={mode}
                style={styles.storyToggleButton}
                onPress={() => setStoryMediaType(mode)}
              >
                <Text
                  style={[
                    styles.storyToggleText,
                    storyMediaType === mode && styles.storyToggleTextActive,
                  ]}
                >
                  {mode}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}
        <Pressable style={styles.mediaPick} onPress={() => handlePick(createType)}>
          <Text style={styles.mediaPickText}>{uri ? 'Change media' : 'Pick media (mock)'}</Text>
        </Pressable>
        <TextInput
          style={styles.input}
          placeholder="Add a caption (optional)"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          multiline
          value={draft}
          onChangeText={setDraft}
        />
      </>
    );
  };

  const canPost =
    createType === 'text'
      ? textDraft.trim().length > 0
      : createType === 'image'
      ? !!imageUri
      : createType === 'video'
      ? !!videoUri
      : !!storyUri;

  return (
    <View style={styles.screen}>
      <Animated.View style={animatedStyle}>
        <GlassPanel style={styles.panel}>
          <View style={styles.modeRow}>
        {(['text', 'image', 'video', 'story'] as CreateMode[]).map((mode) => (
          <Pressable key={mode} style={styles.modeButton} onPress={() => setCreateType(mode)}>
            <Text style={[styles.modeText, createType === mode && styles.modeTextActive]}>
              {mode}
            </Text>
          </Pressable>
        ))}
        </View>
        {renderField()}
          <Pressable style={[styles.button, !canPost && styles.buttonDisabled]} onPress={handlePost}>
            <Text style={styles.buttonText}>Post</Text>
          </Pressable>
        </GlassPanel>
      </Animated.View>
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
  panel: {
    padding: 18,
    borderRadius: 20,
  },
  modeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
  },
  modeText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize',
    fontSize: 12,
  },
  modeTextActive: {
    color: '#f2f2f2',
  },
  input: {
    minHeight: 120,
    color: '#f2f2f2',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: 'top',
  },
  mediaPick: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  mediaPickText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
  },
  storyToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  storyToggleButton: {
    flex: 1,
    alignItems: 'center',
  },
  storyToggleText: {
    color: 'rgba(255, 255, 255, 0.5)',
    textTransform: 'capitalize',
    fontSize: 12,
  },
  storyToggleTextActive: {
    color: '#f2f2f2',
  },
  button: {
    alignSelf: 'flex-end',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#f2f2f2',
    fontSize: 12,
    letterSpacing: 0.6,
  },
});

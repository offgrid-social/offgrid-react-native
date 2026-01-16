import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { IconBack } from '../components/Icons';
import { ReportModal } from '../components/ReportModal';
import { useApp } from '../hooks/useApp';
import { MediaService } from '../services/MediaService';
import { MessageService } from '../services/MessageService';
import { ReportService } from '../services/ReportService';
import type { Message } from '../types';

export const ChatThreadScreen: React.FC = () => {
  const { activeThreadId, threads, updateThread, setView, showToast } = useApp();
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState<Message | null>(null);
  const [showActions, setShowActions] = useState(false);
  const [typing, setTyping] = useState(false);
  const [showReport, setShowReport] = useState(false);

  const thread = threads.find((item) => item.id === activeThreadId);

  useEffect(() => {
    if (!thread) {
      setView('messages');
    }
  }, [thread, setView]);

  const handleSend = async () => {
    if (!activeThreadId || !message.trim()) return;
    setTyping(true);
    const updated = await MessageService.sendMessage(activeThreadId, message.trim());
    if (updated) {
      updateThread(updated);
      setMessage('');
    }
    setTimeout(() => setTyping(false), 600);
  };

  const handleSendImage = async () => {
    if (!activeThreadId) return;
    const uri = await MediaService.pickImage();
    const updated = await MessageService.sendImage(activeThreadId, uri);
    if (updated) {
      updateThread(updated);
    }
  };

  const handleReact = async (emoji: string) => {
    if (!activeThreadId || !selected) return;
    const updated = await MessageService.reactToMessage(activeThreadId, selected.id, emoji);
    if (updated) {
      updateThread(updated);
    }
    setShowActions(false);
  };

  if (!thread) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <Pressable style={styles.back} onPress={() => setView('messages')}>
        <IconBack />
        <Text style={styles.backText}>Back</Text>
      </Pressable>
      <Text style={styles.header}>{thread.participant.name}</Text>
      <FlatList
        data={thread.messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onLongPress={() => {
              setSelected(item);
              setShowActions(true);
            }}
            style={[styles.message, item.senderId === 'you' && styles.messageSelf]}
          >
            <Text style={styles.messageText}>{item.body}</Text>
            {item.mediaUri ? <View style={styles.mediaPlaceholder} /> : null}
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>{item.seen ? 'Seen' : 'Unseen'}</Text>
              {item.reactions.length ? (
                <Text style={styles.metaText}>{item.reactions.join(' ')}</Text>
              ) : null}
            </View>
          </Pressable>
        )}
        contentContainerStyle={styles.list}
      />

      {typing ? <Text style={styles.typing}>Typing...</Text> : null}

      <GlassPanel style={styles.inputBar}>
        <TextInput
          style={styles.input}
          placeholder="Write a message"
          placeholderTextColor="rgba(255, 255, 255, 0.4)"
          value={message}
          onChangeText={setMessage}
        />
        <Pressable style={styles.actionButton} onPress={handleSendImage}>
          <Text style={styles.actionText}>Image</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleSend}>
          <Text style={styles.actionText}>Send</Text>
        </Pressable>
      </GlassPanel>

      <Modal transparent visible={showActions} animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modal}>
            <Text style={styles.modalTitle}>Message actions</Text>
            <View style={styles.reactionRow}>
              {['+1', 'fire', '<3'].map((emoji) => (
                <Pressable key={emoji} style={styles.reaction} onPress={() => handleReact(emoji)}>
                  <Text style={styles.reactionText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                showToast('Copied');
                setShowActions(false);
              }}
            >
              <Text style={styles.modalButtonText}>Copy</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                showToast('Deleted');
                setShowActions(false);
              }}
            >
              <Text style={styles.modalButtonText}>Delete</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowActions(false);
                setShowReport(true);
              }}
            >
              <Text style={styles.modalButtonText}>Report</Text>
            </Pressable>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setShowActions(false);
              }}
            >
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </GlassPanel>
        </View>
      </Modal>
      <ReportModal
        visible={showReport}
        onClose={() => setShowReport(false)}
        onSubmit={async (reason, note) => {
          if (!selected) return;
          await ReportService.submitReport({
            contentType: 'message',
            contentId: selected.id,
            reason,
            note,
          });
          showToast('Report submitted');
        }}
        title="Report message"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 90,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  back: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginLeft: 8,
  },
  header: {
    color: '#f2f2f2',
    fontSize: 16,
    marginBottom: 12,
  },
  list: {
    paddingBottom: 20,
  },
  message: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    padding: 10,
    marginBottom: 10,
  },
  messageSelf: {
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#f2f2f2',
    fontSize: 12,
  },
  mediaPlaceholder: {
    height: 120,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginTop: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  metaText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
  },
  typing: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 11,
    marginBottom: 6,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 16,
  },
  input: {
    flex: 1,
    color: '#f2f2f2',
    fontSize: 12,
  },
  actionButton: {
    marginLeft: 8,
  },
  actionText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    padding: 16,
    borderRadius: 20,
    width: '80%',
  },
  modalTitle: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 10,
  },
  reactionRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  reaction: {
    marginRight: 10,
  },
  reactionText: {
    fontSize: 18,
  },
  modalButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingVertical: 8,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
});

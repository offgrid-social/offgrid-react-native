import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { GlassPanel } from './GlassPanel';
import type { ReportReason } from '../types';
import { ReportService } from '../services/ReportService';

type ReportModalProps = {
  visible: boolean;
  onClose: () => void;
  onSubmit: (reason: ReportReason, note: string) => Promise<void>;
  title?: string;
};

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  onSubmit,
  title = 'Report content',
}) => {
  const [reason, setReason] = useState<ReportReason>('spam');
  const [note, setNote] = useState('');
  const [reasons, setReasons] = useState<ReportReason[]>([]);

  useEffect(() => {
    const load = async () => {
      setReasons(await ReportService.getReasons());
    };
    load();
  }, []);

  const handleSubmit = async () => {
    await onSubmit(reason, note.trim());
    setNote('');
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <GlassPanel style={styles.modal}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.reasons}>
            {reasons.map((item) => (
              <Pressable key={item} style={styles.reason} onPress={() => setReason(item)}>
                <Text style={[styles.reasonText, reason === item && styles.reasonTextActive]}>
                  {item.replace('_', ' ')}
                </Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.input}
            placeholder="Optional notes"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={note}
            onChangeText={setNote}
          />
          <View style={styles.actions}>
            <Pressable style={styles.button} onPress={onClose}>
              <Text style={styles.buttonText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit</Text>
            </Pressable>
          </View>
        </GlassPanel>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
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
  title: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 10,
  },
  reasons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  reason: {
    marginRight: 10,
    marginBottom: 8,
  },
  reasonText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  reasonTextActive: {
    color: '#45d3ff',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#f2f2f2',
    fontSize: 12,
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
});

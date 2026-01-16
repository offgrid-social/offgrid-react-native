import React, { useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Platform } from 'react-native';

import { GlassPanel } from './GlassPanel';
import { useApp } from '../hooks/useApp';
import type { BugReportCategory, BugReportSeverity } from '../types';
import { BugReportService } from '../services/BugReportService';

type BugReportModalProps = {
  visible: boolean;
  onClose: () => void;
  contextLabel: string;
  errorState?: string | null;
};

const categories: BugReportCategory[] = ['ui', 'network', 'crash', 'data', 'other'];
const severities: BugReportSeverity[] = ['low', 'medium', 'high', 'critical'];

export const BugReportModal: React.FC<BugReportModalProps> = ({
  visible,
  onClose,
  contextLabel,
  errorState,
}) => {
  const { userProfile, auth, showToast } = useApp();
  const [category, setCategory] = useState<BugReportCategory>('ui');
  const [severity, setSeverity] = useState<BugReportSeverity>('low');
  const [description, setDescription] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [allowLogs, setAllowLogs] = useState(false);
  const [includeMetadata, setIncludeMetadata] = useState(false);
  const [screenshot, setScreenshot] = useState('');

  const metadata = useMemo(
    () => ({
      appVersion: '1.0.0',
      platform: Platform.OS,
      screen: contextLabel,
      errorState: errorState ?? undefined,
      backend: 'mock',
    }),
    [contextLabel, errorState]
  );

  const handleSubmit = async () => {
    if (!description.trim()) {
      showToast('Describe the issue first.');
      return;
    }
    await BugReportService.submitReport({
      category,
      description: description.trim(),
      steps: steps.trim() || undefined,
      expected: expected.trim() || undefined,
      actual: actual.trim() || undefined,
      severity,
      allowLogs,
      includeMetadata,
      screenshot: screenshot.trim() || undefined,
      metadata: includeMetadata ? metadata : undefined,
      userId: userProfile?.id,
      isAnonymous: auth.isAnonymous,
    });
    setDescription('');
    setSteps('');
    setExpected('');
    setActual('');
    setScreenshot('');
    setAllowLogs(false);
    setIncludeMetadata(false);
    onClose();
    showToast('Bug report sent');
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.backdrop}>
        <GlassPanel style={styles.modal}>
          <Text style={styles.title}>Report a bug</Text>
          <Text style={styles.subtitle}>
            Calm, human feedback. No tracking or fingerprints.
          </Text>

          <View style={styles.row}>
            {categories.map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, category === item && styles.chipActive]}
                onPress={() => setCategory(item)}
              >
                <Text style={styles.chipText}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <TextInput
            style={styles.input}
            placeholder="What happened?"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={description}
            onChangeText={setDescription}
          />
          <TextInput
            style={styles.input}
            placeholder="Reproduction steps (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={steps}
            onChangeText={setSteps}
          />
          <TextInput
            style={styles.input}
            placeholder="Expected result (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={expected}
            onChangeText={setExpected}
          />
          <TextInput
            style={styles.input}
            placeholder="Actual result (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={actual}
            onChangeText={setActual}
          />
          <TextInput
            style={styles.input}
            placeholder="Screenshot reference (optional)"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={screenshot}
            onChangeText={setScreenshot}
          />

          <View style={styles.row}>
            {severities.map((item) => (
              <Pressable
                key={item}
                style={[styles.chip, severity === item && styles.chipActive]}
                onPress={() => setSeverity(item)}
              >
                <Text style={styles.chipText}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.toggleRow}>
            <Pressable style={styles.toggle} onPress={() => setAllowLogs((prev) => !prev)}>
              <View style={[styles.toggleDot, allowLogs && styles.toggleDotActive]} />
            </Pressable>
            <Text style={styles.toggleText}>Allow logs (off by default)</Text>
          </View>

          <View style={styles.toggleRow}>
            <Pressable
              style={styles.toggle}
              onPress={() => setIncludeMetadata((prev) => !prev)}
            >
              <View style={[styles.toggleDot, includeMetadata && styles.toggleDotActive]} />
            </Pressable>
            <Text style={styles.toggleText}>Include metadata</Text>
          </View>

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
    width: '90%',
    padding: 16,
    borderRadius: 20,
  },
  title: {
    color: '#f2f2f2',
    fontSize: 14,
    marginBottom: 6,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  chip: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 14,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
  },
  chipActive: {
    borderColor: '#45d3ff',
  },
  chipText: {
    color: '#f2f2f2',
    fontSize: 10,
    textTransform: 'capitalize',
  },
  input: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#f2f2f2',
    fontSize: 11,
    marginBottom: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  toggle: {
    width: 24,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginRight: 8,
  },
  toggleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleDotActive: {
    backgroundColor: '#45d3ff',
    alignSelf: 'flex-end',
  },
  toggleText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 10,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
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

import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';

import { GlassPanel } from '../components/GlassPanel';
import { ModerationQueueService } from '../services/ModerationQueueService';
import type { ReportItem } from '../types';

export const ModerationQueueScreen: React.FC = () => {
  const { width } = useWindowDimensions();
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [selected, setSelected] = useState<ReportItem | null>(null);
  const [note, setNote] = useState('');

  const isWide = width >= 900;

  useEffect(() => {
    const load = async () => {
      const data = await ModerationQueueService.fetchQueue();
      setReports(data);
      if (data.length && !selected) {
        setSelected(data[0]);
      }
    };
    load();
  }, [selected]);

  const updateStatus = async (status: ReportItem['status'], label: string) => {
    if (!selected) return;
    const updated = await ModerationQueueService.resolveReport(selected.id, label);
    if (updated) {
      setReports((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
      setSelected(updated);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={[styles.columns, !isWide && styles.columnsStacked]}>
        <GlassPanel style={[styles.column, styles.leftColumn]}>
          <Text style={styles.sectionTitle}>Reports</Text>
          {reports.length === 0 ? (
            <Text style={styles.empty}>No reports yet.</Text>
          ) : (
            reports.map((item) => (
              <Pressable key={item.id} style={styles.reportItem} onPress={() => setSelected(item)}>
                <Text style={styles.reportReason}>{item.reason}</Text>
                <Text style={styles.reportMeta}>
                  {item.contentType} - {item.status.replace('_', ' ')}
                </Text>
              </Pressable>
            ))
          )}
        </GlassPanel>

        <GlassPanel style={[styles.column, styles.centerColumn]}>
          <Text style={styles.sectionTitle}>Preview</Text>
          {selected ? (
            <>
              <Text style={styles.reportMeta}>Content: {selected.contentType}</Text>
              <View style={styles.previewBox} />
              <Text style={styles.reportMeta}>Context shown in mock only.</Text>
            </>
          ) : (
            <Text style={styles.empty}>Select a report to review.</Text>
          )}
        </GlassPanel>

        <GlassPanel style={[styles.column, styles.rightColumn]}>
          <Text style={styles.sectionTitle}>Actions</Text>
          <Pressable style={styles.actionButton} onPress={() => updateStatus('resolved', 'Dismissed')}>
            <Text style={styles.actionText}>Dismiss report</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => updateStatus('resolved', 'Marked valid')}>
            <Text style={styles.actionText}>Mark as valid</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => updateStatus('resolved', 'Content hidden')}>
            <Text style={styles.actionText}>Hide content</Text>
          </Pressable>
          <Pressable style={styles.actionButton} onPress={() => updateStatus('resolved', 'Flag user')}>
            <Text style={styles.actionText}>Flag user</Text>
          </Pressable>
          <TextInput
            style={styles.noteInput}
            placeholder="Moderator note (internal)"
            placeholderTextColor="rgba(255, 255, 255, 0.4)"
            value={note}
            onChangeText={setNote}
          />
          <Pressable style={styles.actionButton} onPress={() => updateStatus('resolved', note || 'Note saved')}>
            <Text style={styles.actionText}>Save note</Text>
          </Pressable>
        </GlassPanel>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 96,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  columns: {
    flex: 1,
    flexDirection: 'row',
  },
  columnsStacked: {
    flexDirection: 'column',
  },
  column: {
    padding: 14,
    borderRadius: 18,
    flex: 1,
  },
  leftColumn: {
    flex: 1,
    marginRight: 12,
  },
  centerColumn: {
    flex: 1.4,
    marginRight: 12,
  },
  rightColumn: {
    flex: 1,
  },
  sectionTitle: {
    color: '#f2f2f2',
    fontSize: 12,
    marginBottom: 10,
  },
  reportItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  reportReason: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  reportMeta: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 4,
  },
  previewBox: {
    height: 200,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 10,
  },
  actionButton: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.35)',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  actionText: {
    color: '#f2f2f2',
    fontSize: 11,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: '#f2f2f2',
    fontSize: 11,
    marginBottom: 10,
  },
  empty: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
  },
});

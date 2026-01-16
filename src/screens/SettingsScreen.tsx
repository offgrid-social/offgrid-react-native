import React, { useState } from 'react';
import { Animated, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { BugReportModal } from '../components/BugReportModal';
import { GlassPanel } from '../components/GlassPanel';
import { useApp } from '../hooks/useApp';
import { useEntranceAnimation } from '../hooks/useEntranceAnimation';

export const SettingsScreen: React.FC = () => {
  const {
    logout,
    auth,
    setView,
    simulateNetworkError,
    setSimulateNetworkError,
    showToast,
    role,
    setRole,
    quietMode,
    updateQuietMode,
  } = useApp();
  const { animatedStyle } = useEntranceAnimation();
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteStep, setDeleteStep] = useState(1);
  const [showBugReport, setShowBugReport] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Animated.View style={animatedStyle}>
      <GlassPanel style={styles.panel}>
        <Text style={styles.section}>Account</Text>
        <Pressable style={styles.row} onPress={() => setView('preferences')}>
          <Text style={styles.rowText}>Preferences</Text>
          <Text style={styles.rowHint}>Interests</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => setView('safety')}>
          <Text style={styles.rowText}>Safety & Trust</Text>
          <Text style={styles.rowHint}>Content filters</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => updateQuietMode({ hideLikes: !quietMode.hideLikes })}
        >
          <Text style={styles.rowText}>Quiet mode: hide likes</Text>
          <Text style={styles.rowHint}>{quietMode.hideLikes ? 'On' : 'Off'}</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => updateQuietMode({ hideCounts: !quietMode.hideCounts })}
        >
          <Text style={styles.rowText}>Quiet mode: hide counts</Text>
          <Text style={styles.rowHint}>{quietMode.hideCounts ? 'On' : 'Off'}</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => updateQuietMode({ pauseNotifications: !quietMode.pauseNotifications })}
        >
          <Text style={styles.rowText}>Quiet mode: pause notifications</Text>
          <Text style={styles.rowHint}>{quietMode.pauseNotifications ? 'On' : 'Off'}</Text>
        </Pressable>
      </GlassPanel>

      <GlassPanel style={styles.panel}>
        <Text style={styles.section}>Privacy</Text>
        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Private account</Text>
          <Text style={styles.rowHint}>Manage in profile</Text>
        </Pressable>
      </GlassPanel>

      <GlassPanel style={styles.panel}>
        <Text style={styles.section}>Notifications</Text>
        <Pressable style={styles.row}>
          <Text style={styles.rowText}>Activity</Text>
          <Text style={styles.rowHint}>Likes, follows, mentions</Text>
        </Pressable>
      </GlassPanel>

      <GlassPanel style={styles.panel}>
        <Text style={styles.section}>Data & Storage</Text>
        <Pressable style={styles.row} onPress={() => showToast('Export queued')}>
          <Text style={styles.rowText}>Export data</Text>
          <Text style={styles.rowHint}>Mock export</Text>
        </Pressable>
      </GlassPanel>

      <GlassPanel style={styles.panel}>
        <Text style={styles.section}>About</Text>
        <Pressable style={styles.row} onPress={() => showToast('offgrid v0.1')}>
          <Text style={styles.rowText}>Version</Text>
          <Text style={styles.rowHint}>0.1 (mock)</Text>
        </Pressable>
      </GlassPanel>
      </Animated.View>

      <GlassPanel style={styles.panel}>
        <Text style={styles.section}>Developer</Text>
        <Pressable
          style={styles.row}
          onPress={() => setSimulateNetworkError(!simulateNetworkError)}
        >
          <Text style={styles.rowText}>Simulate network error</Text>
          <Text style={styles.rowHint}>{simulateNetworkError ? 'On' : 'Off'}</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => {
            const next = role === 'user' ? 'moderator' : role === 'moderator' ? 'admin' : 'user';
            setRole(next);
            showToast(`Role: ${next}`);
          }}
        >
          <Text style={styles.rowText}>Role</Text>
          <Text style={styles.rowHint}>{role}</Text>
        </Pressable>
        {role !== 'user' ? (
          <Pressable style={styles.row} onPress={() => setView('moderation')}>
            <Text style={styles.rowText}>Moderation queue</Text>
            <Text style={styles.rowHint}>Review reports</Text>
          </Pressable>
        ) : null}
      </GlassPanel>

      <GlassPanel style={styles.panel}>
        <Text style={styles.section}>Account actions</Text>
        <Pressable style={styles.row} onPress={() => setShowLogout(true)}>
          <Text style={styles.rowText}>Log out</Text>
          <Text style={styles.rowHint}>Exit session</Text>
        </Pressable>
        <Pressable style={styles.row} onPress={() => setShowBugReport(true)}>
          <Text style={styles.rowText}>Report a bug</Text>
          <Text style={styles.rowHint}>Help improve offgrid</Text>
        </Pressable>
        <Pressable
          style={styles.row}
          onPress={() => {
            setDeleteStep(1);
            setShowDelete(true);
          }}
        >
          <Text style={styles.rowText}>Delete account</Text>
          <Text style={styles.rowHint}>Double confirm</Text>
        </Pressable>
      </GlassPanel>
      </ScrollView>

      <Modal transparent visible={showLogout} animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modal}>
            <Text style={styles.modalTitle}>Log out?</Text>
            {auth.isAnonymous ? (
              <Text style={styles.modalText}>
                Anonymous sessions may lose local data.
              </Text>
            ) : null}
            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={() => setShowLogout(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.modalButton} onPress={handleLogout}>
                <Text style={styles.modalButtonText}>Log out</Text>
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      </Modal>

      <Modal transparent visible={showDelete} animationType="fade">
        <View style={styles.modalBackdrop}>
          <GlassPanel style={styles.modal}>
            <Text style={styles.modalTitle}>Delete account?</Text>
            <Text style={styles.modalText}>
              {deleteStep === 1
                ? 'This is a mock action. Confirm to proceed.'
                : 'Final confirmation. This cannot be undone in a real app.'}
            </Text>
            <View style={styles.modalActions}>
              <Pressable style={styles.modalButton} onPress={() => setShowDelete(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={styles.modalButton}
                onPress={() => {
                  if (deleteStep === 1) {
                    setDeleteStep(2);
                  } else {
                    setShowDelete(false);
                  }
                }}
              >
                <Text style={styles.modalButtonText}>
                  {deleteStep === 1 ? 'Continue' : 'Delete'}
                </Text>
              </Pressable>
            </View>
          </GlassPanel>
        </View>
      </Modal>
      <BugReportModal
        visible={showBugReport}
        onClose={() => setShowBugReport(false)}
        contextLabel="Settings"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 96,
    paddingHorizontal: 20,
    paddingBottom: 140,
    backgroundColor: '#040404',
  },
  scroll: {
    paddingBottom: 20,
  },
  panel: {
    padding: 14,
    borderRadius: 16,
    marginBottom: 12,
  },
  section: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 11,
    marginBottom: 8,
  },
  row: {
    paddingVertical: 8,
  },
  rowText: {
    color: '#f2f2f2',
    fontSize: 12,
  },
  rowHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 10,
    marginTop: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal: {
    padding: 16,
    borderRadius: 18,
    width: '80%',
  },
  modalTitle: {
    color: '#f2f2f2',
    fontSize: 13,
    marginBottom: 8,
  },
  modalText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    marginBottom: 12,
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
});

import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { BottomNav } from './components/BottomNav';
import { SideNav } from './components/SideNav';
import { Toast } from './components/Toast';
import { TopBar } from './components/TopBar';
import { ScreenRouter } from './screens/ScreenRouter';
import { AppProvider, AppContext } from './state/AppContext';

const AppShell: React.FC = () => {
  const { width } = useWindowDimensions();
  const useSideNav = width >= 900;
  return (
    <AppContext.Consumer>
      {(state) => {
        const hideChrome =
          state?.view === 'storyViewer' || state?.view === 'chatThread';
        const showChrome =
          !!state?.auth.loggedIn && state?.onboardingCompleted && !hideChrome;
        return (
          <View style={styles.root}>
            <StatusBar style="light" />
            {showChrome ? <TopBar /> : null}
            <ScreenRouter />
            {showChrome && useSideNav ? <SideNav /> : null}
            {showChrome && !useSideNav ? <BottomNav /> : null}
            {state?.toast?.visible ? <Toast message={state.toast.message} /> : null}
          </View>
        );
      }}
    </AppContext.Consumer>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#040404',
  },
});

export default App;

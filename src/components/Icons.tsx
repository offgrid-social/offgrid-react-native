import React from 'react';
import { StyleSheet, View } from 'react-native';

const ACCENT = '#45d3ff';

type IconProps = {
  size?: number;
  active?: boolean;
};

export const IconPlus: React.FC<IconProps> = ({ size = 18, active }) => {
  return (
    <View style={[styles.iconBox, { width: size, height: size }]}>
      <View
        style={[
          styles.iconLine,
          styles.iconLineHorizontal,
          active && styles.lineBold,
          active && styles.lineAccent,
        ]}
      />
      <View
        style={[
          styles.iconLine,
          styles.iconLineVertical,
          active && styles.lineBoldVertical,
          active && styles.lineAccent,
        ]}
      />
    </View>
  );
};

export const IconHeart: React.FC<IconProps> = ({ size = 18, active }) => {
  const width = size;
  const height = size * 0.9;
  const stroke = active ? ACCENT : 'rgba(255, 255, 255, 0.7)';
  return (
    <View style={[styles.heart, { width, height }]}>
      <View style={[styles.heartArcLeft, { borderColor: stroke }]} />
      <View style={[styles.heartArcRight, { borderColor: stroke }]} />
      <View style={[styles.heartV, { borderColor: stroke }]} />
    </View>
  );
};

export const IconHome: React.FC<IconProps> = ({ size = 22, active }) => {
  return (
    <View
      style={[
        styles.homeIcon,
        { width: size, height: size },
        active && styles.iconBold,
      ]}
    >
      <View style={[styles.homeDoor, active && styles.iconBold]} />
    </View>
  );
};

export const IconChat: React.FC<IconProps> = ({ size = 22, active }) => {
  return (
    <View style={[styles.chatIcon, { width: size, height: size * 0.75 }, active && styles.iconBold]}>
      <View style={styles.chatTail} />
    </View>
  );
};

export const IconSearch: React.FC<IconProps> = ({ size = 20, active }) => {
  return (
    <View style={[styles.searchWrap, { width: size, height: size }]}>
      <View style={[styles.searchCircle, active && styles.iconBold]} />
      <View style={[styles.searchHandle, active && styles.iconBoldFill]} />
    </View>
  );
};

export const IconProfile: React.FC<IconProps> = ({ size = 20, active }) => {
  return (
    <View style={[styles.profileWrap, { width: size, height: size }]}>
      <View style={[styles.profileHead, active && styles.iconBold]} />
      <View style={[styles.profileBody, active && styles.iconBold]} />
    </View>
  );
};

export const IconShare: React.FC<IconProps> = ({ size = 18, active }) => {
  return (
    <View style={[styles.shareWrap, { width: size, height: size }]}>
      <View style={styles.shareArrow} />
      <View style={styles.shareStem} />
    </View>
  );
};

export const IconComment: React.FC<IconProps> = ({ size = 18, active }) => {
  return (
    <View style={[styles.commentIcon, { width: size, height: size * 0.8 }, active && styles.iconBold]}>
      <View style={styles.commentTail} />
    </View>
  );
};

export const IconBookmark: React.FC<IconProps> = ({ size = 16, active }) => {
  return (
    <View
      style={[
        styles.bookmark,
        { width: size, height: size * 1.2 },
        active && styles.iconBold,
      ]}
    />
  );
};

export const IconRepost: React.FC<IconProps> = ({ size = 16, active }) => {
  return (
    <View style={[styles.repost, { width: size, height: size }, active && styles.iconBold]}>
      <View style={styles.repostArrow} />
      <View style={styles.repostArrowDown} />
    </View>
  );
};

export const IconReport: React.FC<IconProps> = ({ size = 16, active }) => {
  return (
    <View style={[styles.report, { width: size, height: size }, active && styles.iconBold]}>
      <View style={styles.reportLine} />
    </View>
  );
};

export const IconPlay: React.FC<IconProps> = ({ size = 18 }) => {
  return <View style={[styles.play, { width: size, height: size }]} />;
};

export const IconPause: React.FC<IconProps> = ({ size = 18 }) => {
  return (
    <View style={[styles.pause, { width: size, height: size }]}>
      <View style={styles.pauseBar} />
      <View style={styles.pauseBar} />
    </View>
  );
};

export const IconMute: React.FC<IconProps> = ({ size = 18, active }) => {
  return (
    <View style={[styles.mute, { width: size, height: size }, active && styles.iconBold]}>
      <View style={styles.muteSlash} />
    </View>
  );
};

export const IconBack: React.FC<IconProps> = ({ size = 16, active }) => {
  return (
    <View style={[styles.back, { width: size, height: size }, active && styles.iconBold]}>
      <View style={styles.backStem} />
    </View>
  );
};

const styles = StyleSheet.create({
  iconBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLine: {
    position: 'absolute',
    backgroundColor: '#fff',
  },
  iconLineHorizontal: {
    width: '100%',
    height: 1,
  },
  iconLineVertical: {
    width: 1,
    height: '100%',
  },
  iconBold: {
    borderWidth: 2,
    borderColor: ACCENT,
  },
  lineBold: {
    height: 2,
  },
  lineBoldVertical: {
    width: 2,
  },
  lineAccent: {
    backgroundColor: ACCENT,
  },
  iconBoldFill: {
    backgroundColor: ACCENT,
    height: 2,
  },
  heart: {
    position: 'relative',
  },
  heartArcLeft: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.2,
    left: 0,
    top: 0,
  },
  heartArcRight: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.2,
    right: 0,
    top: 0,
  },
  heartV: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderBottomWidth: 1.2,
    borderLeftWidth: 1.2,
    transform: [{ rotate: '-45deg' }],
    bottom: 0,
    left: 4,
  },
  homeIcon: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: 3,
  },
  homeDoor: {
    width: 6,
    height: 7,
    borderWidth: 1,
    borderColor: '#fff',
  },
  chatIcon: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    position: 'relative',
  },
  chatTail: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
    bottom: -3,
    left: 4,
    transform: [{ rotate: '45deg' }],
    backgroundColor: '#000',
  },
  searchWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchCircle: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
  },
  searchHandle: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: '#fff',
    transform: [{ rotate: '45deg' }],
    right: 0,
    bottom: 2,
  },
  profileWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHead: {
    width: 9,
    height: 9,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4.5,
    marginBottom: 2,
  },
  profileBody: {
    width: 14,
    height: 5,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 3,
  },
  shareWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareArrow: {
    width: 10,
    height: 10,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: '#fff',
    transform: [{ rotate: '-45deg' }],
  },
  shareStem: {
    position: 'absolute',
    width: 1,
    height: 10,
    backgroundColor: '#fff',
    bottom: 2,
  },
  commentIcon: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 6,
    position: 'relative',
  },
  commentTail: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#fff',
    bottom: -3,
    right: 4,
    transform: [{ rotate: '-45deg' }],
    backgroundColor: '#000',
  },
  bookmark: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
  },
  repost: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  repostArrow: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: '#fff',
    top: 4,
  },
  repostArrowDown: {
    position: 'absolute',
    width: 8,
    height: 1,
    backgroundColor: '#fff',
    bottom: 4,
  },
  report: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportLine: {
    width: 1,
    height: 8,
    backgroundColor: '#fff',
  },
  play: {
    borderTopWidth: 9,
    borderTopColor: 'transparent',
    borderBottomWidth: 9,
    borderBottomColor: 'transparent',
    borderLeftWidth: 14,
    borderLeftColor: '#fff',
  },
  pause: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pauseBar: {
    width: 4,
    height: 14,
    backgroundColor: '#fff',
  },
  mute: {
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  muteSlash: {
    width: 12,
    height: 1,
    backgroundColor: '#fff',
    transform: [{ rotate: '-35deg' }],
  },
  back: {
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#fff',
    transform: [{ rotate: '45deg' }],
  },
  backStem: {
    position: 'absolute',
    width: 1,
    height: 8,
    backgroundColor: '#fff',
    left: -2,
    top: 4,
  },
});

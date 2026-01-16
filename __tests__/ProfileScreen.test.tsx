import React from 'react';
import { fireEvent } from '@testing-library/react-native';

import { ProfileScreen } from '../src/screens/ProfileScreen';
import { AppContext } from '../src/state/AppContext';
import { createAppContextValue, renderWithApp } from './test-utils';

const basePosts = [
  {
    id: 'p1',
    authorId: 'you',
    author: 'You',
    handle: '@you',
    body: 'My post',
    createdAt: '2026-01-12T08:15:00.000Z',
    interests: [],
    type: 'text',
    media: null,
    isNSFW: false,
    commentsList: [],
    reposts: 0,
    bookmarked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    likedBy: [],
    savedBy: [],
    editHistory: [],
  },
  {
    id: 'p2',
    authorId: 'u2',
    author: 'Other',
    handle: '@other',
    body: 'Other post',
    createdAt: '2026-01-12T07:03:00.000Z',
    interests: [],
    type: 'text',
    media: null,
    isNSFW: false,
    commentsList: [],
    reposts: 0,
    bookmarked: false,
    likes: 0,
    comments: 0,
    shares: 0,
    liked: false,
    likedBy: [],
    savedBy: [],
    editHistory: [],
  },
];

describe('ProfileScreen', () => {
  it('filters tabs by authorId', () => {
    const { getByText, queryByText } = renderWithApp(<ProfileScreen />, {
      allPosts: basePosts,
    });

    expect(getByText('My post')).toBeTruthy();
    expect(queryByText('Other post')).toBeNull();
  });

  it('updates likes tab when likedBy changes', () => {
    const { getByText, queryByText, rerender } = renderWithApp(<ProfileScreen />, {
      allPosts: basePosts,
    });

    fireEvent.press(getByText('likes'));
    expect(getByText('No likes yet.')).toBeTruthy();

    const likedPosts = [
      {
        ...basePosts[0],
        likedBy: ['you'],
        liked: true,
        likes: 1,
      },
    ];

    const nextValue = createAppContextValue({ allPosts: likedPosts });
    rerender(
      <AppContext.Provider value={nextValue}>
        <ProfileScreen />
      </AppContext.Provider>
    );

    expect(queryByText('No likes yet.')).toBeNull();
    expect(getByText('My post')).toBeTruthy();
  });
});

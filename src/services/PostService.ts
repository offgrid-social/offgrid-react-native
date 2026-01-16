import type { Comment, FeedType, Post } from '../types';
import { getMockFeed } from '../data/mockFeed';
import { mockDelay } from './mockDelay';

let posts = getMockFeed();

const createComment = (author: string, body: string): Comment => ({
  id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
  author,
  body,
  createdAt: new Date().toISOString(),
  replies: [],
});

export const PostService = {
  async getFeed(type: FeedType, interests: string[]): Promise<Post[]> {
    await mockDelay(300);
    // TODO: backend hook - fetch feed by type/interests.
    const filtered = posts
      .filter((post) => post.type === type)
      .filter((post) =>
        interests.length ? post.interests.some((tag) => interests.includes(tag)) : true
      );
    return [...filtered].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },
  async getAllPosts(): Promise<Post[]> {
    await mockDelay(120);
    // TODO: backend hook - fetch all posts for client cache.
    return [...posts];
  },
  async getPostsByUser(userId: string): Promise<Post[]> {
    await mockDelay(120);
    // TODO: backend hook - fetch posts authored by user.
    return posts.filter((post) => post.authorId === userId);
  },
  async getLikedPosts(userId: string): Promise<Post[]> {
    await mockDelay(120);
    // TODO: backend hook - fetch posts liked by user.
    return posts.filter((post) => post.likedBy.includes(userId));
  },
  async getSavedPosts(userId: string): Promise<Post[]> {
    await mockDelay(120);
    // TODO: backend hook - fetch saved posts for user.
    return posts.filter((post) => post.savedBy.includes(userId));
  },
  async createPost(post: Post): Promise<Post> {
    await mockDelay(200);
    // TODO: backend hook - create post.
    posts = [post, ...posts];
    return post;
  },
  async toggleLike(postId: string, userId: string): Promise<Post | null> {
    await mockDelay(120);
    // TODO: backend hook - toggle like.
    let updated: Post | null = null;
    posts = posts.map((post) => {
      if (post.id !== postId) return post;
      const alreadyLiked = post.likedBy.includes(userId);
      const likedBy = alreadyLiked
        ? post.likedBy.filter((id) => id !== userId)
        : [...post.likedBy, userId];
      const liked = !alreadyLiked;
      updated = {
        ...post,
        liked,
        likedBy,
        likes: liked ? post.likes + 1 : Math.max(0, post.likes - 1),
      };
      return updated;
    });
    return updated;
  },
  async toggleBookmark(postId: string, userId: string): Promise<Post | null> {
    await mockDelay(120);
    // TODO: backend hook - toggle bookmark.
    let updated: Post | null = null;
    posts = posts.map((post) => {
      if (post.id !== postId) return post;
      const alreadySaved = post.savedBy.includes(userId);
      const savedBy = alreadySaved
        ? post.savedBy.filter((id) => id !== userId)
        : [...post.savedBy, userId];
      updated = { ...post, bookmarked: !alreadySaved, savedBy };
      return updated;
    });
    return updated;
  },
  async repost(postId: string): Promise<Post | null> {
    await mockDelay(120);
    // TODO: backend hook - create repost.
    let updated: Post | null = null;
    posts = posts.map((post) => {
      if (post.id !== postId) return post;
      updated = { ...post, reposts: post.reposts + 1 };
      return updated;
    });
    return updated;
  },
  async addComment(postId: string, body: string): Promise<Post | null> {
    await mockDelay(140);
    // TODO: backend hook - add comment.
    let updated: Post | null = null;
    posts = posts.map((post) => {
      if (post.id !== postId) return post;
      const comment = createComment('You', body);
      updated = {
        ...post,
        comments: post.comments + 1,
        commentsList: [comment, ...post.commentsList],
      };
      return updated;
    });
    return updated;
  },
  async addReply(postId: string, commentId: string, body: string): Promise<Post | null> {
    await mockDelay(140);
    // TODO: backend hook - add reply.
    let updated: Post | null = null;
    posts = posts.map((post) => {
      if (post.id !== postId) return post;
      const nextComments = post.commentsList.map((comment) => {
        if (comment.id !== commentId) return comment;
        return {
          ...comment,
          replies: [...comment.replies, createComment('You', body)],
        };
      });
      updated = {
        ...post,
        comments: post.comments + 1,
        commentsList: nextComments,
      };
      return updated;
    });
    return updated;
  },
  async report(postId: string): Promise<void> {
    await mockDelay(160);
    // TODO: backend hook - report content.
  },
  async share(postId: string): Promise<Post | null> {
    await mockDelay(120);
    // TODO: backend hook - share content.
    let updated: Post | null = null;
    posts = posts.map((post) => {
      if (post.id !== postId) return post;
      updated = { ...post, shares: post.shares + 1 };
      return updated;
    });
    return updated;
  },
  async editPost(postId: string, body: string): Promise<Post | null> {
    await mockDelay(160);
    // TODO: backend hook - edit post and return history.
    let updated: Post | null = null;
    posts = posts.map((post) => {
      if (post.id !== postId) return post;
      const history = [
        ...post.editHistory,
        { body: post.body, editedAt: new Date().toISOString() },
      ];
      updated = {
        ...post,
        body,
        editHistory: history,
      };
      return updated;
    });
    return updated;
  },
};

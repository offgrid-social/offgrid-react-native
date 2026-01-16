import type { AgeGroup, ContentSafetySettings, Post, Story } from '../types';

export const ContentFilterService = {
  shouldBlur(isNSFW: boolean, ageGroup: AgeGroup | null, settings: ContentSafetySettings) {
    if (!isNSFW) return false;
    if (ageGroup === 'minor') return true;
    return settings.blurSensitiveContent;
  },
  canReveal(isNSFW: boolean, ageGroup: AgeGroup | null, settings: ContentSafetySettings) {
    if (!isNSFW) return true;
    if (ageGroup === 'minor') return false;
    return settings.allowTapToReveal;
  },
  filterPosts(posts: Post[], ageGroup: AgeGroup | null) {
    if (ageGroup === 'minor') {
      return posts.filter((post) => !post.isNSFW);
    }
    return posts;
  },
  filterStories(stories: Story[], ageGroup: AgeGroup | null) {
    if (ageGroup === 'minor') {
      return stories.filter((story) => !story.isNSFW);
    }
    return stories;
  },
};

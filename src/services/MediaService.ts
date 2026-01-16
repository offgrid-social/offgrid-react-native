import { mockDelay } from './mockDelay';

export const MediaService = {
  async pickImage(): Promise<string> {
    await mockDelay(200);
    // TODO: backend hook - integrate real media picker/upload.
    return `mock://image/${Date.now()}`;
  },
  async pickVideo(): Promise<string> {
    await mockDelay(200);
    // TODO: backend hook - integrate real media picker/upload.
    return `mock://video/${Date.now()}`;
  },
};

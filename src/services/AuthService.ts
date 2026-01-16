import type { AuthState } from '../types';
import { mockDelay } from './mockDelay';

export const AuthService = {
  async login(provider: AuthState['provider']): Promise<AuthState> {
    await mockDelay(400);
    // TODO: backend hook - replace with real auth call.
    const isAnonymous = provider === 'anonymous';
    return {
      loggedIn: true,
      isAnonymous,
      provider,
    };
  },
  async logout(): Promise<void> {
    await mockDelay(200);
    // TODO: backend hook - replace with real logout call.
  },
};

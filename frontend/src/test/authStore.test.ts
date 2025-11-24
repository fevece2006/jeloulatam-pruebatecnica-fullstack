import { describe, it, expect } from 'vitest';
import { useAuthStore } from '../stores/authStore';

describe('AuthStore', () => {
  it('initializes with default state', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });

  it('can logout', () => {
    const { logout } = useAuthStore.getState();
    logout();
    
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
  });
});

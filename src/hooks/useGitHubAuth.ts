import { useState, useEffect, useCallback } from 'react';
import { GitHubAuthState, DeviceFlowResponse } from '../types';
import { initiateDeviceFlow, pollForToken, getCurrentUser } from '../utils/github';

const TOKEN_STORAGE_KEY = 'github_token';
const USER_STORAGE_KEY = 'github_user';

export function useGitHubAuth() {
  const [authState, setAuthState] = useState<GitHubAuthState>({
    isAuthenticated: false,
    token: null,
    user: null,
    isLoading: true,
    error: null
  });

  const [deviceFlow, setDeviceFlow] = useState<DeviceFlowResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  // Initialize auth state from sessionStorage
  useEffect(() => {
    const savedToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
    const savedUser = sessionStorage.getItem(USER_STORAGE_KEY);

    if (savedToken && savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setAuthState({
          isAuthenticated: true,
          token: savedToken,
          user,
          isLoading: false,
          error: null
        });
      } catch {
        sessionStorage.removeItem(TOKEN_STORAGE_KEY);
        sessionStorage.removeItem(USER_STORAGE_KEY);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const startDeviceFlow = useCallback(async (scope?: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      const flow = await initiateDeviceFlow(scope);
      setDeviceFlow(flow);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to start authentication'
      }));
    }
  }, []);

  const startPolling = useCallback(async () => {
    if (!deviceFlow || isPolling) return;

    setIsPolling(true);
    const pollInterval = deviceFlow.interval * 1000;
    const expiresAt = Date.now() + (deviceFlow.expires_in * 1000);

    const poll = async (): Promise<void> => {
      if (Date.now() >= expiresAt) {
        setAuthState(prev => ({
          ...prev,
          error: 'Authentication expired. Please try again.'
        }));
        setIsPolling(false);
        setDeviceFlow(null);
        return;
      }

      try {
        const tokenResponse = await pollForToken(deviceFlow.device_code);
        const user = await getCurrentUser(tokenResponse.access_token);

        sessionStorage.setItem(TOKEN_STORAGE_KEY, tokenResponse.access_token);
        sessionStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));

        setAuthState({
          isAuthenticated: true,
          token: tokenResponse.access_token,
          user,
          isLoading: false,
          error: null
        });

        setIsPolling(false);
        setDeviceFlow(null);
      } catch (error) {
        if (error instanceof Error) {
          if (error.message === 'AUTHORIZATION_PENDING') {
            setTimeout(poll, pollInterval);
            return;
          }
          if (error.message === 'SLOW_DOWN') {
            setTimeout(poll, pollInterval + 5000);
            return;
          }
          if (error.message === 'EXPIRED_TOKEN') {
            setAuthState(prev => ({
              ...prev,
              error: 'Authentication expired. Please try again.'
            }));
            setIsPolling(false);
            setDeviceFlow(null);
            return;
          }
          if (error.message === 'ACCESS_DENIED') {
            setAuthState(prev => ({
              ...prev,
              error: 'Authentication was denied.'
            }));
            setIsPolling(false);
            setDeviceFlow(null);
            return;
          }

          setAuthState(prev => ({
            ...prev,
            error: error.message
          }));
        }
        setIsPolling(false);
        setDeviceFlow(null);
      }
    };

    setTimeout(poll, pollInterval);
  }, [deviceFlow, isPolling]);

  const logout = useCallback(() => {
    sessionStorage.removeItem(TOKEN_STORAGE_KEY);
    sessionStorage.removeItem(USER_STORAGE_KEY);
    setAuthState({
      isAuthenticated: false,
      token: null,
      user: null,
      isLoading: false,
      error: null
    });
    setDeviceFlow(null);
    setIsPolling(false);
  }, []);

  const clearError = useCallback(() => {
    setAuthState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    ...authState,
    deviceFlow,
    isPolling,
    startDeviceFlow,
    startPolling,
    logout,
    clearError
  };
}
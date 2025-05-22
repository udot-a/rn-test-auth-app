import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import {
  login as loginApi,
  logout as logoutApi,
  refreshTokens as refreshTokensApi,
  fetchUserProfile,
  authApi,
} from '@api/authApi';
import {
  saveTokens,
  getTokens,
  saveUser,
  getUser,
  clearAuthStorage,
} from '@storage/tokenStorage';
import type { AuthState, LoginCredentials } from '../types/auth';
import { URLS_WITHOUT_TOKEN } from '@constants/api.ts';
import { isTokenExpired, willTokenExpireIn } from '@utils/authUtils.ts';

export const useAuth = () => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    tokens: null,
    isLoading: true,
    isAuthenticated: false,
    error: null,
  });

  useEffect(() => {
    const requestInterceptor = authApi.interceptors.request.use(
      async (config) => {
        const noTokenRequired = URLS_WITHOUT_TOKEN.some(url => config.url?.includes(url));

        if (noTokenRequired) {
          return config;
        }

        const tokens = await getTokens();
        if (tokens?.accessToken) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = authApi.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // If the error is not 401 or we've already tried to refresh, reject
        if (error.response?.status !== 401 || originalRequest._retry) {
          return Promise.reject(error);
        }

        originalRequest._retry = true;

        try {
          const tokens = await getTokens();
          if (!tokens?.refreshToken || isTokenExpired(tokens?.refreshToken)) {
            await clearAuthStorage();
            setAuthState(prev => ({
              ...prev,
              user: null,
              tokens: null,
              isAuthenticated: false,
              error: 'Session expired, please login again',
            }));
            return Promise.reject(error);
          }

          const newTokens = await refreshTokensApi({
            refreshToken: tokens.refreshToken,
            expiresInMins: 5,
          });
          await saveTokens(newTokens);

          originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
          return authApi(originalRequest);
        } catch (refreshError) {
          await clearAuthStorage();
          setAuthState(prev => ({
            ...prev,
            user: null,
            tokens: null,
            isAuthenticated: false,
            error: 'Session expired, please login again',
          }));
          return Promise.reject(error);
        }
      }
    );

    return () => {
      authApi.interceptors.request.eject(requestInterceptor);
      authApi.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const [storedTokens, storedUser] = await Promise.all([
          getTokens(),
          getUser(),
        ]);

        const isAuthenticated = !!(storedTokens && storedUser);

        setAuthState({
          user: storedUser,
          tokens: storedTokens,
          isLoading: false,
          isAuthenticated,
          error: null,
        });

        if (isAuthenticated) {
          queryClient.invalidateQueries({ queryKey: ['user'] });
        }
      } catch (error) {
        setAuthState({
          user: null,
          tokens: null,
          isLoading: false,
          isAuthenticated: false,
          error: 'Failed to restore authentication state',
        });
      }
    };

    initializeAuth();
  }, [queryClient]);

  const { data: userData, isFetching } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUserProfile,
    enabled: authState.isAuthenticated,
  });

  useEffect(() => {
    if (userData) {
      // This is equivalent to your onSuccess callback
      saveUser(userData);
      setAuthState(prev => ({
        ...prev,
        user: userData,
      }));
    }
  }, [userData]);

  const loginMutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      const { user, tokens } = data;
      await saveTokens(tokens);
      await saveUser(user);

      setAuthState({
        user,
        tokens,
        isLoading: false,
        isAuthenticated: true,
        error: null,
      });

      queryClient.setQueryData(['user'], user);
    },
    onError: (error: any) => {
      setAuthState(prev => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || 'Login failed',
      }));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const tokens = await getTokens();
      if (tokens?.refreshToken) {
        return logoutApi();
      }
    },
    onSettled: async () => {
      await clearAuthStorage();

      setAuthState({
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        error: null,
      });

      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  const refreshToken = useCallback(async (): Promise<boolean> => {
    try {
      const tokens = await getTokens();

      if (!tokens?.refreshToken) {

        return false;
      }

      const newTokens = await refreshTokensApi({
        refreshToken: tokens.refreshToken,
        expiresInMins: 5,
      });
      await saveTokens(newTokens);

      setAuthState(prev => ({
        ...prev,
        tokens: newTokens,
        error: null,
      }));

      return true;
    } catch (error) {
      // If refresh fails, log the user out
      await clearAuthStorage();

      setAuthState({
        user: null,
        tokens: null,
        isLoading: false,
        isAuthenticated: false,
        error: 'Session expired, please login again',
      });

      return false;
    }
  }, []);

  useEffect(() => {
    if (!authState.isAuthenticated) {

      return;
    }

    const checkTokenExpiry = async () => {
      const tokens = await getTokens();
      if (!tokens) {

        return;
      }

      if (willTokenExpireIn(tokens.accessToken, 2)) {
        refreshToken();
        console.log('token is close to expiry (less than 5 minutes)!!!');
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);

    return () => clearInterval(interval);
  }, [authState.isAuthenticated, refreshToken]);

  const login = (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
    loginMutation.mutate(credentials);
  };

  const logout = () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    logoutMutation.mutate();
  };

  return {
    ...authState,
    login,
    logout,
    refreshToken,
    isRefreshing: isFetching,
    removeError: () => {
      setAuthState(prev => ({ ...prev, error: null }));
    },
  };
};

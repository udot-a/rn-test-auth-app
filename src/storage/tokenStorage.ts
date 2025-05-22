import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens, User } from '../types/auth';

export const ACCESS_TOKEN_KEY = 'auth_access_token';
export const REFRESH_TOKEN_KEY = 'auth_refresh_token';
export const TOKEN_EXPIRY_KEY = 'auth_token_expiry';
export const USER_KEY = 'auth_user';

export const saveTokens = async (tokens: AuthTokens): Promise<void> => {
  try {
    await AsyncStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
  } catch (error) {
    console.log('Error saving tokens to storage', error);
    throw error;
  }
};

export const getTokens = async (): Promise<AuthTokens | null> => {
  try {
    const accessToken = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN_KEY);

    if (!accessToken || !refreshToken) {
      return null;
    }

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.log('Error retrieving tokens from storage', error);
    return null;
  }
};

export const saveUser = async (user: User): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.log('Error saving user to storage', error);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const userJson = await AsyncStorage.getItem(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.log('Error retrieving user from storage', error);
    return null;
  }
};

export const clearAuthStorage = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove([
      ACCESS_TOKEN_KEY,
      REFRESH_TOKEN_KEY,
      TOKEN_EXPIRY_KEY,
      USER_KEY,
    ]);
  } catch (error) {
    console.log('Error clearing auth storage', error);
  }
};

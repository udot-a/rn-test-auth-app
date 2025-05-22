import axios, { AxiosResponse } from 'axios';
import type {
  AuthTokens,
  LoginApiResponse,
  LoginCredentials,
  RefreshTokenRequest,
  User,
} from '../types/auth';
import { API_URL } from '@constants/api.ts';

export const authApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

if (__DEV__) {
  // Request interceptor for logging
  authApi.interceptors.request.use(
    config => {
      console.log(`🚀 REQUEST: ${config?.method?.toUpperCase()} ${config.url}`);
      console.log('Headers:', JSON.stringify(config.headers, null, 2));

      if (config.data) {
        console.log('Body:', JSON.stringify(config.data, null, 2));
      }

      // Add a timestamp to track duration
      // @ts-ignore
      config.metadata = { startTime: new Date() };

      return config;
    },
    error => {
      console.log('❌ Request Error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor for logging
  authApi.interceptors.response.use(
    response => {
      // @ts-ignore
      const duration = new Date() - response.config.metadata.startTime;
      console.log(`✅ RESPONSE: ${response.status} (${duration}ms)`);
      console.log('Data:', JSON.stringify(response.data, null, 2));

      return response;
    },
    error => {
      // @ts-ignore
      const duration = error.config ? new Date() - error.config.metadata.startTime : 0;

      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(`❌ RESPONSE ERROR: ${error.response.status} (${duration}ms)`);
        console.log('Response:', JSON.stringify(error.response.data, null, 2));
      } else if (error.request) {
        // The request was made but no response was received
        console.log(`❌ NO RESPONSE (${duration}ms):`, error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('❌ ERROR:', error.message);
      }

      return Promise.reject(error);
    }
  );

  console.log('🔍 Network logging enabled in development mode');
}

export const login = async (credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens  }> => {
  const response: AxiosResponse<LoginApiResponse> = await authApi.post('/auth/login', credentials);

  const tokens: AuthTokens = {
    accessToken: response.data.accessToken,
    refreshToken: response.data.refreshToken,
  };

  return {
    user: {
      id: response.data.id,
      email: response.data.email,
      name: `${response.data.firstName} ${response.data.lastName}`,
      image: response.data.image,
      username: response.data.username,
      firstName: response.data.firstName,
      lastName: response.data.lastName,
    },
    tokens,
  };
};

// export const register = async (userData: LoginCredentials & { name: string }): Promise<{ user: User; tokens: AuthTokens }> => {
//   // DummyJSON doesn't have a real register endpoint, so we'll use the add user endpoint
//   // and then perform a login
//   const [firstName, lastName] = userData.name.split(' ');
//
//   // Add user
//   await authApi.post('/users/add', {
//     firstName: firstName || userData.name,
//     lastName: lastName || '',
//     email: userData.email,
//     username: userData.email.split('@')[0],
//     password: userData.password
//   });
//
//   // Then login with the new user
//   return login(userData);
// };

export const refreshTokens = async (refreshData: RefreshTokenRequest): Promise<AuthTokens> => {

  const response: AxiosResponse<AuthTokens> = await authApi.post('/auth/refresh', refreshData);

  return {
    ...response.data,
  };
};

export const logout = async (): Promise<void> => {

  return;
};

export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await authApi.get('/auth/me');

    return {
     ...response.data,
    };
  } catch (error) {
    console.log('Error fetching user profile', error);
    throw error;
  }
};

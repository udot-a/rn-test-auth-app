import { jwtDecode } from 'jwt-decode';

export const decodeJWT = (token?: string) => {
  try {
    if (!token) return null;

    return jwtDecode(token); // returns the decoded payload
  } catch (error) {
    console.log('Error decoding JWT token:', error);
    return null;
  }
};
// Helper function to check if token is expired
export const isTokenExpired = (token?: string) => {
  if (!token) {return true;}

  const decodedToken = decodeJWT(token);
  if (!decodedToken) {return true;}

  // exp claim in JWT is in seconds since epoch
  const currentTime = Math.floor(Date.now() / 1000);
  return decodedToken.exp! < currentTime;
};

// Helper function to check if token will expire within specified minutes
export const willTokenExpireIn = (token: string, minutes: number) => {
  if (!token) {return true;}

  const decodedToken = decodeJWT(token);
  if (!decodedToken || !decodedToken.exp) {return true;}

  // Convert minutes to seconds for comparison with JWT exp
  const bufferTime = minutes * 60;

  // Current time + buffer time in seconds
  const futureTime = Math.floor(Date.now() / 1000) + bufferTime;

  // If expiration time is less than our future check time, token will expire within specified minutes
  return decodedToken.exp < futureTime;
};

// Get remaining time in token (in seconds)
export const getTokenRemainingTime = (token?: string) => {
  if (!token) {return 0;}

  const decodedToken = decodeJWT(token);
  if (!decodedToken || !decodedToken.exp) {return 0;}

  const currentTime = Math.floor(Date.now() / 1000);
  const remainingTime = decodedToken.exp - currentTime;

  // Return remaining time in seconds (or 0 if already expired)
  return remainingTime > 0 ? remainingTime : 0;
};

# TestAuthApp

React Native + TypeScript authentication flow: validated login, JWT session persistence, token refresh and auth-gated navigation.

![React Native](https://img.shields.io/badge/React_Native-0.79-61DAFB?style=flat-square&logo=react&logoColor=black)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React Navigation](https://img.shields.io/badge/React_Navigation-7-6B52AE?style=flat-square&logo=react&logoColor=white)
![TanStack Query](https://img.shields.io/badge/TanStack_Query-5-FF4154?style=flat-square&logo=reactquery&logoColor=white)
![TanStack Form](https://img.shields.io/badge/TanStack_Form-1-F0B429?style=flat-square)
![Axios](https://img.shields.io/badge/Axios-1.9-5A29E4?style=flat-square&logo=axios&logoColor=white)
![Platforms](https://img.shields.io/badge/platform-iOS_%7C_Android-lightgrey?style=flat-square)

**Author:** Andrii Udot · [CV](https://udot-a.github.io/front-end-developer-cv/)

## Overview

TestAuthApp is a compact test application built around one complete authentication flow. It signs in against the public [DummyJSON](https://dummyjson.com/docs/auth) auth API, persists the session in AsyncStorage, keeps the access token valid through JWT expiry checks and a 401 refresh-and-retry interceptor, and switches between the auth and app navigators based on session state.

## Features

- **Login form** built with TanStack Form: field-level validation (required, min 6 characters), inline error text, clear-input button, floating label, and a submit button that is disabled while fields are invalid or a request is pending.
- **Session persistence**: access token, refresh token and user profile are stored in AsyncStorage and restored on app start.
- **Token lifecycle**: the `Authorization: Bearer` header is attached automatically; on a `401` the app refreshes the token once and replays the request. A 60-second timer decodes the JWT (`jwt-decode`) and refreshes it if it expires within 2 minutes.
- **Auth-gated navigation**: a root stack renders either the Auth navigator (start screen → Login) or the App navigator (Profile), with no manual redirects after login or logout.
- **Loading screen** shown while the session is restored and while login/logout is in progress.
- **Profile screen** with a personalised header greeting and logout, which clears storage and the cached `['user']` query.
- **Error handling**: server messages (e.g. invalid credentials) appear in an error banner and clear when an input is focused; a failed refresh logs the user out with a "Session expired" message.
- **Dev-only network logger**: Axios interceptors log method, URL, payload, status and duration in `__DEV__` builds.

## Tech stack

| Area | Tools |
| --- | --- |
| Core | React Native 0.79 (Hermes), React 19, TypeScript 5 |
| Navigation | React Navigation 7 (native stack), react-native-screens, react-native-gesture-handler |
| Data & forms | TanStack Query 5 (`useQuery` / `useMutation`), TanStack Form 1 |
| Networking & auth | Axios (instance + interceptors), jwt-decode, AsyncStorage |
| UI | react-native-linear-gradient, react-native-svg + svg-transformer (SVGs as components), Noto Sans font |
| Tooling | Babel module-resolver path aliases (`@api`, `@screens`, …), ESLint, Prettier, Jest |

## Architecture

```
App.tsx
└─ GestureHandlerRootView → QueryClientProvider → AuthProvider → NavigationContainer
   └─ RootNavigator
      ├─ isLoading       → LoadingScreen
      ├─ isAuthenticated → AppNavigator  (Profile)
      └─ otherwise       → AuthNavigator (First → Login)
```

1. **`AuthProvider`** (`src/context/AuthContext.tsx`) calls `useAuth()` once and exposes its state and actions (`login`, `logout`, `refreshToken`, `removeError`) through `useAuthContext()`.
2. **`useAuth`** (`src/hooks/useAuth.ts`) owns the auth state. On mount it restores tokens and user from storage; login and logout are TanStack mutations; the profile is a `['user']` query against `/auth/me` that runs only when authenticated.
3. **`authApi`** (`src/api/authApi.ts`) is a shared Axios instance. `useAuth` registers its interceptors: token injection (skipping public endpoints listed in `src/constants/api.ts`) and 401 handling via `/auth/refresh`. If the refresh token is missing or expired, storage is cleared and the user is logged out.
4. **`RootNavigator`** (`src/navigation/RootNavigator.tsx`) reads `isLoading` / `isAuthenticated` and renders the matching navigator, so a state change alone moves the user between flows.

```
src/
├── api/            # Axios instance: login, refresh, profile, dev logging
├── assets/         # Noto Sans font, SVG icons
├── components/     # FormInput, FormButton, ErrorMessage
├── constants/      # API base URL, public endpoints, screen names
├── context/        # AuthProvider + useAuthContext
├── hooks/          # useAuth: state, mutations, interceptors, refresh timer
├── navigation/     # Root, Auth and App native-stack navigators
├── screens/        # First, Login, Loading, Profile
├── storage/        # AsyncStorage helpers for tokens and user
├── styles/         # Colors, typography, shared text styles
├── types/          # Auth, form and navigation types
└── utils/          # JWT helpers, font-scaling lock
```

## Getting started

**Prerequisites:** Node.js >= 18, Xcode with CocoaPods (iOS 15.1+), Android Studio with SDK 35 and JDK 17. See the official [environment setup guide](https://reactnative.dev/docs/set-up-your-environment).

```sh
npm install

# iOS only: install CocoaPods via Bundler, then the pods
bundle install
cd ios && bundle exec pod install && cd ..

npm start            # Metro bundler (cache reset)

# in a second terminal
npm run ios
npm run android
```

**API:** the base URL is set in `src/constants/api.ts` (`API_URL`, the public DummyJSON API). Sign in with any test user from the [DummyJSON users list](https://dummyjson.com/docs/users).

**Release APK:** `npm run android:build-apk` calls `gradlew.bat` (Windows). On macOS/Linux, run `cd android && ./gradlew assembleRelease`. The APK is written to `android/app/build/outputs/apk/release/`. Release builds are signed with the template debug keystore, so they are for testing only.

## Scripts

| Command | Description |
| --- | --- |
| `npm start` | Start Metro with a cleared cache |
| `npm run ios` / `npm run android` | Build and launch on a simulator, emulator or device |
| `npm run android:build-apk` | Build a release APK (Windows, `gradlew.bat`) |
| `npm run lint` | Run ESLint (`@react-native` config) |
| `npm test` | Run Jest |

## Testing

Jest runs with the `react-native` preset. `__tests__/App.test.tsx` is a smoke test that renders the full `<App />` tree with `react-test-renderer`.

---

Built by **Andrii Udot** — [CV](https://udot-a.github.io/front-end-developer-cv/) · [LinkedIn](https://www.linkedin.com/in/andrii-udot-09181519a)

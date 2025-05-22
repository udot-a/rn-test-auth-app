import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screens } from '@constants/screens.ts';
import { ProfileScreen } from '@screens/ProfileScreen';
import { RootStackParamList } from '../types/navigation.ts';
import { useAuthContext } from '@context/AuthContext.tsx';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { user } = useAuthContext();

  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen name={screens.profile} component={ProfileScreen} options={{ headerTitle: `Hi, ${user?.name} !!!`}} />
    </Stack.Navigator>
  );
};

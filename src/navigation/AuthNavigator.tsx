import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { screens } from '@constants/screens.ts';
import { RootStackParamList } from '../types/navigation.ts';
import { LoginScreen } from '@screens/LoginScreen';
import { FirstScreen } from '@screens/FirstScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={screens.first}>
      <Stack.Screen name={screens.login} component={LoginScreen} />
      <Stack.Screen name={screens.first} component={FirstScreen} />
    </Stack.Navigator>
  );
};

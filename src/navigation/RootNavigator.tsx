import { useAuthContext } from '@context/AuthContext.tsx';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthNavigator } from './AuthNavigator.tsx';
import { screens } from '@constants/screens.ts';
import { LoadingScreen } from '@screens/LoadingScreen';
import { AppNavigator } from './AppNavigator.tsx';

const RootStack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  console.log('isAuthenticated', isAuthenticated);
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <RootStack.Screen name={screens.app} component={AppNavigator} />
      ) : (
        <RootStack.Screen name={screens.auth} component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
};

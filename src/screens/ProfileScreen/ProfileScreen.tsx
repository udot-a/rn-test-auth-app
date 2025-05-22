import React, { FC, useActionState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import s from '@styles/commonStyles';
import { RootStackParamList } from '../../types/navigation.ts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuthContext } from '@context/AuthContext.tsx';
import { FormButton } from '@components/FormButton';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export const ProfileScreen: FC<Props> = () => {
  const { logout } = useAuthContext();

  return (
    <View style={styles.container}>
      <FormButton
        title="Logout"
        onPress={logout}
        type="secondary"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
    padding: 20,
  },
});

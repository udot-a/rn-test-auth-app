import React, { FC } from 'react';
import { RootStackParamList } from '../../types/navigation.ts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import {
  View,
  StyleSheet,

} from 'react-native';
import { FormButton } from '@components/FormButton';
import { screens } from '@constants/screens.ts';

type Props = NativeStackScreenProps<RootStackParamList, 'First'>;


export const FirstScreen: FC<Props> = (props) => {
  const { navigation } = props;

  return (
    <View style={styles.container}>
      <FormButton
        title="Go to login"
        onPress={() => navigation.navigate(screens.login)}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  button: {
    marginTop: 10,
  },
});

import { FC } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import ErrorIcon from '@assets/icons/attention.svg';
import s from '@styles/commonStyles';
import { Colors } from '@styles/customColors.ts';

interface ErrorMessageProps {
  error: string | null;
}

export const ErrorMessage: FC<ErrorMessageProps> = (props) => {
  const { error } = props;

  if (!error) {
    return null;
  }

  return (
    <View style={styles.container}>
     <ErrorIcon />
      <Text style={styles.text}>
        {error}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: Colors.errorBackground,
    width: '100%',
    height: 53,
    paddingHorizontal: 8,
  },
  text: {
    ...s.tinyText,
    color: Colors.invertedPrimaryText,
    marginLeft: 4,
  },
});

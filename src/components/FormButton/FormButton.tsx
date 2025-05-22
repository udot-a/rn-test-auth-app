import React, { useMemo } from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle, Platform, View,
} from 'react-native';
import { Colors } from '@styles/customColors';
import s from '@styles/commonStyles';
import LinearGradient from 'react-native-linear-gradient';

export type ButtonType = 'primary' | 'secondary';

const mainGradient = ['#51C7FE', '#338BFF'];

interface FormButtonProps {
  title: string;
  onPress: () => void;
  type?: ButtonType;
  isLoading?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const FormButton: React.FC<FormButtonProps> = (props) => {
  const {
    title,
    onPress,
    isLoading = false,
    disabled = false,
    type = 'primary',
    style,
    textStyle,
  } = props;

  const content = useMemo(() => {
    if (type === 'primary') {
      return (
        <LinearGradient
          colors={mainGradient}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={[
            styles.gradientBox,
            styles.button,
            (disabled || isLoading) && { opacity: 0.32 },
            style,
          ]}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={[styles.buttonText, textStyle]}>{title}</Text>
          )}
        </LinearGradient>
      );
    }

    return (
      <View
        style={[
          styles.button,
          { backgroundColor: Colors.inputBackground},
          style,
        ]}
      >
        {isLoading ? (
        <ActivityIndicator color={Colors.invertedPrimaryText}/>
        ) : (
        <Text style={[styles.buttonText, { color: Colors.primaryText }, textStyle]}>{title}</Text>
        )}
      </View>
    );
  }, [disabled, isLoading, style, textStyle, title, type]);

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
    >
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // backgroundColor: '#007BFF',
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
  },
  buttonDisabled: {
    backgroundColor: '#b3d7ff',
  },
  buttonText: {
    color: Colors.invertedPrimaryText,
    ...s.mainTextMedium,
  },
  gradientBox: {
    ...Platform.select({
      ios: {
        shadowColor: '#338BFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

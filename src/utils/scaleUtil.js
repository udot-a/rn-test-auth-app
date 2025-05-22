import { Text, TextInput } from 'react-native';

export const prohibitChangingFontSize = () => {
  if (!Text.defaultProps) {
    Text.defaultProps = {};
  }
  Text.defaultProps.allowFontScaling = false;

  if (!TextInput.defaultProps) {
    TextInput.defaultProps = {};
  }
  TextInput.defaultProps.allowFontScaling = false;
};

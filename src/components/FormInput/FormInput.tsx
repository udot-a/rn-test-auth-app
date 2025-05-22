import React, { FC, memo, useCallback, useMemo, useRef, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput, TextInputProps, TouchableOpacity,
  View,
} from 'react-native';
import s from '@styles/commonStyles';
import {Colors} from '@styles/customColors';
import Close from '../../assets/icons/close.svg';

interface FormInputProps extends TextInputProps {
  label: string;
  errorText: string;
  onSubmit?: () => void;
  labelContainerColor?: string;
  isMarginTop?: boolean;
  clearValue?: () => void;
  setOuterFocus?: (v: boolean) => void
}
const FormInput: FC<FormInputProps> = (props) => {
  const {
    label,
    errorText,
    value,
    style,
    onBlur,
    onFocus,
    onSubmit,
    onSubmitEditing,
    editable = true,
    labelContainerColor = Colors.transparent,
    isMarginTop = true,
    clearValue,
    setOuterFocus,
    ...restOfProps
  } = props;
  const [isFocus, setIsFocus] = useState(false);

  const inputRef = useRef<TextInput>(null);
  const styleLabel = useMemo(() => {
    const commonLabelStyles = styles.labelText;

    if (errorText) {
      return {
        ...commonLabelStyles,
        color: Colors.errorText,
      };
    }

    if (isFocus) {
      return {
        ...commonLabelStyles,
        color: Colors.blue,
      };
    }

    if (!editable) {
      return {
        ...commonLabelStyles,
        color: Colors.secondaryText,
      };
    }
    return {
      ...commonLabelStyles,
      color: Colors.blue,
    };
  }, [errorText, isFocus, editable]);

  const onFocusInput = () => {
    setIsFocus(true);
  };

  const onBlurInput = () => {
    setIsFocus(false);
  };

  const inputBorderColor = useMemo(() => {
    if (errorText) {
      return Colors.errorText;
    }

    if (isFocus) {
      return Colors.blue;
    }

    if (!editable) {
      return Colors.secondaryText;
    }

    return Colors.borderColor;
  }, [editable, errorText, isFocus]);

  const handleClosePress = useCallback(() => {
    clearValue?.();
    inputRef.current?.focus?.();
  }, [clearValue]);

  console.log('Value: ', value);
  return (
    <>
      <View
        style={[
          styles.container,
          style,
          isMarginTop && { marginTop: 16},
          {
            borderColor: inputBorderColor,
          },
        ]}>
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {
              color: value
                ? Colors.primaryText
                : Colors.secondaryText,
            },
          ]}
          value={value ? value : undefined}
          {...restOfProps}
          autoCorrect={false}
          autoComplete="off"
          placeholderTextColor={Colors.secondaryText}
          editable={editable}
          onBlur={event => {
            onBlur?.(event);
            onBlurInput();
            setOuterFocus?.(false);
          }}
          onFocus={event => {
            onFocus?.(event);
            onFocusInput();
            setOuterFocus?.(true);
          }}
          onSubmitEditing={event => {
            onSubmit?.();
            onSubmitEditing?.(event);
          }}
        />
        {label && value ? (
          <View
            style={[
              styles.labelContainer,
              {backgroundColor: labelContainerColor},
            ]}>
            <Text style={styleLabel}>{label}</Text>
            <View style={styles.labelBackground} />
          </View>
        ) : null}
          <TouchableOpacity onPress={handleClosePress}>
            <Close />
          </TouchableOpacity>
      </View>
      {!!errorText && <Text style={styles.error}>{errorText}</Text>}
    </>
  );
};

const styles = StyleSheet.create({
  labelBackground: {
    backgroundColor: Colors.inputBackground,
    height: 10,
    bottom: 0,
    right: 0,
    left: 0,
    position: 'absolute',
  },
  hintText: {
    ...s.tinyText,
    color: Colors.primaryText,
    marginTop: 4,
    paddingLeft: 12,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    height: 53,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.borderColor,
  },
  newTypeContainer: {
    backgroundColor: Colors.inputBackground,
    borderColor: Colors.inputBackground,
  },
  input: {
    zIndex: 99,
    flex: 1,
    borderWidth: 0,
    color: Colors.primaryText,
    ...s.mainText,
    lineHeight: 20,
  },
  inputAmount: {
    paddingHorizontal: 30,
  },
  labelContainer: {
    transform: [
      {
        translateY: 0,
      },
    ],
    paddingHorizontal: 4,
    position: 'absolute',
    left: 10,
    height: 18,
    lineHeight: 18,
    zIndex: 10,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    borderRadius: 4,
  },
  labelText: {
    zIndex: 100,
    ...s.tinyText,
    color: Colors.primaryText,
  },
  error: {
    marginTop: 4,
    marginLeft: 12,
    ...s.tinyText,
    color: Colors.errorText,
  },
  showHide: {
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
});

export default memo(FormInput);

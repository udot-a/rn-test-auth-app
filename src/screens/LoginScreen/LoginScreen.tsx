import React, { FC, useEffect, useState } from 'react';
import s from '@styles/commonStyles';
import { RootStackParamList } from '../../types/navigation.ts';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Colors } from '@styles/customColors.ts';

import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView, Alert,
} from 'react-native';
import { FormInput } from '@components/FormInput';
import { FormButton } from '@components/FormButton';
import { useAuthContext } from '@context/AuthContext';
import { useForm } from '@tanstack/react-form';
import { LoginFormValues } from '../../types/form.ts';
import { ErrorMessage } from '@components/ErrorMessage';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;


export const LoginScreen: FC<Props> = () => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const {error, login, isLoading, removeError} = useAuthContext();

  const initialData: LoginFormValues = {
    username: '',
    password: '',
  };

  const form = useForm({
    defaultValues: initialData,

    onSubmit: async ({value}) => {
      try {
        await login({...value, expiresInMins: 3});
      } catch (error) {
        Alert.alert('Login Error', error instanceof Error ? error.message : 'Failed to login');
      }
    },
  });

  useEffect(() => {
    if (error && isInputFocused) {
      removeError();
    }
  }, [error, isInputFocused, removeError]);

  const validateUsername = ({value}: { value: string }) => {
    if (!value) {
      return 'Username is required';
    }
    if (value.length < 6) {
      return 'Username must be at least 6 characters';
    }
    return undefined;
  };

  const validatePassword = ({value}: { value: string }) => {
    if (!value) {
      return 'Password is required';
    }
    if (value.length < 6) {
      return 'Password must be at least 6 characters';
    }
    return undefined;
  };

  // @ts-ignore
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/*@ts-ignore*/}
          <form.Field
            name="username"
            validators={{
              onChange: validateUsername,
            }}
            children={(field) => (
              <FormInput
                label="Username"
                errorText={
                  field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors.join(',') : ''
                }
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                clearValue={() => field.handleChange('')}
                setOuterFocus={setIsInputFocused}
                placeholder="Username"
              />
            )}/>
          {/*@ts-ignore*/}
          <form.Field
            name="password"
            validators={{
              onChange: validatePassword,
            }}
            children={(field) => (
              <FormInput
                label="Password"
                errorText={
                  field.state.meta.isTouched && !field.state.meta.isValid ? field.state.meta.errors.join(',') : ''
                }
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                clearValue={() => field.handleChange('')}
                secureTextEntry
                setOuterFocus={setIsInputFocused}
                placeholder="Password"
              />
            )
            }
          />

          <View style={styles.errorContainer}>
            <ErrorMessage error={error}/>
          </View>
          <FormButton
            title="Login"
            onPress={() => form.handleSubmit()}
            isLoading={isLoading}
            disabled={!form.state.canSubmit}
            style={styles.button}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    paddingVertical: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    ...s.heading1,
    color: Colors.primaryText,
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  linkButton: {
    marginTop: 15,
    alignItems: 'center',
  },
});

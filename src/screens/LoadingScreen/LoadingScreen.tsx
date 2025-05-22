import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';

export const LoadingScreen = ({
                         message = 'Loading...',
                         color = '#0066CC',
                         backgroundColor = 'rgba(255, 255, 255, 0.9)',
                         fullScreen = true,
                         size = 'large',
                         customStyles = {},
                       }) => {
  return (
    <View
      style={[
        styles.container,
        fullScreen && styles.fullScreen,
        { backgroundColor },
        customStyles,
      ]}
    >
      <View style={styles.loadingBox}>
        <ActivityIndicator size="large" color={color} />
        {message ? <Text style={[styles.loadingText, { color }]}>{message}</Text> : null}
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
  },
  fullScreen: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width,
    height,
    zIndex: 999,
  },
  loadingBox: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});

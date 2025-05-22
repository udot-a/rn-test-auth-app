module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@utils': './src/utils',
          '@styles': './src/styles',
          '@assets': './src/assets',
          '@api': './src/api',
          '@context': './src/context',
          '@navigation': './src/navigation',
          '@storage': './src/storage',
          '@types': './src/types',
          '@constants': './src/constants',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};

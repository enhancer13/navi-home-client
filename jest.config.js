module.exports = {
  'coverageReporters': [
    'json-summary',
  ],
  'testEnvironment': 'jest-environment-jsdom',
  'preset': 'react-native',
  'moduleFileExtensions': [
    'ts',
    'tsx',
    'js',
    'jsx',
    'json',
    'node',
  ],
  'setupFiles': [
    '<rootDir>/__mocks__/jest.setup.js',
    '<rootDir>/__mocks__/react-native-gesture-handler.js',
  ],
  'transform': {
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
  },
  'transformIgnorePatterns': [
    'node_modules/(?!(jest-)?@react-native|react-native|react-native-device-info|react-clone-referenced-element|@react-native-community|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|expo(nent)?|@expo(nent)?/.*|react-native-keychain|@react-native/polyfills|@react-native-firebase/messaging|@react-native-firebase|react-native-video|react-native-gesture-handler|fetch-mock)',
  ],
};

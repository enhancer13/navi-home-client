jest.mock('react-native-device-info', () => ({
  isTablet: jest.fn(() => false)
}));

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setAutoInitEnabled: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
  })),
}));

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(() => ({
    dispatch: jest.fn(),
  })),
  StackActions: {
    popToTop: jest.fn(),
  },
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const mockStorage = {};

  return {
    setItem: jest.fn(async (key, value) => {
      mockStorage[key] = value;
    }),
    multiSet: jest.fn(async (keyValuePairs) => {
      keyValuePairs.forEach(([key, value]) => {
        mockStorage[key] = value;
      });
    }),
    getItem: jest.fn(async (key) => {
      return mockStorage[key] || null;
    }),
    multiGet: jest.fn(async (keys) => {
      return keys.map((key) => [key, mockStorage[key] || null]);
    }),
    removeItem: jest.fn(async (key) => {
      delete mockStorage[key];
    }),
    multiRemove: jest.fn(async (keys) => {
      keys.forEach((key) => delete mockStorage[key]);
    }),
    getAllKeys: jest.fn(async () => {
      return Object.keys(mockStorage);
    }),
  };
});

jest.mock('react-native-keychain', () => {
  return {
    getSupportedBiometryType: jest.fn(),
  };
});




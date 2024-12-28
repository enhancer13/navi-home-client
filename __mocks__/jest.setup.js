jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    setAutoInitEnabled: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
  })),
}));

jest.mock('@react-native-firebase/auth', () => ({
  __esModule: true,
  default: () => ({
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
  }),
}));

jest.mock('react-native-device-info', () => {
  return {
    isTablet: jest.fn(() => false),
    getDeviceTypeSync: jest.fn(),
  };
});

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native');
  return {
    ...actualNav,
    useNavigation: jest.fn(() => ({
      dispatch: jest.fn(),
      setOptions: jest.fn(),
    })),
    useRoute: jest.fn(),
    createNavigatorFactory: jest.fn(),
    StackActions: {
      popToTop: jest.fn(),
    },
  };
});

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

global.setImmediate = (fn, ...args) => setTimeout(fn, 0, ...args);

require('jest-fetch-mock').enableMocks();

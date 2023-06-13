import { FlatList, ScrollView, TouchableOpacity, View } from 'react-native';

module.exports = {
  ScrollView,
  FlatList,
  TouchableOpacity,
  PanGestureHandler: View,
  attachGestureHandler: () => jest.fn(),
  createGestureHandler: () => jest.fn(),
  dropGestureHandler: () => jest.fn(),
  updateGestureHandler: () => jest.fn(),
  Direction: {
    RIGHT: 1,
    LEFT: 2,
    UP: 4,
    DOWN: 8,
  },
  State: {
    BEGAN: 'BEGAN',
    FAILED: 'FAILED',
    ACTIVE: 'ACTIVE',
    END: 'END',
    UNDETERMINED: 'UNDETERMINED',
  },
};

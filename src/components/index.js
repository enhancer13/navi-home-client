import { ActivityIndicator } from 'react-native';
import React from 'react';
import DefaultNavigationBar from './DefaultNavigationBar';
import LabeledBoolean from './EntityEditor/controls/LabeledBoolean';
import { GlobalStyles } from '../globals/GlobalStyles';

const LoadingActivityIndicator = (props) => {
  const { color } = props;
  return <ActivityIndicator size="large" color={color ? color : GlobalStyles.lightVioletColor} />;
};

export { DefaultNavigationBar, LoadingActivityIndicator, LabeledBoolean };

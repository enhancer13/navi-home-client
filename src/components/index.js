import {ActivityIndicator} from 'react-native';
import React from 'react';
import DefaultNavigationBar from './DefaultNavigationBar';
import LabeledBoolean from './EntityEditor/controls/LabeledBoolean';

const LoadingActivityIndicator = () => {
  return <ActivityIndicator size="large" color="#733DC0" />;
};

export {DefaultNavigationBar, LoadingActivityIndicator, LabeledBoolean};

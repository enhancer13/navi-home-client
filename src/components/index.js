import {ActivityIndicator, StatusBar} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../globals/GlobalStyles';
import changeNavigationBarColor from 'react-native-navigation-bar-color';

const LoadingActivityIndicator = () => {
  return <ActivityIndicator size="large" color="#733DC0" />;
};

const DefaultNavigationBar = () => {
  const {statusBar, navigationBar} = GlobalStyles;
  changeNavigationBarColor(navigationBar.backgroundColor, true, false);
  return (
    <StatusBar
      barStyle={statusBar.barStyle}
      hidden={false}
      backgroundColor={statusBar.backgroundColor}
      translucent={true}
      networkActivityIndicatorVisible={true}
    />
  );
};

export {DefaultNavigationBar, LoadingActivityIndicator};

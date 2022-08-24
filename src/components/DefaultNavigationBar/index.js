import changeNavigationBarColor from 'react-native-navigation-bar-color';
import { GlobalStyles } from '../../config/GlobalStyles';
import { StatusBar } from 'react-native';
import React from 'react';

const DefaultNavigationBar = () => {
  changeNavigationBarColor(GlobalStyles.lightBackgroundColor, true, false);
  return (
    <StatusBar
      barStyle="light-content"
      hidden={false}
      backgroundColor={GlobalStyles.violetBackgroundColor}
      translucent={true}
      networkActivityIndicatorVisible={true}
    />
  );
};

export default DefaultNavigationBar;

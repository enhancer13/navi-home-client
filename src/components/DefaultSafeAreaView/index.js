import { Platform, SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../../globals/GlobalStyles';

const DefaultSafeAreaView = (props) => (
  <SafeAreaView style={[props.style, styles.container]}>
    {props.children}
  </SafeAreaView>
);

export default DefaultSafeAreaView;

const styles = StyleSheet.create({
  container: {
    alignItems: 'stretch',
    backgroundColor: GlobalStyles.lightBackgroundColor,
    flex: 1,
    justifyContent: 'flex-start',
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
});

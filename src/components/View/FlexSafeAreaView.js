import {Platform, StyleSheet, View} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types'
import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../config/GlobalStyles';
import PropTypes from 'prop-types';

function FlexSafeAreaView(props) {
  const top = props.ignoreTopInsets ? 0 : useSafeAreaInsets().top;
  return (
    <SafeAreaView style={{...styles.container, ...props.style}}>
      {Platform.OS === 'ios' ? <View style={{...styles.topSafeArea, height: top}} /> : null}
      {props.children}
    </SafeAreaView>
  );
}

FlexSafeAreaView.propTypes = {
  style: ViewPropTypes.style,
  ignoreTopInsets: PropTypes.bool
};

const styles = StyleSheet.create({
  topSafeArea: {
    position: 'absolute',
    width: '100%',
    backgroundColor: GlobalStyles.violetBackgroundColor,
  },
  container: {
    flex: 1,
  },
});

export default FlexSafeAreaView;

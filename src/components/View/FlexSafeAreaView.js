import {Platform, StyleSheet, View} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types'
import React from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../config/GlobalStyles';
import PropTypes from 'prop-types';

function FlexSafeAreaView(props) {
  const insets = useSafeAreaInsets();
  const top = props.ignoreTopInsets ? 0 : insets.top;
  const bottom = props.ignoreBottomInsets ? 0 : insets.bottom;

  return (
    <View style={{...props.style, paddingTop: top, paddingBottom: bottom, flex: 1}}>
      {Platform.OS === 'ios' ? <View style={{...styles.topSafeArea, height: top}} /> : null}
      {props.children}
    </View>
  );
}

FlexSafeAreaView.propTypes = {
  style: ViewPropTypes.style,
  ignoreTopInsets: PropTypes.bool,
  ignoreBottomInsets: PropTypes.bool
};

const styles = StyleSheet.create({
  topSafeArea: {
    position: 'absolute',
    width: '100%',
    backgroundColor: GlobalStyles.violetBackgroundColor,
  },
});

export default FlexSafeAreaView;

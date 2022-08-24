import {Platform, StyleSheet, View} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types'
import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../../config/GlobalStyles';

function FlexSafeAreaViewInsets(props) {
  const insets = useSafeAreaInsets();
  const top = Platform.OS === 'ios' ? insets.top : 0;
  return (
    <View style={{...styles.container, ...props.style, paddingTop: top, paddingBottom: insets.bottom}}>
      <View style={{...styles.topSafeArea, height: top}} />
      {props.children}
    </View>
  );
}

FlexSafeAreaViewInsets.propTypes = {
  style: ViewPropTypes.style,
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

export default FlexSafeAreaViewInsets;

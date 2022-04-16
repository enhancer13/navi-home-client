import React from 'react';
import {StyleSheet, View} from 'react-native';
import {ViewPropTypes} from 'deprecated-react-native-prop-types'
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import PropTypes from 'prop-types';

function FlexContainer(props) {
  return (
    <View style={{...styles.container, ...props.style}}>
      {props.topTransparency ? (
        <LinearGradient
          colors={['rgba(255,255,255,0.5)', 'rgba(255,255,255,0)']}
          style={styles.topLinearGradient}
        />
      ) : null}
      {props.children}
      {props.bottomTransparency ? (
        <LinearGradient
          colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.5)']}
          style={styles.bottomLinearGradient}
        />
      ) : null}
    </View>
  );
}

FlexContainer.propTypes = {
  style: ViewPropTypes.style,
  bottomTransparency: PropTypes.bool,
  topTransparency: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomLinearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: hp(2),
    zIndex: 1,
  },
  topLinearGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: hp(2),
    zIndex: 1,
  },
});

export default FlexContainer;

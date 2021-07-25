import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import React from 'react';
import {StyleSheet, Text, View, ViewPropTypes} from 'react-native';
import PropTypes from 'prop-types';
import {GlobalStyles} from '../../../globals/GlobalStyles';

const Status = Object.freeze({
  NEW: 'New',
  UNMODIFIED: 'Unmodified',
  MODIFIED: 'Modified',
});

function StatusLabel(props) {
  const {status, style} = props;
  return status !== Status.UNMODIFIED ? (
    <View style={[styles.container, status === Status.NEW ? styles.newStatusContainer : styles.modifiedStatusContainer, style]}>
      <Text style={styles.text}>{status}</Text>
    </View>
  ) : null;
}

StatusLabel.propTypes = {
  status: PropTypes.string.isRequired,
  style: ViewPropTypes.style,
};

export {StatusLabel, Status};

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    height: hp(2),
    padding: 2,
  },
  modifiedStatusContainer: {
    backgroundColor: GlobalStyles.orangeBackgroundColor,
  },
  newStatusContainer: {
    backgroundColor: GlobalStyles.blueBackgroundColor,
  },
  text: {
    alignSelf: 'center',
    color: GlobalStyles.whiteTextColor,
    fontSize: hp(1),
  },
});

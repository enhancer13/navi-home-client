import { StyleSheet, Switch, Text, View } from 'react-native';
import { GlobalStyles } from '../../../config/GlobalStyles';
import React from 'react';
import PropTypes from 'prop-types';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { StatusLabel } from './StatusLabel';

function LabeledSwitch(props) {
  const { label, value, fieldStatus, onValueChange, editable } = props;
  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>{label}</Text>
        <StatusLabel style={styles.statusLabel} status={fieldStatus} />
      </View>
      <Switch
        value={value}
        onValueChange={(val) => editable && onValueChange(val)}
        trackColor={{
          false: GlobalStyles.lightGreyColor,
          true: GlobalStyles.lightVioletColor,
        }}
        thumbColor={value ? GlobalStyles.violetColor : GlobalStyles.greyColor}
      />
    </View>
  );
}

LabeledSwitch.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.bool.isRequired,
  editable: PropTypes.bool.isRequired,
  fieldStatus: PropTypes.string.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default LabeledSwitch;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    height: hp(3),
    justifyContent: 'space-between',
    marginRight: 5,
  },
  label: {
    color: GlobalStyles.blackTextColor,
    fontSize: GlobalStyles.defaultFontSize,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 0,
    paddingBottom: 0,
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statusLabel: {
    marginLeft: 10,
  },
});

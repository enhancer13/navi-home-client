import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { GlobalStyles } from '../../../globals/GlobalStyles';
import React from 'react';
import PropTypes from 'prop-types';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Icon } from 'react-native-elements';
import { StatusLabel } from './StatusLabel';
import DefaultText from '../../DefaultText';
import DefaultTextInput from '../../DefaultTextInput';

function LabeledInput(props) {
  const {
    label,
    iconName,
    iconType,
    iconLeft,
    iconRight,
    onIconPress,
    fieldStatus,
    showClear,
    onClear,
  } = props;
  const icon = iconName && (
    <TouchableOpacity onPress={onIconPress} style={styles.iconContainer}>
      <Icon
        name={iconName}
        type={iconType}
        color={GlobalStyles.violetIconColor}
        size={hp(4)}
      />
    </TouchableOpacity>
  );
  return (
    <View style={styles.columnContainer}>
      <View style={styles.rowContainer}>
        <DefaultText style={styles.label}>{label}</DefaultText>
        <StatusLabel style={styles.statusLabel} status={fieldStatus} />
      </View>
      <View style={styles.rowContainer}>
        {iconLeft && icon}
        <View style={styles.container}>
          <DefaultTextInput
            {...props}
            colorScheme={GlobalStyles.colorScheme.BLACK}
            style={styles.textInput}
          />
          {showClear && (
            <TouchableOpacity
              onPress={onClear}
              style={styles.clearIconContainer}
            >
              <Icon
                name={'remove'}
                type={'font-awesome'}
                color={GlobalStyles.lightGreyColor}
                size={hp(3)}
              />
            </TouchableOpacity>
          )}
        </View>
        {iconRight && icon}
      </View>
    </View>
  );
}

LabeledInput.propTypes = {
  label: PropTypes.string.isRequired,
  keyboardType: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  fieldStatus: PropTypes.string.isRequired,
  onChangeText: PropTypes.func,
  iconName: PropTypes.string,
  iconType: PropTypes.string,
  iconLeft: PropTypes.bool,
  iconRight: PropTypes.bool,
  onIconPress: PropTypes.func,
  showClear: PropTypes.bool,
  onClear: PropTypes.func,
};

export default LabeledInput;

const styles = StyleSheet.create({
  clearIconContainer: {
    alignItems: 'flex-end',
    bottom: 0,
    justifyContent: 'center',
    position: 'absolute',
    right: 10,
    top: 0,
  },
  columnContainer: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  iconContainer: {
    padding: 5,
  },
  label: {
    color: GlobalStyles.greyTextColor,
    fontWeight: 'bold',
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  statusLabel: {
    marginLeft: 10,
  },
  textInput: {
    backgroundColor: GlobalStyles.whiteBackgroundColor,
    borderColor: GlobalStyles.lightGreyColor,
    borderRadius: 5,
    borderWidth: 1,
    flexGrow: 1,
  },
});

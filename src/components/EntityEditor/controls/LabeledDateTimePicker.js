import { StyleSheet, View } from 'react-native';
import React, { Component } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import PropTypes from 'prop-types';
import LabeledInput from './LabeledInput';
import Moment from 'moment';
import Globals from '../../../globals/Globals';
import { Status } from './StatusLabel';

const pickerModes = Object.freeze({
  TIME: 'TIME',
  DATE: 'DATE',
  DATETIME: 'DATETIME',
});

export default class LabeledDateTimePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPicker: false,
      momentValue: null,
    };
  }

  onChange = (event, selectedValue) => {
    this.setState({
      showPicker: false,
    });
    if (selectedValue) {
      const momentValue = Moment(selectedValue);
      if (!momentValue.isSame(this.state.momentValue)) {
        const { mode, onChange } = this.props;
        onChange(momentValue.format(Globals.Formats[mode]));
      }
    }
  };

  onDateTimePick = (mode) => {
    this.setState({
      showPicker: true,
      pickerMode: mode,
    });
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== null) {
      const momentValue = Moment(
        nextProps.value,
        Globals.Formats[nextProps.mode]
      );
      if (momentValue !== prevState.momentValue) {
        return {
          momentValue,
        };
      }
    }
    return {
      momentValue: null,
    };
  }

  render() {
    const { label, mode, fieldStatus, editable } = this.props;
    const { momentValue, pickerMode, showPicker } = this.state;
    return (
      <View style={styles.rowContainer}>
        {(mode === pickerModes.DATE || mode === pickerModes.DATETIME) && (
          <LabeledInput
            label={label}
            value={
              momentValue
                ? momentValue.format(Globals.Formats[pickerModes.DATE])
                : ''
            }
            fieldStatus={fieldStatus}
            keyboardType={'default'}
            editable={false}
            iconName={'calendar'}
            iconType={'font-awesome'}
            iconRight
            onIconPress={() => this.onDateTimePick(pickerModes.DATE)}
            showClear
            onClear={() => this.props.onChange(null)}
          />
        )}
        {(mode === pickerModes.TIME || mode === pickerModes.DATETIME) && (
          <LabeledInput
            label={mode === pickerModes.DATETIME ? '' : label}
            value={
              momentValue
                ? momentValue.format(Globals.Formats[pickerModes.TIME])
                : ''
            }
            fieldStatus={
              mode === pickerModes.DATETIME ? Status.UNMODIFIED : fieldStatus
            }
            keyboardType={'default'}
            editable={false}
            iconName={'time-outline'}
            iconType={'ionicon'}
            iconRight
            onIconPress={() => this.onDateTimePick(pickerModes.TIME)}
            showClear
            onClear={() => this.props.onChange(null)}
          />
        )}
        {showPicker && editable && (
          <DateTimePicker
            value={momentValue ? momentValue.toDate() : new Date()}
            is24Hour={true}
            mode={pickerMode.toLowerCase()}
            onChange={this.onChange}
          />
        )}
      </View>
    );
  }
}

LabeledDateTimePicker.propTypes = {
  label: PropTypes.string.isRequired,
  fieldStatus: PropTypes.string.isRequired,
  value: PropTypes.string,
  editable: PropTypes.bool.isRequired,
  mode: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});

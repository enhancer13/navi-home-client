import {StyleSheet, View} from 'react-native';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import LabeledInput from './LabeledInput';
import Moment from 'moment';
import Globals from '../../../globals/Globals';
import DatePicker from 'react-native-date-picker';

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

  onDateTimeChange = (value) => {
    this.setState({
      showPicker: false,
    });
    if (value) {
      const momentValue = Moment(value);
      if (!momentValue.isSame(this.state.momentValue)) {
        const {mode, onChange} = this.props;
        onChange(momentValue.format(Globals.Formats[mode]));
      }
    }
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.value !== null) {
      const momentValue = Moment(
        nextProps.value,
        Globals.Formats[nextProps.mode],
      );
      if (momentValue !== prevState.momentValue) {
        return {
          momentValue,
          pickerMode: nextProps.mode,
        };
      }
    }
    return {
      momentValue: null,
      pickerMode: nextProps.mode,
    };
  }

  showPicker = () => {
    this.setState({
      showPicker: true,
    });
  };

  hidePicker = () => {
    this.setState({
      showPicker: false,
    });
  };

  renderDateTimePicker = () => {
    const {momentValue, pickerMode} = this.state;
    return <DatePicker modal
                       mode={pickerMode.toLowerCase()}
                       open={this.state.showPicker}
                       date={momentValue ? momentValue.toDate() : new Date()}
                       onConfirm={(date) => {
                         this.showPicker();
                         this.onDateTimeChange(date);
                       }}
                       onCancel={() => this.hidePicker()}/>;
  };

  render() {
    const {label, mode, fieldStatus, editable} = this.props;
    const {momentValue, pickerMode} = this.state;
    const labeledInputIconName = mode === pickerModes.TIME ? 'time-outline' : 'calendar';
    const labeledInputIconType = mode === pickerModes.TIME ? 'ionicon' : 'font-awesome';
    return (
      <View style={styles.rowContainer}>
        <LabeledInput
          label={label}
          value={
            momentValue
              ? momentValue.format(Globals.Formats[pickerMode])
              : ''
          }
          fieldStatus={fieldStatus}
          keyboardType={'default'}
          editable={false}
          iconName={labeledInputIconName}
          iconType={labeledInputIconType}
          iconRight
          onIconPress={() => this.showPicker()}
          showClear
          onClear={() => this.props.onChange(null)}
        />
        {editable && this.renderDateTimePicker()}
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

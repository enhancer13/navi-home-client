import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {StatusLabel} from './StatusLabel';
import {GlobalStyles} from '../../../config/GlobalStyles';
import PropTypes from 'prop-types';
import {DropDownListPicker} from '../../DropDownListPicker';

const LabeledDropDownListSinglePicker = (props) => {
  const {label, fieldStatus, editable, selectedItem, onChange, itemLabelFormatter} = props;

  const items = useMemo(() => {
    return props.items.map((x) => {
      const itemLabel = itemLabelFormatter ? itemLabelFormatter(x) : x;
      return {label: itemLabel, value: x};
    });
  }, [props.items]);

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <Text style={styles.label}>{label}</Text>
        <StatusLabel style={styles.statusLabel} status={fieldStatus}/>
      </View>
      <View style={styles.rowContainer}>
        <DropDownListPicker selectedItem={selectedItem} items={items} onItemChanged={onChange} disabled={!editable} />
      </View>
    </View>
  );
};

LabeledDropDownListSinglePicker.propTypes = {
  label: PropTypes.string.isRequired,
  selectedItem: PropTypes.string.isRequired,
  items: PropTypes.array.isRequired,
  fieldStatus: PropTypes.string.isRequired,
  editable: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  itemLabelFormatter: PropTypes.func
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5,
  },
  label: {
    color: GlobalStyles.greyTextColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
  rowContainer: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flex: 1,
  },
  statusLabel: {
    marginLeft: 10,
  },
});

export default LabeledDropDownListSinglePicker;

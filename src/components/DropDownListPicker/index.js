import React, {useState, useEffect, useCallback} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {GlobalStyles} from '../../config/GlobalStyles';
import {ArrayUtils} from '../../helpers/ArrayUtils';

export const DropDownListPicker = (props) => {
  const {onItemChanged, disabled, containerStyle, multiple, loading} = props;
  const [open, setOpen] = useState(false);
  const [prevSelectedItem, setPrevSelectedItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!ArrayUtils.arraysEqual(props.items, items, (a, b) => a.value === b.value)) {
      setItems(props.items);
    }
  }, [props.items]);

  useEffect(() => {
    if (multiple && !ArrayUtils.arraysEqual(selectedItem, props.selectedItem)) {
      const newSelectedItem = props.selectedItem;
      setSelectedItem(newSelectedItem);
      setPrevSelectedItem(newSelectedItem);
    }
    if (!multiple && selectedItem !== props.selectedItem) {
      setSelectedItem(props.selectedItem);
      setPrevSelectedItem(props.selectedItem);
    }
  }, [props.selectedItem]);

  const onChangeValue = useCallback((value) => {
    if (multiple && !ArrayUtils.arraysEqual(prevSelectedItem, value)) {
      setPrevSelectedItem(value);
      onItemChanged(value);
      return;
    }
    if (!multiple && prevSelectedItem !== value) {
      setPrevSelectedItem(value);
      onItemChanged(value);
    }
  }, [prevSelectedItem]);

  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      value={selectedItem}
      setValue={setSelectedItem}
      items={items}
      onChangeValue={onChangeValue}
      containerStyle={containerStyle}
      dropDownContainerStyle={styles.dropDownContainerStyle}
      style={styles.picker}
      disableBorderRadius={true}
      disabled={disabled}
      dropDownDirection="TOP"
      multiple={multiple}
      loading={loading}
      mode="BADGE"
      badgeDotColors={['#e76f51', '#00b4d8', '#e9c46a', '#e76f51', '#8ac926', '#00b4d8', '#e9c46a']}
      listMode={'SCROLLVIEW'}
    />
  );
};

DropDownListPicker.propTypes = {
  selectedItem: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.array.isRequired,
  ]),
  items: PropTypes.array.isRequired,
  onItemChanged: PropTypes.func.isRequired,
  containerStyle: PropTypes.object,
  disabled: PropTypes.bool,
  multiple: PropTypes.bool,
  loading: PropTypes.bool,
};

const styles = StyleSheet.create({
  picker: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
    borderWidth: 0,
  },
  dropDownContainerStyle: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
    borderWidth: 0.5,
    borderColor: GlobalStyles.lightGreyColor,
  },
});

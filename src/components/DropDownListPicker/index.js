import React, {useState, useEffect} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import PropTypes from 'prop-types';
import {StyleSheet} from 'react-native';
import {GlobalStyles} from '../../config/GlobalStyles';

export const DropDownListPicker = (props) => {
  const {onItemChanged, disabled, containerStyle, multiple, loading} = props;
  const [open, setOpen] = useState(false);
  const [prevSelectedItem, setPrevSelectedItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (props.items.length !== items.length || !items.every((item, index) => {
      return item.value === props.items[index].value;
    })) {
      setItems(props.items);
    }
  }, [props.items]);

  useEffect(() => {
    if (selectedItem !== props.selectedItem) {
      setSelectedItem(props.selectedItem);
      setPrevSelectedItem(props.selectedItem);
    }
  }, [props.selectedItem]);

  const onChangeValue = (value) => {
    if (multiple && (prevSelectedItem.length !== value.length || !prevSelectedItem.every((prevItem, index) => {
      return prevItem === value[index];
    }))) {
      setPrevSelectedItem([...value]);
      onItemChanged(value);
    }
    if (!multiple) {
      onItemChanged(value);
    }
  };

  return (
    <DropDownPicker
      open={open}
      setOpen={setOpen}
      value={selectedItem}
      setValue={setSelectedItem}
      items={items}
      setItems={setItems}
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

import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../../globals/GlobalStyles';

const DefaultTextInput = (props) => {
  const textInputStyle = {
    ...styles.textInput,
    ...props.style,
  };
  return (
    <TextInput
      {...props}
      style={textInputStyle}
      placeholderTextColor={GlobalStyles.greyTextColor}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
    fontSize: GlobalStyles.defaultFontSize,
    color: GlobalStyles.blackTextColor,
  },
});

export default DefaultTextInput;

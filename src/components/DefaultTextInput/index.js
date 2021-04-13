import {StyleSheet, TextInput} from 'react-native';
import React from 'react';
import {GlobalStyles} from '../../globals/GlobalStyles';

const DefaultTextInput = (props) => {
  let placeholderTextColor, textColor;
  switch (props.colorScheme) {
    case GlobalStyles.colorScheme.VIOLET:
      textColor = GlobalStyles.violetTextColor;
      placeholderTextColor = GlobalStyles.lightVioletTextColor;
      break;
    case GlobalStyles.colorScheme.BLACK:
      textColor = GlobalStyles.blackTextColor;
      placeholderTextColor = GlobalStyles.greyTextColor;
      break;
    default:
      throw new Error(`Unsupported color scheme: ${props.colorScheme}.`);
  }
  return <TextInput {...props} style={{...styles.textInput, color: textColor, ...props.style}} placeholderTextColor={placeholderTextColor} />;
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
});

export default DefaultTextInput;

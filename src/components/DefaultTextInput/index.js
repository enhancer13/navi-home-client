import { StyleSheet, TextInput } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../../globals/GlobalStyles';
import PropTypes from 'prop-types';

const DefaultTextInput = (props) => {
  let placeholderTextColor, textColor;
  const { colorScheme, style } = props;
  switch (colorScheme) {
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
  const textInputStyle = {
    ...styles.textInput,
    color: textColor,
    ...style,
  };
  return (
    <TextInput
      {...props}
      style={textInputStyle}
      placeholderTextColor={placeholderTextColor}
    />
  );
};

DefaultTextInput.propTypes = {
  colorScheme: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: GlobalStyles.lightBackgroundColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
});

export default DefaultTextInput;

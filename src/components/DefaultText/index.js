import { Text, StyleSheet } from 'react-native';
import React from 'react';
import { GlobalStyles } from '../../config/GlobalStyles';

const TextInput = (props) => {
  return (
    <Text {...props} style={{ ...styles.text, ...props.style }}>
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    color: GlobalStyles.blackTextColor,
    fontSize: GlobalStyles.defaultFontSize,
  },
});

export default TextInput;

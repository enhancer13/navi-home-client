import { StyleSheet, Text, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { GlobalStyles } from '../../../globals/GlobalStyles';
import React from 'react';

function LabeledBoolean(props) {
  const { value, iconWidth, labelStyle, labelText } = props;
  return (
    <View style={styles.row}>
      <Text style={labelStyle}>{labelText} </Text>
      <FontAwesome
        name={value ? 'check-circle' : 'circle-thin'}
        color={GlobalStyles.violetIconColor}
        size={iconWidth}
      />
    </View>
  );
}

export default LabeledBoolean;

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginRight: 5,
  },
});

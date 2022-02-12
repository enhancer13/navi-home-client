import React from 'react';
import { StyleSheet, View } from 'react-native';
import DefaultText from '../../DefaultText';
import PropTypes from 'prop-types';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { GlobalStyles } from '../../../globals/GlobalStyles';

function CategoryDivider(props) {
  return (
    <View style={styles.rowContainer}>
      <View style={styles.line} />
      <DefaultText style={styles.text}>{props.categoryName}</DefaultText>
      <View style={styles.line} />
    </View>
  );
}

CategoryDivider.propTypes = {
  categoryName: PropTypes.string,
};

export default CategoryDivider;

const styles = StyleSheet.create({
  line: {
    backgroundColor: GlobalStyles.lightGreyBackgroundColor,
    borderRadius: 5,
    flexGrow: 1,
    height: hp(0.5),
    margin: 5,
  },
  rowContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: hp(3),
  },
  text: {
    color: GlobalStyles.greyTextColor,
  },
});

import React, {Component} from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {GlobalStyles} from '../../../../../globals/GlobalStyles';

export default class VideoCamera extends Component {
  render() {
    const {
      item: {cameraName},
    } = this.props;
    return (
      <View style={styles.container}>
        <Text>{cameraName}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: GlobalStyles.softLightVioletColor,
    borderColor: GlobalStyles.lightVioletColor,
    borderRadius: 5,
    borderWidth: 2,
    height: hp(10),
    width: '90%',
  },
});

import React, {Component} from 'react';
import {StyleSheet, View, Text, StatusBar} from 'react-native';

export default class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.mainContainer}>
        <StatusBar
          barStyle="dark-content"
          hidden={false}
          backgroundColor="#733DC0"
          translucent={true}
          networkActivityIndicatorVisible={true}
        />
        <Text>Welcome to ORION!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

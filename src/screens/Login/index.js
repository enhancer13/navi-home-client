import React, {Component} from 'react';
import {Form} from './Form';
import {StyleSheet, Alert, View, StatusBar} from 'react-native';
import AuthService from '../../helpers/authService';
import {Actions} from 'react-native-router-flux';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.auth = new AuthService();
  }

  handleSubmit = data => {
    this.auth
      .login(data.username, data.password)
      .then(() => {
        Actions.home();
      })
      .catch(error => {
        Alert.alert(error);
      });
  };

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
        <Form style={styles.loginForm} handleSubmit={this.handleSubmit} />
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
  loginForm: {
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#c5c5c5',
    borderRadius: 8,
  },
});

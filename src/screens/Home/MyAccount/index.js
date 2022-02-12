import React, { Component } from 'react';
import AuthService from '../../../helpers/AuthService';
import Globals from '../../../globals/Globals';
import MenuList from '../../../components/MenuList';
import { StackActions } from '@react-navigation/native';

export default class MyAccount extends Component {
  items = [
    {
      name: 'Biometric authentication enabled',
      icon: {
        name: 'finger-print',
        type: 'ionicon',
      },
      stateProperty: Globals.FINGERPRINT_ACTIVE,
      checkbox: true,
    },
    {
      name: 'Logout',
      icon: {
        name: 'sign-out',
        type: 'font-awesome',
      },
      action: async () => {
        await AuthService.logout();
        this.props.navigation.dispatch(StackActions.popToTop());
      },
    },
  ];

  render() {
    return <MenuList items={this.items} />;
  }
}

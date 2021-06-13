import React, {Component} from 'react';
import AuthService from '../../../helpers/AuthService';
import Globals from '../../../globals/Globals';
import MenuList from '../../../components/MenuList';

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
      action: () => AuthService.logout(this.props.navigation),
    },
  ];

  render() {
    return <MenuList items={this.items} />;
  }
}

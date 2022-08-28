import React, {useMemo} from 'react';
import AuthService from '../../../helpers/AuthService';
import {applicationConstants} from '../../../config/ApplicationConstants';
import MenuList from '../../../components/MenuList';
import {StackActions} from '@react-navigation/native';

const MyAccount = (props) => {
  const items = useMemo(() => {
    return [
      {
        name: 'Biometric authentication enabled',
        icon: {
          name: 'finger-print',
          type: 'ionicon',
        },
        stateProperty: applicationConstants.BIOMETRY_ACTIVE,
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
          props.navigation.dispatch(StackActions.popToTop());
        },
      },
    ];
  }, [props.navigation]);

  return (
    <MenuList items={items}/>
  );
};

export default MyAccount;

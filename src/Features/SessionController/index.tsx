import React, {useEffect, useRef} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {usePopupMessage} from '../Messaging';
import {useAuth} from '../Authentication';
import moment from 'moment/moment';

export const SessionController: React.FC = () => {
  const {showWarning} = usePopupMessage();
  const {authentication, logout} = useAuth();
  const navigation = useNavigation();

  const authenticationRef = useRef(authentication);
  authenticationRef.current = authentication;

  const doLogout = async () => {
    navigation.dispatch(StackActions.popToTop());
    await logout();
    showWarning('Your session has expired, please login');
  }

  const verifySession = async () => {
    if (!authenticationRef.current) {
      await doLogout();
      return;
    }

    const expirationDateTime = moment(authenticationRef.current.expirationDateTime);
    const currentTime = moment();
    const secondsToExpireLeft = expirationDateTime.diff(currentTime, 'seconds');

    if (secondsToExpireLeft > 60) {
      return;
    }
    if (secondsToExpireLeft > 0) {
      showWarning(`Your session will expire in ${secondsToExpireLeft} seconds.`);
      return;
    }

    await doLogout();
  };

  useEffect(() => {
    const sessionVerificationTask = setInterval(verifySession, 5000);
    return () => clearInterval(sessionVerificationTask);
  });

  return null;
}

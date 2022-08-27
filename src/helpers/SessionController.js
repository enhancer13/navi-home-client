import React, {useEffect} from 'react';
import Popups from '../components/ApplicationMessaging/Popups';
import authService from './AuthService';
import { StackActions } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';

export default function SessionController() {
  const navigation = useNavigation();

  const verifySession = () => {
    if (!authService.isAccessTokenExist()) {
      return;
    }

    const secondsToExpireLeft = authService.getAccessTokenLeftToExpireSeconds();
    if (secondsToExpireLeft <= 60) {
      Popups.showWarning(`Your session will expire in ${secondsToExpireLeft} seconds.`);
    }

    if (authService.isAccessTokenExpired()) {
      authService.removeAccessToken();
      Popups.showWarning("Your session has expired, please login");
      navigation.dispatch(StackActions.popToTop());
    }
  }

  useEffect(() => {
    const sessionVerificationTask = setInterval(verifySession, 10000);
    return () => clearInterval(sessionVerificationTask);
  }, []);

  return null;
}

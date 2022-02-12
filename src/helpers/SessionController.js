import { Component } from 'react';
import Popups from '../components/ApplicationMessaging/Popups';
import authService from './AuthService';
import { navigationRef } from './RootNavigation';
import { StackActions } from '@react-navigation/native';

export default class SessionController extends Component {
  constructor(props) {
    super(props);
  }

  verifySession() {
    if (!authService.isAccessTokenExpired()) {
      return;
    }
    authService.removeAccessToken();
    Popups.showWarning('Your session has expired, please login');
    const navigation = navigationRef.current;
    if (!navigation || navigation.getCurrentRoute().name === 'Login') {
      return;
    }
    navigation.dispatch(StackActions.popToTop());
  }

  componentDidMount() {
    this.sessionVerificationTask = setInterval(this.verifySession, 2000);
  }

  componentWillUnmount() {
    this.sessionVerificationTask && clearInterval(this.sessionVerificationTask);
  }

  render() {
    return null;
  }
}

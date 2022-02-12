import { Component } from 'react';
import messaging from '@react-native-firebase/messaging';
import { showError, showInformation, showSuccess, showWarning } from './Popups';

const MessageType = Object.freeze({
  INFORMATION: 'INFORMATION',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
});

export default class FirebaseMessageHandler extends Component {
  initFirebaseMessaging = () => {
    // Check whether an application is opened by notification from quite state
    messaging().onNotificationOpenedApp((remoteMessage) => {
      this.showNotification(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          this.showNotification(remoteMessage);
        }
      });

    this.firebaseMessageListener = messaging().onMessage(
      async (remoteMessage) => {
        if (remoteMessage.notification) {
          this.showNotification(remoteMessage);
        } else if (remoteMessage.data.messaging) {
          this.showApplicationMessage(remoteMessage);
        }
      }
    );
  };

  showApplicationMessage = (remoteMessage) => {
    const applicationMessage = JSON.parse(remoteMessage.data.messaging);
    const message = `${applicationMessage.dateTime}: ${applicationMessage.body}.`;
    switch (applicationMessage.type) {
      case MessageType.INFORMATION:
        showInformation(message);
        break;
      case MessageType.SUCCESS:
        showSuccess(message);
        break;
      case MessageType.WARNING:
        showWarning(message);
        break;
      case MessageType.ERROR:
        showError(message);
        break;
      default:
        throw new Error(
          `Not supported application message type: ${applicationMessage.type}.`
        );
    }
  };

  showNotification = (remoteMessage) => {
    const notification = remoteMessage.notification;
    showWarning(`${notification.title}\n${notification.body}`);
  };

  componentDidMount() {
    this.initFirebaseMessaging();
  }

  componentWillUnmount() {
    this.firebaseMessageListener();
  }

  render() {
    return null;
  }
}

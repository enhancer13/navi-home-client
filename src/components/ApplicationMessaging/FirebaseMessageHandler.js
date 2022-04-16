import { Component } from 'react';
import messaging from '@react-native-firebase/messaging';
import { showError, showInformation, showSuccess, showWarning } from './Popups';
import { EventRegister } from 'react-native-event-listeners';
import ajaxRequest from '../../helpers/AjaxRequest';
import Globals from '../../globals/Globals';

const MessageType = Object.freeze({
  INFORMATION: 'INFORMATION',
  WARNING: 'WARNING',
  ERROR: 'ERROR',
  SUCCESS: 'SUCCESS',
});

export default class FirebaseMessageHandler extends Component {
  initFirebaseMessaging = async () => {
    // Get current server external unique identifier
    const response = await ajaxRequest.get(Globals.Endpoints.APPLICATION_INFO, {
      skipAuthorization: true,
    });
    this.externalUniqueId = response.externalUniqueId;
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
          return;
        }

        if (remoteMessage.data.messaging) {
          this.showApplicationMessage(remoteMessage);
          return;
        }

        if (remoteMessage.data.dataMessage) {
          this.dispatchDataMessageEvent(remoteMessage);
        }
      }
    );
  };

  dispatchDataMessageEvent = (remoteMessage) => {
    const applicationDataMessage = JSON.parse(remoteMessage.data.dataMessage);
    if (
      this.externalUniqueId !==
      applicationDataMessage.applicationExternalUniqueId
    ) {
      return;
    }
    const key = applicationDataMessage.key;
    EventRegister.emit(key, JSON.parse(applicationDataMessage.data));
  };

  showApplicationMessage = (remoteMessage) => {
    const { dateTime, body, type, applicationExternalUniqueId } = JSON.parse(
      remoteMessage.data.messaging
    );
    if (this.externalUniqueId !== applicationExternalUniqueId) {
      return;
    }
    const message = `${dateTime}: ${body}.`;
    switch (type) {
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
        throw new Error(`Not supported application message type: ${type}.`);
    }
  };

  showNotification = (remoteMessage) => {
    const notification = remoteMessage.notification;
    showWarning(`${notification.title}\n${notification.body}`);
  };

  async componentDidMount() {
    await this.initFirebaseMessaging();
  }

  componentWillUnmount() {
    this.firebaseMessageListener && this.firebaseMessageListener();
  }

  render() {
    return null;
  }
}

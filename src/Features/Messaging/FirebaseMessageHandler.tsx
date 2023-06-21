import {useEffect, useState} from 'react';
import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {EventRegister} from 'react-native-event-listeners';
import {backendEndpoints} from '../../Config/BackendEndpoints';
import {useAuth} from '../Authentication';
import {IApplicationInfo, IApplicationMessage, IApplicationDataMessage, MessageType} from '../../BackendTypes';
import {usePopupMessage} from './FlashMessageContext';
import {httpClient} from "../../Framework/Net/HttpClient/HttpClient";

export const FirebaseMessageHandler = () => {
  const {authentication} = useAuth();
  const {showError, showInformation, showSuccess, showWarning} = usePopupMessage();
  const [serverId, setServerId] = useState<string>();

  useEffect(() => {
    if (!authentication) {
      return;
    }

    async function initFirebaseMessaging() {
      const {externalUniqueId} = await httpClient.get<IApplicationInfo>(backendEndpoints.APPLICATION_INFO, {authentication});
      setServerId(externalUniqueId);
    }
    initFirebaseMessaging();
  }, [authentication]);

  useEffect(() => {
    if (!serverId) {
      return;
    }

    // Check whether an application is opened by notification from quite state
    messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
      showNotification(remoteMessage);
    });

    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
        if (remoteMessage) {
          showNotification(remoteMessage);
        }
      });

    // Subscribe to receive messages
    const firebaseMessageListener = messaging().onMessage(onFirebaseMessage);

    return () => firebaseMessageListener();
  }, [serverId]);

  const onFirebaseMessage = (remoteMessage: FirebaseMessagingTypes.RemoteMessage): void => {
    if (remoteMessage.notification) {
      showNotification(remoteMessage);
      return;
    }

    if (remoteMessage.data?.messaging) {
      showApplicationMessage(remoteMessage.data.messaging);
      return;
    }

    if (remoteMessage.data?.dataMessage) {
      dispatchDataMessageEvent(remoteMessage.data.dataMessage);
    }
  };

  const dispatchDataMessageEvent = (payload: string): void => {
    const applicationDataMessage = JSON.parse(payload) as IApplicationDataMessage;
    if (serverId !== applicationDataMessage.applicationExternalUniqueId) {
      return;
    }
    const key = applicationDataMessage.key;
    EventRegister.emit(key, JSON.parse(applicationDataMessage.data));
  };

  const showApplicationMessage = (payload: string): void => {
    const applicationMessage = JSON.parse(payload) as IApplicationMessage;
    if (serverId !== applicationMessage.applicationExternalUniqueId) {
      return;
    }

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
        throw new Error(`Not supported application message type: ${applicationMessage.type}.`);
    }
  };

  const showNotification = (remoteMessage: FirebaseMessagingTypes.RemoteMessage): void => {
    const notification = remoteMessage.notification;
    if (!notification) {
      return;
    }
    showWarning(`${notification.title}\n${notification.body}`);
  };

  return null;
};

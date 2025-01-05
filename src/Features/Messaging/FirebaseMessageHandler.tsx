import {useEffect, useState, useCallback} from 'react';
import messaging, {FirebaseMessagingTypes} from '@react-native-firebase/messaging';
import {EventRegister} from 'react-native-event-listeners';
import {backendEndpoints} from '../../Config/BackendEndpoints';
import {useAuth} from '../Authentication';
import {IApplicationInfo, IApplicationMessage, IApplicationDataMessage, MessageType} from '../../BackendTypes';
import {usePopupMessage} from './FlashMessageContext';
import {httpClient} from '../../Framework/Net/HttpClient/HttpClient';
import {firebaseAuthService} from '../Authentication/AuthServices/FirebaseAuthService';

export const FirebaseMessageHandler = () => {
    const {authentication} = useAuth();
    const {showError, showInformation, showSuccess, showWarning} = usePopupMessage();
    const [serverId, setServerId] = useState<string>();

    useEffect(() => {
        let unsubscribe: () => void;

        async function initFirebaseMessaging() {
            if (!authentication) {
                return;
            }

            // Request messaging permission before messages can be received or sent
            await messaging().requestPermission();

            // Keep FCM token up-to-date when the token is refreshed
            unsubscribe = messaging().onTokenRefresh((clientToken) =>
                firebaseAuthService.updateClientToken(authentication.firebaseAccountId, clientToken, authentication)
            );

            // Fetch server ID from backend
            const {externalUniqueId} = await httpClient.get<IApplicationInfo>(backendEndpoints.APPLICATION_INFO, {authentication});
            setServerId(externalUniqueId);
        }

        initFirebaseMessaging();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [authentication]);

    const showNotification = useCallback(
        (remoteMessage: FirebaseMessagingTypes.RemoteMessage): void => {
            const notification = remoteMessage.notification;
            if (!notification) {
                return;
            }
            showWarning(`${notification.title}\n${notification.body ?? ''}`);
        },
        [showWarning]
    );

    const dispatchDataMessageEvent = useCallback(
        (payload: string): void => {
            const applicationDataMessage = JSON.parse(payload) as IApplicationDataMessage;
            if (serverId !== applicationDataMessage.applicationExternalUniqueId) {
                return;
            }
            const key = applicationDataMessage.key;
            EventRegister.emit(key, JSON.parse(applicationDataMessage.data));
        },
        [serverId]
    );

    const showApplicationMessage = useCallback(
        (payload: string): void => {
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
        },
        [serverId, showError, showInformation, showSuccess, showWarning]
    );

    const onFirebaseMessage = useCallback(
        (remoteMessage: FirebaseMessagingTypes.RemoteMessage): void => {
            if (remoteMessage.notification) {
                showNotification(remoteMessage);
                return;
            }

            if (remoteMessage.data?.messaging) {
                showApplicationMessage(remoteMessage.data.messaging as string);
                return;
            }

            if (remoteMessage.data?.dataMessage) {
                dispatchDataMessageEvent(remoteMessage.data.dataMessage as string);
            }
        },
        [showNotification, showApplicationMessage, dispatchDataMessageEvent]
    );

    useEffect(() => {
        if (!serverId) {
            return;
        }

        // Check whether an application is opened by notification from a background state (minimized state etc.)
        const unsubscribeOpenedApp = messaging().onNotificationOpenedApp((remoteMessage: FirebaseMessagingTypes.RemoteMessage) => {
            showNotification(remoteMessage);
        });

        // Check whether an initial notification is available (locked screen etc.)
        messaging()
            .getInitialNotification()
            .then((remoteMessage: FirebaseMessagingTypes.RemoteMessage | null) => {
                if (remoteMessage) {
                    showNotification(remoteMessage);
                }
            })
            .catch((error) => {
                console.error('Error fetching initial notification:', error);
            });

        // Subscribe to receive messages
        const firebaseMessageListener = messaging().onMessage(onFirebaseMessage);

        return () => {
            unsubscribeOpenedApp();
            firebaseMessageListener();
        };
    }, [serverId, onFirebaseMessage, showNotification]);

    return null;
};

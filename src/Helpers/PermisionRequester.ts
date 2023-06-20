import messaging from '@react-native-firebase/messaging';

const requestFirebasePermissions = async (): Promise<void> => {
    await messaging().requestPermission();
};

export {requestFirebasePermissions};

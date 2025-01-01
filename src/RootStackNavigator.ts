import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {NavigationProp, RouteProp} from '@react-navigation/native';

export type RootStackParamList = {
    Home: React.FC;
    Login: React.FC;
    'Server Config': { serverName: string; };
};
export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;
export type RootNavigationProp = NavigationProp<RootStackParamList>;
export const RootStackNavigator = createNativeStackNavigator<RootStackParamList>();

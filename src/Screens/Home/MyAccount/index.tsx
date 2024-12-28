import React from 'react';
import {IUser} from '../../../BackendTypes';
import {NavigationProp, RouteProp} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AccountDetailsScreen} from './AccountDetailsScreen';
import {ChangePasswordScreen} from './Components/ChangePasswordScreen';

export type AccountStackParamList = {
    'Account Details': React.FC;
    'Change Password':  { user: IUser; };
};
export type AccountRouteProps<RouteName extends keyof AccountStackParamList> = RouteProp<AccountStackParamList, RouteName>;
export type AccountNavigationProp = NavigationProp<AccountStackParamList>;

const StackNavigator = createNativeStackNavigator<AccountStackParamList>();

export const MyAccountStackNavigator = () => {
    return (
        <StackNavigator.Navigator initialRouteName="Account Details" screenOptions={{headerShown: false}}>
            <StackNavigator.Screen name="Account Details" component={AccountDetailsScreen} />
            <StackNavigator.Screen name="Change Password" component={ChangePasswordScreen} />
        </StackNavigator.Navigator>
    );
};

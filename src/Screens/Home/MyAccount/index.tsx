import React from "react";
import {IUser} from "../../../BackendTypes";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {MyAccountScreen} from "./MyAccountScreen";
import {ChangePasswordScreen} from "./Components/ChangePasswordScreen";

export type AccountStackParamList = {
    "My Account": React.FC;
    "Change Password":  { user: IUser; };
};
export type AccountRouteProps<RouteName extends keyof AccountStackParamList> = RouteProp<AccountStackParamList, RouteName>;
export type AccountNavigationProp = NavigationProp<AccountStackParamList>;

const StackNavigator = createNativeStackNavigator<AccountStackParamList>();

export const AccountStackNavigator = () => {
    return (
        <StackNavigator.Navigator initialRouteName="My Account" screenOptions={{headerShown: false}}>
            <StackNavigator.Screen name="My Account" component={MyAccountScreen} />
            <StackNavigator.Screen name="Change Password" component={ChangePasswordScreen} />
        </StackNavigator.Navigator>
    );
}

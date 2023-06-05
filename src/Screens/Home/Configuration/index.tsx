import React from 'react';
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {UsersScreen} from "./Components/Users";
import {SystemConfiguration} from "./SystemConfiguration";
import {createNativeStackNavigator} from "@react-navigation/native-stack";

export type ConfigurationStackParamList = {
    "System Configuration": React.FC;
    "Video Cameras": React.FC;
    Users: React.FC;
    "Service Accounts": React.FC;
    "Alarm Profiles": React.FC;
};
export type ConfigurationRouteProps<RouteName extends keyof ConfigurationStackParamList> = RouteProp<ConfigurationStackParamList, RouteName>;
export type ConfigurationNavigationProp = NavigationProp<ConfigurationStackParamList>;

const StackNavigator = createNativeStackNavigator<ConfigurationStackParamList>();

export const SystemConfigurationNavigator = () => {
    return (
        <StackNavigator.Navigator initialRouteName={"System Configuration"} screenOptions={{headerShown: false}}>
            <StackNavigator.Screen name="System Configuration" component={SystemConfiguration}  />
            <StackNavigator.Screen name="Users" component={UsersScreen} />
        </StackNavigator.Navigator>
    );
}

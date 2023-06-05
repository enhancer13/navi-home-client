import React from 'react';
import {LiveStreaming} from './LiveStreaming';
import {MyAccount} from './MyAccount';
import {MediaGalleryStackNavigator} from './MediaGallery';
import {FirebaseMessageHandler} from '../../Features/Messaging';
import {SessionController} from "../../Features/SessionController";
import {AuthErrorBoundary} from "../../Features/ErrorBoundary/AuthErrorBoundary";
import {SystemConfigurationNavigator} from "./Configuration";
import {UsersScreen} from "./Configuration/Components/Users";
import {BottomTabNavigationOptions, createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {NavigationProp, RouteProp} from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {AlarmProfilesScreen} from "./Alarm";

export type AppNavigatorParamList = {
    "Live Streaming": React.FC;
    "Media Gallery": React.FC;
    "Alarm Profiles": React.FC;
    "System Configuration": React.FC;
    "My Account": React.FC;
};
export type RootRouteProps<RouteName extends keyof AppNavigatorParamList> = RouteProp<AppNavigatorParamList, RouteName>;
export type RootNavigationProp = NavigationProp<AppNavigatorParamList>;
const screenOptions: BottomTabNavigationOptions = {
    headerShown: false,
}
const Tab = createBottomTabNavigator<AppNavigatorParamList>();

const screenComponents = {
    "Live Streaming": {component: LiveStreaming, icon: "video-camera", library: FontAwesome},
    "Media Gallery": {component: MediaGalleryStackNavigator, icon: "images", library: Ionicons},
    "Alarm Profiles": {component: AlarmProfilesScreen, icon: "bell", library: FontAwesome},
    "System Configuration": {component: SystemConfigurationNavigator, icon: "ios-settings", library: Ionicons},
    "My Account": {component: MyAccount, icon: "user", library: FontAwesome},
};

export const Home = () => {
    return (
        <AuthErrorBoundary>
            <Tab.Navigator initialRouteName={"Live Streaming"} screenOptions={screenOptions}>
                {Object.entries(screenComponents).map(([name, {component, icon, library: IconLibrary}]) => (
                    <Tab.Screen
                        key={name}
                        name={name as keyof AppNavigatorParamList}
                        component={component}
                        options={{
                            tabBarIcon: ({color, size}) => <IconLibrary name={icon} color={color} size={size}/>
                        }}
                    />
                ))}
            </Tab.Navigator>
            <FirebaseMessageHandler/>
            <SessionController/>
        </AuthErrorBoundary>
    );
};

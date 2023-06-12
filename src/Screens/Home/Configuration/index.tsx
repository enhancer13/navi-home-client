import React from 'react';
import {NavigationProp, RouteProp} from "@react-navigation/native";
import {UsersScreen} from "./Components/Users";
import {SystemConfigurationScreen} from "./SystemConfigurationScreen";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {VideoSourcesScreen} from "./Components/VideoSources";
import {ServiceAccountsScreen} from "./Components/ServiceAccounts";
import {VideoStreamingProfilesScreen} from "./Components/VideoStreamingProfiles";
import {MotionDetectionProfilesScreen} from "./Components/MotionDetectionProfiles";
import {VideoRecordingProfilesScreen} from "./Components/VideoRecordingProfiles";
import {AlarmProfilesScreen} from "../Alarm";

export type ConfigurationStackParamList = {
    "Configuration": React.FC;
    "Video Sources": React.FC;
    "Video Streaming Profiles": React.FC;
    "Video Recording Profiles": React.FC;
    "Motion Detection Profiles": React.FC;
    Users: React.FC;
    "Service Accounts": React.FC;
    "Configure Alarm Profiles": React.FC;
};
export type ConfigurationRouteProps<RouteName extends keyof ConfigurationStackParamList> = RouteProp<ConfigurationStackParamList, RouteName>;
export type ConfigurationNavigationProp = NavigationProp<ConfigurationStackParamList>;

const StackNavigator = createNativeStackNavigator<ConfigurationStackParamList>();

export const SystemConfigurationNavigator = () => {
    return (
        <StackNavigator.Navigator initialRouteName={"Configuration"} screenOptions={{headerShown: false}}>
            <StackNavigator.Screen name="Configuration" component={SystemConfigurationScreen}  />
            <StackNavigator.Screen name="Users" component={UsersScreen} />
            <StackNavigator.Screen name="Video Sources" component={VideoSourcesScreen} />
            <StackNavigator.Screen name="Video Streaming Profiles" component={VideoStreamingProfilesScreen} />
            <StackNavigator.Screen name="Video Recording Profiles" component={VideoRecordingProfilesScreen} />
            <StackNavigator.Screen name="Service Accounts" component={ServiceAccountsScreen} />
            <StackNavigator.Screen name="Motion Detection Profiles" component={MotionDetectionProfilesScreen} />
            <StackNavigator.Screen name="Configure Alarm Profiles" component={AlarmProfilesScreen} />
        </StackNavigator.Navigator>
    );
}

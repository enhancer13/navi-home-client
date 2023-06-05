import 'react-native-gesture-handler';
import React, {useEffect, useMemo, useState} from 'react';
import {NavigationContainer, NavigationProp, RouteProp, DefaultTheme} from '@react-navigation/native';
import Orientation from 'react-native-orientation-locker';
import {requestFirebasePermissions} from './src/Helpers/PermisionRequester';
import {Login} from './src/Screens/Login';
import {ServerConfig} from './src/Screens/ServerConfig';
import {dataStorageInitializer} from './src/Features/LocalStorage';
import {Home} from './src/Screens/Home';
import {AppProviders} from "./AppProviders";
import FontsLoader from "./src/Helpers/FontsLoader";
import {AppStatusBar} from "./src/Components/Layout/AppStatusBar";
import {createNativeStackNavigator, NativeStackNavigationOptions} from "@react-navigation/native-stack";
import {useTheme} from "react-native-paper";

FontsLoader.load();

export type RootStackParamList = {
    Home: React.FC;
    Login: React.FC;
    "Server Config": { serverName: string; };
};
export type RootRouteProps<RouteName extends keyof RootStackParamList> = RouteProp<RootStackParamList, RouteName>;
export type RootNavigationProp = NavigationProp<RootStackParamList>;
const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
}
const RootStackNavigator = createNativeStackNavigator<RootStackParamList>();

const App = () => {
    const [appInitialized, setAppInitialized] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        async function initializeApplication() {
            Orientation.lockToPortrait();
            await requestFirebasePermissions();
            //await dataStorageInitializer.reset();
            await dataStorageInitializer.initialize();
            setAppInitialized(true);
        }

        initializeApplication();
    }, []);

    const NavigatorTheme = useMemo(() => {
        return {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: theme.colors.primary,
                card: theme.colors.surface,
                background: theme.colors.background,
                text: theme.colors.onSurface,
            },
        };
    }, [theme]);

    if (!appInitialized) {
        return null;
    }

    return (
        <AppProviders>
            <NavigationContainer theme={NavigatorTheme}>
                <RootStackNavigator.Navigator initialRouteName="Login">
                    <RootStackNavigator.Screen
                        name={'Login'}
                        component={Login}
                        options={screenOptions}/>
                    <RootStackNavigator.Screen
                        name={'Server Config'}
                        component={ServerConfig}
                        options={screenOptions}
                    />
                    <RootStackNavigator.Screen
                        name="Home"
                        component={Home}
                        options={screenOptions}
                    />
                </RootStackNavigator.Navigator>
                <AppStatusBar/>
            </NavigationContainer>
        </AppProviders>
    );
};

export default App;

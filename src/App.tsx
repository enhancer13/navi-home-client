import 'react-native-gesture-handler';
import React, {useMemo} from 'react';
import {DefaultTheme, NavigationContainer} from '@react-navigation/native';
import {LoginScreen} from './Screens/Login';
import {ServerConfigScreen} from './Screens/ServerConfig';
import {HomeScreen} from './Screens/Home';
import {AppStatusBar} from "./Components/Layout/AppStatusBar";
import {NativeStackNavigationOptions} from "@react-navigation/native-stack";
import {useTheme} from "react-native-paper";
import {RootStackNavigator} from "./RootStackNavigator";

const screenOptions: NativeStackNavigationOptions = {
    headerShown: false,
}

const App = () => {
    const theme = useTheme();
    const NavigatorTheme = useMemo(() => {
        return {
            ...DefaultTheme,
            colors: {
                ...DefaultTheme.colors,
                primary: theme.colors.primary,
                card: theme.colors.elevation.level3,
                border: theme.colors.surface,
                background: theme.colors.background,
                text: theme.colors.onSurface,
            },
        };
    }, [theme]);

    return (
        <NavigationContainer theme={NavigatorTheme}>
            <RootStackNavigator.Navigator initialRouteName="Login">
                <RootStackNavigator.Screen
                    name={'Login'}
                    component={LoginScreen}
                    options={screenOptions}/>
                <RootStackNavigator.Screen
                    name={'Server Config'}
                    component={ServerConfigScreen}
                    options={screenOptions}
                />
                <RootStackNavigator.Screen
                    name="Home"
                    component={HomeScreen}
                    options={screenOptions}
                />
            </RootStackNavigator.Navigator>
            <AppStatusBar/>
        </NavigationContainer>
    );
};

export default App;

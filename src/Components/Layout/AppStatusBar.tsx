import {StatusBar} from "react-native";
import React from "react";
import {useTheme} from "react-native-paper";

export const AppStatusBar: React.FC = () => {
    const theme = useTheme();

    return (
        <StatusBar barStyle={theme.dark ? 'light-content' : 'dark-content'}  backgroundColor={theme.colors.background}/>
    )
}

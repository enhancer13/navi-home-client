import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './Features/Authentication';
import {PopupMessageProvider} from './Features/Messaging';
import {DialogProvider} from "./Features/Dialog";
import {Provider as PaperProvider} from "react-native-paper";
import {darkTheme, lightTheme} from "./PaperTheme";
import {useApplicationSettings} from "./Features/DataStorage/Hooks/useApplicationSettings";

type AppProvidersProps = {
    children: React.ReactNode;
};

export const AppProviders: React.FC<AppProvidersProps> = ({children}) => {
    const [theme, setTheme] = useState(lightTheme);
    const {applicationSettings} = useApplicationSettings();

    useEffect(() => {
        if (!applicationSettings) {
            return;
        }

        setTheme(applicationSettings.darkThemeActive ? darkTheme : lightTheme);
    }, [applicationSettings]);

    return (
        <PaperProvider theme={theme} >
            <SafeAreaProvider>
                <AuthProvider>
                    <PopupMessageProvider>
                        <DialogProvider>
                            {children}
                        </DialogProvider>
                    </PopupMessageProvider>
                </AuthProvider>
            </SafeAreaProvider>
        </PaperProvider>
    );
};

import React, {useEffect, useState} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/Features/Authentication';
import {PopupMessageProvider} from './src/Features/Messaging';
import {DialogProvider} from "./src/Features/Dialog";
import {Provider as PaperProvider} from "react-native-paper";
import {darkTheme, lightTheme} from "./PaperTheme";
import {useApplicationSettings} from "./src/Features/DataStorage/Hooks/useApplicationSettings";

type AppProvidersProps = {
    children: React.ReactNode;
};

export const AppProviders: React.FC<AppProvidersProps> = ({children}): JSX.Element => {
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

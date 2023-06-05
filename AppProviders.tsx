import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {AuthProvider} from './src/Features/Authentication';
import {PopupMessageProvider} from './src/Features/Messaging';
import {DialogProvider} from "./src/Features/Dialog";

type AppProvidersProps = {
    children: React.ReactNode;
};

export const AppProviders: React.FC<AppProvidersProps> = ({children}): JSX.Element => {
    return (
        <SafeAreaProvider>
            <AuthProvider>
                <PopupMessageProvider>
                    <DialogProvider>
                        {children}
                    </DialogProvider>
                </PopupMessageProvider>
            </AuthProvider>
        </SafeAreaProvider>
    );
};

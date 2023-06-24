import React, {createContext, useCallback, useContext} from 'react';
import FlashMessage, {showMessage} from "react-native-flash-message";
import {useTheme} from "react-native-paper";
import {AppTheme} from "../../AppTheme";

interface IContextProps {
    showSuccess: (message: string) => void;
    showError: (message: string) => void;
    showWarning: (message: string) => void;
    showInformation: (message: string) => void;
}

interface Props {
    children: React.ReactNode;
}

const PopupMessageContext = createContext<IContextProps>({} as IContextProps);

export const PopupMessageProvider: React.FC<Props> = ({children}) => {
    const theme = useTheme<AppTheme>();
    const {success, information, warning, error, white} = theme.colors.system;

    const showSuccess = useCallback((message: string) => {
        showMessage({
            message,
            type: 'success',
            duration: 2000,
            color: white,
            backgroundColor: success,
        });
    }, [success, white]);

    const showError = useCallback((message: string) => {
        showMessage({
            message,
            type: 'danger',
            duration: 10000,
            position: 'bottom',
            color: white,
            backgroundColor: error,
        });
    }, [error, white]);

    const showWarning = useCallback((message: string) => {
        showMessage({
            message,
            type: 'warning',
            duration: 10000,
            color: white,
            backgroundColor: warning,
        });
    }, [white, warning]);

    const showInformation = useCallback((message: string) => {
        showMessage({
            message,
            type: 'info',
            duration: 5000,
            color: white,
            backgroundColor: information,
        });
    }, [white, information]);

    return (
        <PopupMessageContext.Provider value={{showError, showInformation, showSuccess, showWarning}}>
            <FlashMessage position="bottom"/>
            {children}
        </PopupMessageContext.Provider>);
};

export const usePopupMessage = () => useContext(PopupMessageContext);

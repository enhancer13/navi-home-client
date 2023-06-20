import React, {createContext, useCallback, useContext} from 'react';
import FlashMessage, {showMessage} from "react-native-flash-message";

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
    const showSuccess = useCallback((message: string) => {
        showMessage({
            message,
            type: 'success',
            duration: 2000
        });
    }, []);

    const showError = useCallback((message: string) => {
        showMessage({
            message,
            type: 'danger',
            duration: 10000,
            position: 'bottom',
        });
    }, []);

    const showWarning = useCallback((message: string) => {
        showMessage({
            message,
            type: 'warning',
            duration: 10000
        });
    }, []);

    const showInformation = useCallback((message: string) => {
        showMessage({
            message,
            type: 'info',
            duration: 5000
        });
    }, []);

    return (
        <PopupMessageContext.Provider value={{showError, showInformation, showSuccess, showWarning}}>
            <FlashMessage position="bottom"/>
            {children}
        </PopupMessageContext.Provider>);
};

export const usePopupMessage = () => useContext(PopupMessageContext);

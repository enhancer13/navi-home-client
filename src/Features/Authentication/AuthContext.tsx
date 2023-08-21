import React, {createContext, useState, useContext} from 'react';
import {Authentication} from './Authentication';
import {ServerInfo} from "../DataStorage";
import {authenticationService, BiometricAuthCheckResult} from "./AuthServices/AuthenticationService";

interface Props {
    children: React.ReactNode;
}

interface IAuthContext {
    authentication: Authentication | null;
    initiateLoginWithCredentials: (serverInfo: ServerInfo) => Promise<void>;
    initiateLoginWithBiometrics: (serverInfo: ServerInfo, username: string) => Promise<void>;
    checkBiometricAuthenticationAvailability: (serverInfo: ServerInfo | null, username: string | undefined) => Promise<BiometricAuthCheckResult>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

const AuthProvider: React.FC<Props> = ({children}) => {
    const [authentication, setAuthentication] = useState<Authentication | null>(null);

    const initiateLoginWithCredentials = async (serverInfo: ServerInfo) => {
        const newAuthentication = await authenticationService.initiateCredentialsAuthentication(serverInfo);
        setAuthentication(newAuthentication);
    };

    const initiateLoginWithBiometrics = async (serverInfo: ServerInfo, username: string) => {
        const newAuthentication = await authenticationService.initiateBiometricAuthentication(username, serverInfo);
        setAuthentication(newAuthentication);
    };

    const checkBiometricAuthenticationAvailability = async (serverInfo: ServerInfo | null, username: string | undefined): Promise<BiometricAuthCheckResult> => authenticationService.checkBiometricAuthenticationAvailability(serverInfo, username);

    const logout = async () => {
        setAuthentication(null);
    };

    return (
        <AuthContext.Provider value={{authentication, initiateLoginWithCredentials, initiateLoginWithBiometrics, checkBiometricAuthenticationAvailability, logout}}>
            {children}
        </AuthContext.Provider>
    );
};

function useAuth() {
    return useContext(AuthContext);
}

export {AuthProvider, AuthContext, useAuth};

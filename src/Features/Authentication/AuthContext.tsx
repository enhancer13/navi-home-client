import React, {createContext, useState, useContext} from 'react';
import {Authentication} from './Authentication';
import {AuthenticationInfo, authenticationInfoStorage, serverInfoStorage} from "../DataStorage";
import {backendAuthService} from "./AuthServices/BackendAuthService";
import {firebaseAuthService} from "./AuthServices/FirebaseAuthService";

interface IAuthContext {
    authentication: Authentication | null;
    login: (serverName: string, username: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

interface Props {
    children: React.ReactNode;
}

const AuthProvider: React.FC<Props> = ({children}) => {
    const [authentication, setAuthentication] = useState<Authentication | null>(null);

    const login = async (serverName: string, username: string, password?: string) => {
        const server = await serverInfoStorage.getBy(x => x.serverName === serverName);
        if (!server) {
            throw new Error(`Unable to find server with name: ${serverName}`);
        }
        const serverAddress = server.serverAddress;

        // authenticate on backend service and save access/refresh token
        const newAuthentication: Authentication = !password
            ? await backendAuthService.authenticateByBiometric(username, serverName, serverAddress)
            : await backendAuthService.authenticateByCredentials(username, password, serverName, serverAddress);

        // authenticate on 3rd party services
        await firebaseAuthService.signIn(newAuthentication);

        setAuthentication(newAuthentication);
        await authenticationInfoStorage.setLast(new AuthenticationInfo(username, serverName));
    };

    const logout = async () => {
        setAuthentication(null);
        try {
            await firebaseAuthService.signOut();
        } catch (ex) {
            console.error('Unable to logout', ex);
        }
    };

    return (
        <AuthContext.Provider value={{authentication, login, logout}}>{children}</AuthContext.Provider>
    );
};

function useAuth() {
    return useContext(AuthContext);
}

export {AuthProvider, AuthContext, useAuth};

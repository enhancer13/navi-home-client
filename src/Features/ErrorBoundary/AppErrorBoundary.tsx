import { useAuth } from "../Authentication";
import React, { ReactNode, useCallback, useMemo } from "react";
import ErrorBoundary from "react-native-error-boundary";
import { AuthenticationFailed } from "../../Errors/AuthenticationFailed";
import { Props as FallbackComponentProps } from "react-native-error-boundary/src/ErrorBoundary/FallbackComponent";
import { useNavigation } from "@react-navigation/native";
import FallbackComponent from "react-native-error-boundary/lib/ErrorBoundary/FallbackComponent";
import {RootNavigationProp} from "../../../RootStackNavigator";

type AuthErrorBoundaryProps = {
    children: Exclude<NonNullable<ReactNode>, string | number | boolean>;
};

export const AppErrorBoundary: React.FC<AuthErrorBoundaryProps> = ({ children }) => {
    const { logout } = useAuth();
    const navigation = useNavigation<RootNavigationProp>();

    const CustomFallbackComponent = useMemo(() => {
        // eslint-disable-next-line react/display-name
        return (props: FallbackComponentProps) => {
            const { error, resetError } = props;

            if (error instanceof AuthenticationFailed) {
                logout();
                navigation.navigate("Login" as never);
                resetError();
                return null;
            }

            return <FallbackComponent error={error} resetError={resetError} />;
        };
    }, [logout, navigation]);

    const onError = useCallback((error: Error, stackTrace: string) => {
        console.error("Uncaught error:", error, stackTrace);
    }, []);

    return (
        <ErrorBoundary onError={onError} FallbackComponent={CustomFallbackComponent}>
            {children}
        </ErrorBoundary>
    );
};

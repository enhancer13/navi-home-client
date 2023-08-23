import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AnimatedBackgroundContainer from './Animations/AnimatedBackgroundContainer';
import SafeAreaView from "../../Components/Layout/SafeAreaView";
import {ServerManager} from "./Components/ServerManager";
import {ServerInfo} from "../../Features/DataStorage";
import {UserAuthentication} from "./Components/UserAuthentication";
import {ServerStatus} from "./Components/Server";

const loginContainerWidth = Math.min(wp('95%'), 500);

export const LoginScreen: React.FC = () => {
    const [serverInfo, setServerInfo] = useState<ServerInfo | null>(null);
    const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
    const loginFormAnimationValueRef = useRef(new Animated.Value(0));

    console.debug('LoginScreen render')

    const loadingAnimation = () => {
        loginFormAnimationValueRef.current.setValue(0);
        Animated.sequence([
            Animated.delay(100),
            Animated.timing(loginFormAnimationValueRef.current, {
                toValue: 1,
                duration: 1000,
                useNativeDriver: true
            }),
        ]).start();
    };

    useEffect(() => {
        loadingAnimation();
    }, []);

    const handleServerChange = useCallback((value: ServerInfo | null) => {
        setServerInfo(value);
    }, []);

    const handleServerStatusChanged = useCallback((status: ServerStatus | null) => {
        setServerStatus(status);
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <AnimatedBackgroundContainer>
                <Animated.View
                    style={[
                        styles.animatedContainer,
                        {
                            opacity: loginFormAnimationValueRef.current,
                        },
                    ]}>
                    <UserAuthentication serverInfo={serverInfo} serverStatus={serverStatus} />
                    <ServerManager onServerChanged={handleServerChange} style={styles.serverPicker} onServerStatusChanged={handleServerStatusChanged} />
                </Animated.View>
            </AnimatedBackgroundContainer>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    animatedContainer: {
        // position: 'absolute',
        // alignSelf: 'center',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        width: loginContainerWidth,
        // bottom: '15%',
    },
    serverPicker: {
        paddingBottom: '20%',
    }
});

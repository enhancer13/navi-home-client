import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AnimatedBackgroundContainer from './Animations/AnimatedBackgroundContainer';
import SafeAreaView from "../../Components/Layout/SafeAreaView";
import {ServerPicker} from "./Components/ServerPicker";
import {ServerInfo} from "../../Features/DataStorage";
import {UserAuthentication} from "./Components/UserAuthentication";

const loginContainerWidth = Math.min(wp('95%'), 500);

export const LoginScreen: React.FC = () => {
    const [server, setServer] = useState<ServerInfo | null>(null);
    const loginFormAnimationValueRef = useRef(new Animated.Value(0));

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
        setServer(value);
    }, [setServer]);

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
                    <UserAuthentication server={server} />
                    <ServerPicker onChanged={handleServerChange} style={styles.serverPicker} />
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

import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {DropDownListPicker, LoadingActivityIndicator} from '../../Components/Controls';
import LoadingAnimation from './Animations/LoadingAnimation';
import {useNavigation} from '@react-navigation/native';
import {usePopupMessage} from '../../Features/Messaging';
import SafeAreaView from "../../Components/Layout/SafeAreaView";
import {TextInput, Text, useTheme, Surface, IconButton, Button} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";
import {useAuthenticationData} from "./Hooks/useAuthenticationData";
import {useAuthenticationActions} from "./Hooks/useAuthenticationActions";
import {RootNavigationProp} from "../../../App";

const containerWidth = Math.min(wp('95%'), 500);
const iconSize = containerWidth * 0.07;
const rowHeight = containerWidth * 0.11;

export const LoginScreen: React.FC = () => {
    const {showError} = usePopupMessage();
    const navigation = useNavigation<RootNavigationProp>();
    const {
        servers,
        username,
        password,
        serverName,
        setUsername,
        setPassword,
        setServerName
    } = useAuthenticationData();
    const {
        biometryActive,
        biometryType,
        busy,
        authenticateWithBiometry,
        authenticateWithCredentials,
    } = useAuthenticationActions();

    const loginFormAnimationValueRef = useRef(new Animated.Value(0));
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    const loadingAnimation = () => {
        loginFormAnimationValueRef.current.setValue(0);
        Animated.sequence([
            Animated.delay(300),
            Animated.timing(loginFormAnimationValueRef.current, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true
            }),
        ]).start();
    };

    useEffect(() => {
        loadingAnimation();
    }, []);

    const handleServerEdit = useCallback(async () => {
        if (servers.length > 0 && serverName.length > 0) {
            navigation.navigate('Server Config', {serverName});
            return;
        }

        showError('Nothing to edit.');
    }, [navigation, serverName, servers]);

    const handleServerAdd = useCallback(() => navigation.navigate('ServerConfig' as never), [navigation]);

    const handleServerChange = useCallback((value: string) => {
        setServerName(value);
    }, []);

    const handleBiometryAuthenticate = useCallback(async () => {
        await authenticateWithBiometry(serverName, username);
        !__DEV__ && setPassword('');
    }, [authenticateWithBiometry, serverName, username]);

    const handleCredentialsAuthenticate = useCallback(async () => {
        await authenticateWithCredentials(serverName, username, password);
        !__DEV__ && setPassword('');
    }, [authenticateWithCredentials, serverName, username, password]);

    const biometryIcon = useMemo(() => {
        if (!biometryActive || !biometryType) {
            return (<IconButton icon="fingerprint-off" iconColor={theme.colors.onSurface} size={iconSize}/>);
        }

        const faceIdBiometry = biometryType === Keychain.BIOMETRY_TYPE.FACE || biometryType === Keychain.BIOMETRY_TYPE.FACE_ID;
        const iconColor = biometryActive ? theme.colors.onSurface : theme.colors.onSurfaceDisabled;
        const icon = faceIdBiometry ? "face-recognition" : "fingerprint";
        return <IconButton icon={icon}
                           onPress={handleBiometryAuthenticate}
                           iconColor={iconColor}
                           animated={false}
                           selected={false}
                           size={iconSize}/>;
    }, [handleBiometryAuthenticate, biometryType, biometryActive]);

    return (
        <SafeAreaView ignoreTopInsets={true} style={styles.container}>
            <LoadingAnimation/>
            <Animated.View
                style={[
                    styles.animatedContainer,
                    {
                        opacity: loginFormAnimationValueRef.current,
                        transform: [{scale: loginFormAnimationValueRef.current}],
                    },
                ]}>
                <Text variant="displayLarge" style={styles.logoText}>Navi Home</Text>
                <Surface style={styles.formContainer} elevation={3}>
                    <View style={styles.credentialsContainer}>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Username"
                            value={username}
                            onChangeText={value => setUsername(value)}
                        />
                        <TextInput
                            style={styles.textInput}
                            placeholder="Password"
                            value={password}
                            secureTextEntry={true}
                            onChangeText={value => setPassword(value)}
                        />
                        <View style={styles.passwordChangeContainer}>
                            <DropDownListPicker
                                items={servers.map(x => ({label: x.serverName, value: x.serverName}))}
                                selectedItem={serverName}
                                containerStyle={styles.serverPickerContainer}
                                onItemChanged={handleServerChange}
                            />
                            <IconButton onPress={handleServerEdit} icon={'notebook-edit-outline'}
                                        iconColor={theme.colors.onSurface} size={iconSize}/>
                            <IconButton onPress={handleServerAdd} icon={'playlist-plus'}
                                        iconColor={theme.colors.onSurface} size={iconSize}/>
                        </View>
                    </View>
                    {busy ? <LoadingActivityIndicator style={styles.loadingIndicator} /> : (
                        <View style={styles.submitContainer}>
                            <Button compact={true} mode="contained"
                                    style={styles.submitButton}
                                    onPress={handleCredentialsAuthenticate}>
                                {"SUBMIT"}
                            </Button>
                            {biometryIcon}
                        </View>
                    )}
                </Surface>
            </Animated.View>
        </SafeAreaView>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    container: {
        flex: 1,
    },
    animatedContainer: {
        position: 'absolute',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        width: containerWidth,
        bottom: '10%',
    },
    credentialsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    textInput: {
        height: rowHeight,
        width: '90%',
        marginBottom: 5,
    },
    formContainer: {
        alignItems: 'center',
        borderRadius: 10,
        justifyContent: 'center',
        paddingBottom: '5%',
        paddingTop: '5%',
        width: '80%',
    },
    logoText: {
        marginBottom: 50,
        color: theme.colors.primary
    },
    passwordChangeContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
        width: '90%',
    },
    serverPickerContainer: {
        width: containerWidth * 0.45
    },
    loadingIndicator: {
        height: rowHeight,
    },
    submitButton: {
        flexGrow: 1,
        flex: 0.9,
        height: rowHeight,
        justifyContent: 'center',
    },
    submitContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        height: rowHeight,
        justifyContent: 'space-between',
        width: '90%',
    },
    submitBiometryButton: {
        justifyContent: 'center',
    },
    iconActive: {
        color: theme.colors.onSurface,
    },
    iconInactive: {
        color: theme.colors.onSurfaceDisabled,
    }
});

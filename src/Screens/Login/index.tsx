import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {Animated, StyleSheet, View} from 'react-native';
import * as Keychain from 'react-native-keychain';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import {DropDownListPicker, LoadingActivityIndicator} from '../../Components/Controls';
import LoadingAnimation from './Animations/LoadingAnimation';
import {useNavigation} from '@react-navigation/native';
import {usePopupMessage} from '../../Features/Messaging';
import SafeAreaView from "../../Components/Layout/SafeAreaView";
import {useTheme, Surface, IconButton, Button, Text} from "react-native-paper";
import {MD3Theme as Theme} from 'react-native-paper';
import {useAuthenticationData} from "./Hooks/useAuthenticationData";
import {useAuthenticationActions} from "./Hooks/useAuthenticationActions";
import {ListTextInputItem} from "../../Components/Controls/ListItems";
import {RootNavigationProp} from "../../RootStackNavigator";

const loginContainerWidth = Math.min(wp('95%'), 500);
const iconSize = loginContainerWidth * 0.07;
const rowHeight = loginContainerWidth * 0.11;

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
    }, [navigation, serverName, servers, showError]);

    const handleServerAdd = useCallback(() => navigation.navigate('Server Config' as never), [navigation]);

    const handleServerChange = useCallback((value: string) => {
        setServerName(value);
    }, [setServerName]);

    const handleBiometryAuthenticate = useCallback(async () => {
        await authenticateWithBiometry(serverName, username);
        !__DEV__ && setPassword('');
    }, [authenticateWithBiometry, serverName, username, setPassword]);

    const handleCredentialsAuthenticate = useCallback(async () => {
        await authenticateWithCredentials(serverName, username, password);
        !__DEV__ && setPassword('');
    }, [authenticateWithCredentials, serverName, username, password, setPassword]);

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
    }, [handleBiometryAuthenticate, biometryType, biometryActive, theme]);

    const handleUsernameChanged = useCallback((value: string) => {
        setUsername(value);
    }, [setUsername]);

    const handlePasswordChanged = useCallback((value: string) => {
        setPassword(value);
    }, [setPassword]);

    return (
        <SafeAreaView ignoreTopInsets={true} style={styles.container}>
            <LoadingAnimation />
            <Animated.View
                style={[
                    styles.animatedContainer,
                    {
                        opacity: loginFormAnimationValueRef.current,
                        transform: [{scale: loginFormAnimationValueRef.current}],
                    },
                ]}>
                <Text variant="displayMedium" style={styles.logoText}>Navi Home</Text>
                <Surface style={styles.formContainer} elevation={3}>
                    <View style={styles.credentialsContainer}>
                        <ListTextInputItem
                            style={styles.textInput}
                            placeholder="Username"
                            value={username}
                            onValueChanged={handleUsernameChanged}
                        />
                        <ListTextInputItem
                            style={styles.textInput}
                            placeholder="Password"
                            value={password}
                            secureTextEntry={true}
                            onValueChanged={handlePasswordChanged}
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
                    {busy ? <LoadingActivityIndicator style={styles.loadingIndicator}/> : (
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
        width: loginContainerWidth,
        top: '10%',
    },
    credentialsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    textInput: {
        height: rowHeight,
        width: '90%',
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
        marginBottom: 40,
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
        width: loginContainerWidth * 0.45
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
    },
});

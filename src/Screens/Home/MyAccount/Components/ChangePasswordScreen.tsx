import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {IconButton, Text, useTheme, Divider, HelperText} from 'react-native-paper';
import {MD3Theme as Theme} from 'react-native-paper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {AccountRouteProps} from '../index';
import {elevationShadowStyle} from '../../../../Helpers/StyleUtils';
import {usePopupMessage} from '../../../../Features/Messaging';
import {AppHeader} from '../../../../Components/Layout';
import {LoadingActivityIndicator} from '../../../../Components/Controls';
import {httpClient} from '../../../../Framework/Net/HttpClient/HttpClient';
import {backendEndpoints} from '../../../../Config/BackendEndpoints';
import {IPasswordChangeRequest} from '../../../../BackendTypes/Requests/IPasswordChangeRequest';
import {useAuth} from '../../../../Features/Authentication';
import {ListTextInputItem} from '../../../../Components/Controls/ListItems';

const iconSize = hp(5);

export const ChangePasswordScreen: React.FC = () => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const iconColor = theme.colors.primary;

    const navigation = useNavigation();
    const {showError, showSuccess} = usePopupMessage();

    const [previousPassword, setPreviousPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordRepeat, setNewPasswordRepeat] = useState('');
    const [validationError, setValidationError] = useState('');
    const [busy, setBusy] = useState(false);
    const {authentication} = useAuth();
    const {user} = useRoute<AccountRouteProps<'Change Password'>>().params || {};

    useEffect(() => {
        if (previousPassword.length === 0) {
            setValidationError('Please enter the previous password.');
        } else if (newPassword.length === 0) {
            setValidationError('Please enter the new password.');
        } else if (newPasswordRepeat !== newPassword) {
            setValidationError("New password doesn't match.");
        } else {
            setValidationError('');
        }
    }, [previousPassword, newPassword, newPasswordRepeat]);

    const handlePreviousPasswordChange = useCallback((value: string | undefined) => {
        setPreviousPassword(value ?? '');
    }, []);

    const handleNewPasswordChange = useCallback((value: string) => {
        setNewPassword(value);
    }, []);

    const handleNewPasswordRepeat = useCallback((value: string) => {
        setNewPasswordRepeat(value);
    }, []);

    const handleSave = useCallback(async () => {
        if (!user) {
            throw new Error('Unable to change user password because it is undefined');
        }

        setBusy(true);
        try {
            const passwordChangeRequest: IPasswordChangeRequest = {
                oldPassword: previousPassword,
                newPassword,
                repNewPassword: newPasswordRepeat,
            };
            const json = JSON.stringify(passwordChangeRequest);
            await httpClient.put(backendEndpoints.PasswordChange, {body: json, authentication});
            showSuccess('Password changed successfully');
            navigation.goBack();
        } catch (error: any) {
            showError(error.message);
        } finally {
            setBusy(false);
        }
    }, [authentication, user, newPassword, newPasswordRepeat, previousPassword, showSuccess, showError, navigation]);

    const handleCancel = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    return (
        <>
            <AppHeader title={'Change Password'} enableBackButton={true}/>
            <View style={styles.passwordChangeContainer}>
                <View style={styles.surface}>
                    <View>
                        <Text variant={'labelLarge'}>{'Please enter the previous password:'}</Text>
                        <ListTextInputItem title={'Previous password:'} secureTextEntry value={previousPassword} onValueChanged={handlePreviousPasswordChange} />
                        <Divider style={styles.divider}/>
                        <Text variant={'labelLarge'}>{'Please enter the new password:'}</Text>
                        <ListTextInputItem title={'New password'} secureTextEntry value={newPassword} onValueChanged={handleNewPasswordChange} />
                        <ListTextInputItem title={'Repeat new password'} secureTextEntry value={newPasswordRepeat} onValueChanged={handleNewPasswordRepeat} />
                        <HelperText type="info" visible={validationError.length > 0}>
                            {validationError}
                        </HelperText>
                    </View>
                    <View style={styles.controlPanelContainer}>
                        <IconButton
                            icon="cancel"
                            size={iconSize}
                            iconColor={iconColor}
                            onPress={handleCancel}
                        />
                        {busy && <LoadingActivityIndicator color={theme.colors.primary}/>}
                        <IconButton
                            icon="content-save"
                            size={iconSize}
                            iconColor={iconColor}
                            onPress={handleSave}
                            disabled={validationError.length !== 0 || busy}
                        />
                    </View>
                </View>
            </View>
        </>
    );
};

const createStyles = (theme: Theme) => {
    return StyleSheet.create({
        container: {
            justifyContent: 'space-between',
            flexGrow: 1,
        },
        passwordChangeContainer: {
            width: '100%',
            flexGrow: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        controlPanelContainer: {
            alignItems: 'center',
            flexDirection: 'row',
            height: iconSize * 1.2,
            width: '100%',
            justifyContent: 'space-between',
            paddingLeft: hp(1),
            paddingRight: hp(1),
        },
        surface: {
            ...elevationShadowStyle(theme),
            backgroundColor: theme.colors.surface,
            padding: 20,
            borderRadius: 10,
            width: '95%',
            flexGrow: 0.95,
            flex: 0.95,
            justifyContent: 'space-between',
        },
        textInput: {
            marginBottom: 10,
        },
        divider: {
            marginVertical: 10,
        },
    });
};

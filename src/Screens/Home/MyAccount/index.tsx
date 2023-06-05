import React, {useEffect, useMemo, useRef, useState} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useAuth} from "../../../Features/Authentication";
import {Avatar, Divider, List} from "react-native-paper";
import {
    ISection,
    AnimatedSectionList,
    ListSwitchItem,
    ListActionItem,
    ListNavigationItem
} from "../../../Components/Controls/List";
import {ApplicationSettings, applicationSettingsStorage} from "../../../Features/LocalStorage";
import {LocalStorageEventTypes} from "../../../Framework/Data/LocalStorage";
import {AppHeader} from "../../../Components/Layout";
import {Animated} from "react-native";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";

const PAGE_TITLE = 'My Account';
const TITLE_HEIGHT = 80;

export const MyAccount: React.FC = () => {
    const {logout, authentication} = useAuth();
    const navigation = useNavigation();
    const [applicationSettings, setApplicationSettings] = useState<ApplicationSettings>();
    const scrollY = useRef(new Animated.Value(0)).current;

    const readApplicationSettings = async () => {
        const applicationSettings = await applicationSettingsStorage.getApplicationSettings();
        setApplicationSettings(applicationSettings);
    }

    useEffect(() => {
        readApplicationSettings();
        applicationSettingsStorage.on(LocalStorageEventTypes.DataChanged, readApplicationSettings);
    }, []);

    const menuGroups = useMemo(() => {
        if (!authentication || !applicationSettings) {
            return [];
        }

        const {username, email, userRoles} = authentication.user;
        return [
            {
                title: 'Account information',
                items: [
                    <Avatar.Icon size={80} icon="account" style={{alignSelf: 'center'}}/>,
                    <List.Item title={username} description={'Username'}/>,
                    <Divider/>,
                    <List.Item title={email} description="Email address"/>,
                    <Divider/>,
                    <List.Item title={userRoles.map(x => x.userRole).join(', ')} description="Roles"/>,
                    <Divider/>
                ]
            },
            {
                title: 'Actions',
                items: [
                    <ListActionItem title={'Change password'} icon={"form-textbox-password"} action={() => undefined}/>,
                    <ListActionItem title={'Logout'} icon={"logout"} action={async () => {
                        await logout();
                        navigation.dispatch(StackActions.popToTop());
                    }}/>
                ]
            },
            {
                title: 'Configuration',
                items: [
                    <ListSwitchItem title={'Biometric authentication'} icon={"fingerprint"}
                                    value={applicationSettings.biometryAuthenticationActive} action={async (value) => {
                        applicationSettings.biometryAuthenticationActive = value;
                        await applicationSettingsStorage.update(applicationSettings);
                    }}/>,
                    <ListSwitchItem title={'Dark theme'} icon={"theme-light-dark"}
                                    value={applicationSettings.darkThemeActive} action={async (value) => {
                        applicationSettings.darkThemeActive = value;
                        await applicationSettingsStorage.update(applicationSettings);
                    }}/>
                ]
            }
        ] satisfies Array<ISection>;
    }, [authentication, applicationSettings]);

    return (
        <>
            <AppHeader
                title={PAGE_TITLE}
                enableTitleAnimation={true}
                scrollThreshold={TITLE_HEIGHT}
                scrollY={scrollY}/>
            <AnimatedSectionList
                title={PAGE_TITLE}
                sections={menuGroups}
                titleHeight={TITLE_HEIGHT}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    scrollY.setValue(event.nativeEvent.contentOffset.y);
                }}/>
        </>
    )
};

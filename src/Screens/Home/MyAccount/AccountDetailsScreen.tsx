import React, {useMemo, useRef} from 'react';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useAuth} from "../../../Features/Authentication";
import {Avatar, useTheme} from "react-native-paper";
import {
    ISection,
    AnimatedSectionList,
    ListSwitchItem,
    ListActionItem, ListNavigationItem,
} from "../../../Components/Controls/ListItems";
import {AppHeader} from "../../../Components/Layout";
import {Animated, StyleSheet} from "react-native";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {AccountStackParamList} from "./index";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {useApplicationSettings} from "../../../Features/DataStorage/Hooks/useApplicationSettings";
import {NaviTheme} from "../../../../PaperTheme";
import {ListTextItem} from "../../../Components/Controls/ListItems/ListTextItem";

const PAGE_TITLE = 'My Account';
const HEADER_HEIGHT = hp(5);
const LIST_TITLE_HEIGHT = HEADER_HEIGHT * 1.5;
const SCROLL_THRESHOLD = LIST_TITLE_HEIGHT / 2;

export const AccountDetailsScreen: React.FC = () => {
    const {logout, authentication} = useAuth();
    const navigation = useNavigation();
    const {applicationSettings, updateApplicationSettings} = useApplicationSettings();
    const scrollY = useRef(new Animated.Value(0)).current;
    const theme = useTheme<NaviTheme>();

    const menuGroups = useMemo(() => {
        if (!authentication || !applicationSettings) {
            return [];
        }

        const {username, email, userRoles} = authentication.user;
        return [
            {
                title: 'Account information',
                items: [
                    <Avatar.Icon key={1} size={80} icon="account" style={styles.avatar}/>,
                    <ListTextItem key={2} value={username} title={'Username'} icon={'face-man'} iconBackgroundColor={theme.colors.icon.blue} />,
                    <ListTextItem key={2} value={email} title={'Email address'} icon={'email'} iconBackgroundColor={theme.colors.icon.indigo} />,
                    <ListTextItem key={2} value={userRoles.map(x => x.userRole).join(', ')} title={'Roles'} icon={'account'} iconBackgroundColor={theme.colors.icon.teal}/>,
                ]
            },
            {
                title: 'Actions',
                items: [
                    <ListNavigationItem<AccountStackParamList, 'Change Password'> key={1} icon={'form-textbox-password'}
                                                                                  iconBackgroundColor={theme.colors.icon.green}
                                                                                  title={'Change password'}
                                                                                  route={'Change Password'}
                                                                                  routeParams={{user: authentication.user}}/>,
                    <ListActionItem key={2} title={'Logout'} icon={"logout"}
                                    iconBackgroundColor={theme.colors.icon.orange}
                                    action={async () => {
                        await logout();
                        navigation.dispatch(StackActions.popToTop());
                    }}/>
                ]
            },
            {
                title: 'Configuration',
                items: [
                    <ListSwitchItem key={1} title={'Biometric authentication'} icon={"fingerprint"}
                                    iconBackgroundColor={theme.colors.icon.pink}
                                    value={applicationSettings.biometryAuthenticationActive} action={async (value) => {
                        applicationSettings.biometryAuthenticationActive = value;
                        await updateApplicationSettings(applicationSettings);
                    }}/>,
                    <ListSwitchItem key={2} title={'Dark theme'} icon={"theme-light-dark"}
                                    iconBackgroundColor={theme.colors.icon.purple}
                                    value={applicationSettings.darkThemeActive} action={async (value) => {
                        applicationSettings.darkThemeActive = value;
                        await updateApplicationSettings(applicationSettings);
                    }}/>
                ]
            }
        ] satisfies Array<ISection>;
    }, [authentication, applicationSettings, updateApplicationSettings, logout, navigation, theme]);

    return (
        <>
            <AppHeader
                title={PAGE_TITLE}
                enableTitleAnimation={true}
                height={HEADER_HEIGHT}
                scrollThreshold={SCROLL_THRESHOLD}
                scrollY={scrollY}/>
            <AnimatedSectionList
                title={PAGE_TITLE}
                sections={menuGroups}
                titleHeight={LIST_TITLE_HEIGHT}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    scrollY.setValue(event.nativeEvent.contentOffset.y);
                }}/>
        </>
    )
};

const styles = StyleSheet.create({
    avatar: {
        alignSelf: 'center'
    }
})

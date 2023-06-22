import React, {useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {useRoute} from "@react-navigation/native";
import {AppHeader, ISection, SectionList} from "../../../Components/Layout";
import {ListNavigationItem} from "../../../Components/Controls/ListItems";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {splitPascalCase} from "../../../Helpers/StringUtils";
import {useAuth} from "../../../Features/Authentication";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {useTheme} from "react-native-paper";
import {NaviTheme} from "../../../../PaperTheme";

const HEADER_HEIGHT = hp(5);
const LIST_TITLE_HEIGHT = HEADER_HEIGHT * 1.5;
const SCROLL_THRESHOLD = LIST_TITLE_HEIGHT / 2;

export const SystemConfigurationScreen: React.FC = () => {
    const route = useRoute();
    const scrollY = useRef(new Animated.Value(0)).current;
    const {authentication} = useAuth();
    const theme = useTheme<NaviTheme>();

    const menuGroups = useMemo(() => {
        if (!authentication) {
            return [];
        }

        const data = [
            {
                title: 'Video processing',
                items: [
                    <ListNavigationItem key={1} title={'Video sources'} icon={"video"} iconBackgroundColor={theme.colors.icon.green} route={'Video Sources'}/>,
                    <ListNavigationItem key={2} title={'Video streaming profiles'} icon={"video-wireless"} iconBackgroundColor={theme.colors.icon.mint} route={'Video Streaming Profiles'}/>,
                    <ListNavigationItem key={3} title={'Video recording profiles'} icon={"file-video"} iconBackgroundColor={theme.colors.icon.cyan} route={'Video Recording Profiles'}/>,
                    <ListNavigationItem key={4} title={'Motion detection profiles'} icon={"motion-sensor"} iconBackgroundColor={theme.colors.icon.blue} route={'Motion Detection Profiles'}/>,
                ]
            },
            {
                title: 'Alarm configuration',
                items: [
                    <ListNavigationItem key={1} title={'Alarm profiles'} icon={"bell"} iconBackgroundColor={theme.colors.icon.purple} route={'Configure Alarm Profiles'}/>,
                ]
            },
        ] satisfies Array<ISection>;

        if (authentication.user.admin) {
            data.push({
                title: 'Administration',
                items: [
                    <ListNavigationItem key={1} title={'User accounts'} icon={"account-supervisor"} iconBackgroundColor={theme.colors.icon.red} route={'Users'}/>,
                    <ListNavigationItem key={2} title={'Firebase accounts'} icon={"account-group"} iconBackgroundColor={theme.colors.icon.orange} route={'Firebase Accounts'}/>
                ]
            })

        }
        return data;
    }, [authentication, theme]);

    const pageTitle =  splitPascalCase(route.name);

    return (
        <>
            <AppHeader
                title={pageTitle}
                height={HEADER_HEIGHT}
                enableTitleAnimation={true}
                scrollThreshold={SCROLL_THRESHOLD}
                scrollY={scrollY}/>
            <SectionList
                title={pageTitle}
                sections={menuGroups}
                titleHeight={LIST_TITLE_HEIGHT}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    scrollY.setValue(event.nativeEvent.contentOffset.y);
                }}/>
        </>
    )
};

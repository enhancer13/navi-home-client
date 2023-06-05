import React, {useMemo, useRef} from 'react';
import {Animated} from 'react-native';
import {useRoute} from "@react-navigation/native";
import {AppHeader} from "../../../Components/Layout";
import {AnimatedSectionList, ISection, ListNavigationItem} from "../../../Components/Controls/List";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {splitPascalCase} from "../../../Helpers/StringUtils";
import {useAuth} from "../../../Features/Authentication";

const TITLE_HEIGHT = 80;

export const SystemConfiguration: React.FC = () => {
    const route = useRoute();
    const scrollY = useRef(new Animated.Value(0)).current;
    const {authentication} = useAuth();

    const menuGroups = useMemo(() => {
        if (!authentication) {
            return [];
        }

        const data = [
            {
                title: 'Video streaming',
                items: [
                    <ListNavigationItem key={1} title={'Video cameras'} icon={"camera"} route={'Video Cameras'}/>,
                    <ListNavigationItem key={2} title={'Video streaming profiles'} icon={"video-wireless"} route={'Video Streaming Profiles'}/>,
                    <ListNavigationItem key={3} title={'Motion detection profiles'} icon={"motion-sensor"} route={'Motion Detection Profiles'}/>,
                ]
            },
        ] satisfies Array<ISection>;

        if (authentication.user.admin) {
            data.push({
                title: 'Administration',
                items: [
                    <ListNavigationItem key={1} title={'User accounts'} icon={"account-supervisor"} route={'Users'}/>,
                    <ListNavigationItem key={2} title={'Service accounts'} icon={"account-sync"} route={''}/>
                ]
            })

        }
        return data;
    }, [authentication]);

    const pageTitle =  splitPascalCase(route.name);

    return (
        <>
            <AppHeader
                title={pageTitle}
                enableTitleAnimation={true}
                scrollThreshold={TITLE_HEIGHT}
                scrollY={scrollY}/>
            <AnimatedSectionList
                title={pageTitle}
                sections={menuGroups}
                titleHeight={TITLE_HEIGHT}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    scrollY.setValue(event.nativeEvent.contentOffset.y);
                }}/>
        </>
    )
};

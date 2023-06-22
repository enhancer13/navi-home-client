import {Animated, StyleSheet, View} from "react-native";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {EntityViewContainer} from "../../../../Features/EntityList/EntityViewContainer";
import {Divider, IconButton, Text, useTheme} from "react-native-paper";
import {AlarmActions, DayOfWeeks} from "../../../../BackendTypes";
import {ScaleAnimation} from "../../../../Animations";
import {useDialog} from "../../../../Features/Dialog";
import {AlarmSuspendDialog} from "./AlarmSuspendDialog";
import {AlarmDayOfWeek} from "./AlarmDayOfWeek";
import {AlarmAction} from "./AlarmAction";
import {useAlarmProfileActions} from "../Hooks/useAlarmProfileActions";
import {IAlarmProfile} from "../../../../BackendTypes/Entities/IAlarmProfile";
import {EntityViewComponentProps} from "../../../../Features/EntityList/EntityListScreen";
import {LayoutChangeEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";

const AlarmProfile: React.FC<EntityViewComponentProps> = ({entity}) => {
    const alarmProfile = entity as IAlarmProfile;
    const {alarmProfileToggle, suspendAlarmProfile} = useAlarmProfileActions(alarmProfile);
    const {openDialog} = useDialog();
    const scaleAnimationRef = useRef(new ScaleAnimation());

    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);
    const [width, setWidth] = useState(0);
    const activeColor = theme.colors.primary;
    const inactiveColor = theme.colors.onSurfaceVariant;

    const showSuspendDialog = () => {
        openDialog(AlarmSuspendDialog, () => ({
            title: 'Please choose suspend time:',
            onConfirm: suspendAlarmProfile
        }));
    };

    const onLayout = (event: LayoutChangeEvent) => {
        const {width} = event.nativeEvent.layout;
        setWidth(width);
    };

    useEffect(() => {
        if (alarmProfile.active) {
            scaleAnimationRef.current.startScaleInAnimation(500);
        } else {
            scaleAnimationRef.current.startScaleOutAnimation(500);
        }
    }, [alarmProfile.active]);

    return (
        <EntityViewContainer onLayout={onLayout}>
            <View style={styles.rowContainer}>
                <View style={styles.columnContainer}>
                    <IconButton icon={'power'} size={width * 0.12}
                                iconColor={alarmProfile.active ? activeColor : inactiveColor}
                                onPress={alarmProfileToggle} mode={'contained'}/>
                    <Animated.View style={scaleAnimationRef.current.getStyle(0, 1)}>
                        <IconButton icon={'timer'} size={width * 0.08}
                                    iconColor={alarmProfile.suspendSecondsLeft > 0 ? activeColor : inactiveColor}
                                    onPress={showSuspendDialog}/>
                    </Animated.View>
                </View>
                <Divider style={styles.verticalDivider}/>
                <View style={styles.alarmProfileContainer}>
                    <Text numberOfLines={1}>{alarmProfile.profileName}</Text>
                    <View style={styles.alarmActionsContainer}>
                        <View style={styles.usersContainer}>
                            <Text numberOfLines={1} style={styles.usersText}>
                                {alarmProfile.users.map(user => user.username).join(', ')}
                            </Text>
                        </View>
                        <View style={styles.itemsContainer}>
                            {Object.keys(AlarmActions).map((alarmAction) => {
                                return <AlarmAction
                                    key={alarmAction}
                                    containerWidth={width * 0.05}
                                    alarmAction={alarmAction as keyof typeof AlarmActions}
                                    isActive={alarmProfile.alarmActions.some(x => x.alarmAction === alarmAction)}
                                />
                            })}
                        </View>
                    </View>
                    <Text>{alarmProfile.startTime && alarmProfile.endTime ? `${alarmProfile.startTime} - ${alarmProfile.endTime}` : ''}</Text>
                    <View style={styles.itemsContainer}>
                        {Object.keys(DayOfWeeks).map((dayOfWeek) => {
                            return <AlarmDayOfWeek
                                key={dayOfWeek}
                                containerWidth={width * 0.07}
                                dayOfWeek={dayOfWeek}
                                isActive={alarmProfile.alarmDaysOfWeek.some(x => x.alarmDayOfWeek == dayOfWeek)}
                            />
                        })}
                    </View>
                </View>
            </View>
        </EntityViewContainer>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    columnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    alarmProfileContainer: {
        flexGrow: 1,
        padding: 10
    },
    alarmActionsContainer: {
        borderBottomWidth: 0.3,
        borderColor: theme.colors.outlineVariant,
        borderTopWidth: 0.3,
        marginBottom: 3,
        paddingBottom: 3,
        width: '100%',
    },
    itemsContainer: {
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    usersContainer: {
        opacity: 0.4,
    },
    usersText: {
        fontSize: 12,
        backgroundColor: 'transparent'
    },
    verticalDivider: {
        height: '90%',
        width: 1,
        color: theme.colors.outlineVariant
    },
});

export default AlarmProfile;

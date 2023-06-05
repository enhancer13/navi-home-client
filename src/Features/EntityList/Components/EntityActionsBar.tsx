import {MD3Theme as Theme, Text, useTheme} from "react-native-paper";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {Animated, StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {ScaleAnimation, RotateAnimation, ResizeAnimation, SlideAnimation, FadeAnimation} from "../../../Animations";
import {ConfirmationDialog, useDialog} from "../../Dialog";
import {elevationShadowStyle} from "../../../Helpers/StyleUtils";

const AnimatedPaperText = Animated.createAnimatedComponent(Text);

declare type ActionBarProps = {
    selectionActive: boolean;
    height: number;
    onCreate: () => void;
    onSave: () => void;
    onCopy: () => void;
    onDelete: () => void;
    onSelectAll: () => void;
    onDeselectAll: () => void;
    onRevert: () => void;
    startSelection: () => void;
    stopSelection: () => void;
    actionsStatus: ActionsStatus;
    primaryLabel: string;
    onPrimary: () => void;
    containerStyle?: StyleProp<ViewStyle>;
}

export declare type ActionsStatus = {
    canCreate: boolean; // can create new items
    canUpdate: boolean; // can update existing items
    canSave: boolean; // can save changes (on selected items)
    canSelect: boolean;
    canDelete: boolean; // can delete selected items
    canRevert: boolean; // can revert changes (on selected items)
    canCopy: boolean; // can copy selected items
    canSelectAll: boolean;
    canDeselectAll: boolean;
}

declare type ActionButtonProps = {
    icon: string;
    onPress: () => void;
    disabled: boolean;
    label?: string;
}

export const EntityActionsBar: React.FC<ActionBarProps> = ({
                                                               selectionActive,
                                                               height,
                                                               actionsStatus,
                                                               onCreate,
                                                               onSave,
                                                               onCopy,
                                                               onDelete,
                                                               onRevert,
                                                               onSelectAll,
                                                               onDeselectAll,
                                                               startSelection,
                                                               stopSelection,
                                                               primaryLabel,
                                                               onPrimary,
                                                               containerStyle
                                                           }) => {
    const theme = useTheme();
    const {openDialog} = useDialog();
    const styles = useMemo(() => createStyles(theme, height), [theme, height]);
    const [extended, setExtended] = useState(false);
    const [actionButtons, setActionButtons] = useState<ActionButtonProps[]>([]);
    const [mainLabelText, setMainLabelText] = useState(primaryLabel);
    const primaryLabelRef = useRef(primaryLabel);

    const actionBarWidthAnimationRef = useRef(new ResizeAnimation('width'));
    const chevronRotationRef = useRef(new RotateAnimation());
    const actionButtonSlideAnimationRef = useRef(new SlideAnimation('x'));
    const actionButtonScaleAnimationRef = useRef(new ScaleAnimation());
    const mainLabelFadeAnimationRef = useRef(new FadeAnimation());

    const confirmAction = (actionName: string, action: () => void) => {
        openDialog(ConfirmationDialog,
            () => ({
                title: "Confirm action",
                message: `Are you sure you want to ${actionName} the selected item(s)?`,
                onConfirm: action,
            }),
        );
    }

    useEffect(() => {
        const newActionButtons: ActionButtonProps[] = [
            {
                icon: 'delete',
                onPress: () => confirmAction('delete', onDelete),
                disabled: !actionsStatus.canDelete,
            },
            {
                icon: 'file-undo-outline',
                onPress: onRevert,
                disabled: !actionsStatus.canRevert,
            },
            {
                icon: 'select-remove',
                onPress: onDeselectAll,
                disabled: !actionsStatus.canDeselectAll,
            },
            {
                icon: 'select-all',
                onPress: onSelectAll,
                disabled: !actionsStatus.canSelectAll,
            },
            {
                icon: 'content-copy',
                onPress: onCopy,
                disabled: !actionsStatus.canCopy,
            },
            {
                icon: 'content-save-outline',
                onPress: () => onSave(),
                disabled: !(actionsStatus.canSave),
            },
            {
                icon: 'file-plus-outline',
                onPress: onCreate,
                disabled: !(actionsStatus.canCreate),
            },
        ];
        setActionButtons(newActionButtons);
    }, [actionsStatus]);

    useEffect(() => {
        setExtended(selectionActive);
    }, [selectionActive]);

    const toggleExtended = () => {
        setExtended(prevState => !prevState);
    };

    useEffect(() => {
        const totalAnimationDuration = 500;
        Animated.parallel([
            chevronRotationRef.current.getAnimation(extended ? 1 : 0, totalAnimationDuration),
            actionBarWidthAnimationRef.current.getAnimation(extended ? (actionButtons.length * (iconSize + iconSpacing)) : 0, totalAnimationDuration),
            actionButtonSlideAnimationRef.current.getAnimation(extended ? 1 : 0, totalAnimationDuration),
            actionButtonScaleAnimationRef.current.getAnimation(extended ? 1 : 0, totalAnimationDuration),
        ]).start();

        mainLabelFadeAnimationRef.current.getAnimation(0, totalAnimationDuration / 2).start(() => {
            setMainLabelText(extended ? 'Cancel' : primaryLabelRef.current);
            mainLabelFadeAnimationRef.current.getAnimation(1, totalAnimationDuration / 2).start();
        })

        if (extended) {
            startSelection();
        } else {
            stopSelection();
        }
    }, [extended]);

    useEffect(() => {
        primaryLabelRef.current = primaryLabel;
        setMainLabelText(extended ? 'Cancel' : primaryLabel);
    }, [primaryLabel]);

    const cancelAction = () => {
        setExtended(false);
        stopSelection();
    }

    const iconSize = height * 0.6;
    const iconSpacing = iconSize * 0.6;

    const actionButtonsElements = actionButtons.map((actionButton: ActionButtonProps, index: number) => {
        const {icon, onPress, disabled} = actionButton;
        const style = actionButtonSlideAnimationRef.current.getStyle(animatedValue => {
            return animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -(index) * (iconSize + iconSpacing)]
            });
        });

        return (
            <Animated.View key={index} style={[styles.actionButton, style]}>
                <Animated.View style={actionButtonScaleAnimationRef.current.getStyle(0, 1)}>
                    <TouchableOpacity onPress={onPress} disabled={disabled}>
                        <Icon name={icon} size={iconSize}
                              color={disabled ? theme.colors.inversePrimary : theme.colors.onPrimary}/>
                    </TouchableOpacity>
                </Animated.View>
            </Animated.View>);
    });

    return (
        <View style={[styles.container, containerStyle]}>
            <TouchableOpacity style={styles.chevron} onPress={toggleExtended}>
                <Animated.View style={chevronRotationRef.current.getStyle()}>
                    <Icon name={'chevron-left'} size={iconSize} color={theme.colors.onPrimary}/>
                </Animated.View>
            </TouchableOpacity>
            <Animated.View style={[styles.actionButtonsContainer, actionBarWidthAnimationRef.current.getStyle()]}>
                {actionButtonsElements}
            </Animated.View>
            <TouchableOpacity onPress={extended ? cancelAction : onPrimary} style={styles.fabContainer}>
                <AnimatedPaperText style={[styles.mainLabel, mainLabelFadeAnimationRef.current.getStyle()]}>
                    {mainLabelText}
                </AnimatedPaperText>
            </TouchableOpacity>
        </View>
    );
};

const createStyles = (theme: Theme, height: number) =>
    StyleSheet.create({
        container: {
            ...elevationShadowStyle(theme, 10),
            height,
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 20,
            backgroundColor: theme.colors.primary,
            opacity: 0.9,
            position: "absolute",
            bottom: 10,
            right: 10,
        },
        actionButton: {
            position: "absolute",
            right: 0,
        },
        fabContainer: {
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            paddingHorizontal: 12,
            paddingVertical: 4,
            minWidth: 80,
            minHeight: 40,
        },
        mainLabel: {
            color: theme.colors.onPrimary,
            marginLeft: 0,
            fontSize: 16,
        },
        chevron: {
            zIndex: 10,
        },
        actionButtonsContainer: {
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
        },
    });

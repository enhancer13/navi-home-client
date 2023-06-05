import React, {useMemo} from 'react';
import Dialog from "react-native-dialog";
import {DialogContentProps} from "../../../../Features/Dialog";
import {Text, useTheme} from "react-native-paper";
import {MD3Theme as Theme} from "react-native-paper/lib/typescript/src/types";
import {StyleSheet} from "react-native";

interface AlarmSuspendDialogProps extends DialogContentProps {
    onConfirm: (minutes: number) => void;
}

export const AlarmSuspendDialog: React.FC<AlarmSuspendDialogProps> = ({title, onConfirm}) => {
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    return (
        <Dialog.Container visible={true}>
            <Dialog.Title>
                <Text>{title}</Text>
            </Dialog.Title>
            <Dialog.Button
                style={styles.button}
                label="Remove"
                onPress={() => onConfirm(0)}
            />
            <Dialog.Button
                style={styles.button}
                label="10 min"
                onPress={() => onConfirm(10)}
            />
            <Dialog.Button
                style={styles.button}
                label="30 min"
                onPress={() => onConfirm(30)}
            />
            <Dialog.Button
                style={styles.button}
                label="60 min"
                onPress={() => onConfirm(60)}
            />
            <Dialog.Button
                style={styles.button}
                label="120 min"
                onPress={() => onConfirm(120)}
            />
        </Dialog.Container>
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    button: {
        color: theme.colors.primary,
    },
});

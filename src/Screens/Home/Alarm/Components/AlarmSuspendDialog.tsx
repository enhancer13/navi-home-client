import React from 'react';
import {Dialog, Text, Button} from 'react-native-paper';
import {DialogContentProps} from '../../../../Features/Dialog';
import {StyleSheet, View} from 'react-native';

interface AlarmSuspendDialogProps extends DialogContentProps {
    onConfirm: (minutes: number) => void;
}

export const AlarmSuspendDialog: React.FC<AlarmSuspendDialogProps> = ({title, onConfirm, onCancel}) => {
    return (
        <Dialog visible={true} onDismiss={onCancel}>
            <Dialog.Title>
                <Text variant={'titleLarge'}>{title}</Text>
            </Dialog.Title>
            <Dialog.Content>
                <View style={styles.buttonContainer}>
                    <Button onPress={() => onConfirm(0)}>Remove</Button>
                    <Button onPress={() => onConfirm(10)}>10 min</Button>
                    <Button onPress={() => onConfirm(30)}>30 min</Button>
                    <Button onPress={() => onConfirm(60)}>60 min</Button>
                    <Button onPress={() => onConfirm(120)}>120 min</Button>
                </View>
            </Dialog.Content>
        </Dialog>
    );
};

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 16,
    },
});

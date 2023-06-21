import React from 'react';
import { Dialog, Text, Button, useTheme } from 'react-native-paper';
import { DialogContentProps } from './DialogContext';

export interface ConfirmationDialogProps extends DialogContentProps {
    onConfirm: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
    const { title, message, onConfirm, onCancel } = props;

    return (
        <Dialog visible={true}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content><Text>{message}</Text></Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => onCancel && onCancel()}>Cancel</Button>
                <Button onPress={onConfirm}>Confirm</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

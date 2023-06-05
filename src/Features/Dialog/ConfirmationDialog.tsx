import React from 'react';
import Dialog from "react-native-dialog";
import {DialogContentProps} from "./DialogContext";

export interface ConfirmationDialogProps extends DialogContentProps {
    onConfirm: () => void;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = (props) => {
    const {title, message, onConfirm, onCancel} = props;
    return (
        <Dialog.Container visible={true}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{message}</Dialog.Description>
            <Dialog.Button label="Cancel" onPress={() => onCancel && onCancel()}/>
            <Dialog.Button label="Confirm" onPress={onConfirm}/>
        </Dialog.Container>
    );
};

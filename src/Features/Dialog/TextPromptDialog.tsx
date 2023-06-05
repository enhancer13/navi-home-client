import React from "react";
import Dialog from "react-native-dialog";
import {DialogContentProps} from "./DialogContext";

interface TextPromptDialogProps extends DialogContentProps {
    onConfirm: (text: string) => void;
}

export const TextPromptDialog: React.FC<TextPromptDialogProps> = (props) => {
    const {title, message, onConfirm, onCancel} = props;
    const [text, setText] = React.useState<string>("");

    return (
        <Dialog.Container visible={true}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Description>{message}</Dialog.Description>
            <Dialog.Input onChangeText={(value) => setText(value)} />
            <Dialog.Button label="Cancel" onPress={() => onCancel && onCancel()}/>
            <Dialog.Button label="Confirm" onPress={() => onConfirm(text)}/>
        </Dialog.Container>
    );
};

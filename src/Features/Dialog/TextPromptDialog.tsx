import React from 'react';
import { Dialog, Text, Button, TextInput } from 'react-native-paper';
import { DialogContentProps } from './DialogContext';

interface TextPromptDialogProps extends DialogContentProps {
    onConfirm: (text: string) => void;
}

export const TextPromptDialog: React.FC<TextPromptDialogProps> = (props) => {
    const { title, message, onConfirm, onCancel } = props;
    const [text, setText] = React.useState<string>('');

    return (
        <Dialog visible={true}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
                <Text>{message}</Text>
                <TextInput value={text} onChangeText={setText} />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={() => onCancel && onCancel()}>Cancel</Button>
                <Button onPress={() => onConfirm(text)}>Confirm</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

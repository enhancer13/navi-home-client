import React, {useCallback} from 'react';
import { Dialog, Text, Button, TextInput } from 'react-native-paper';
import { DialogContentProps } from './DialogContext';

interface TextPromptDialogProps extends DialogContentProps {
    onConfirm: (text: string) => void;
}

export const TextPromptDialog: React.FC<TextPromptDialogProps> = (props) => {
    const { title, message, onConfirm, onCancel } = props;
    const [text, setText] = React.useState<string>('');

    const handleCancel = useCallback(() => {
        onCancel?.();
    }, [onCancel]);

    const handleConfirm = useCallback(() => {
        onConfirm(text);
    }, [onConfirm, text]);

    return (
        <Dialog visible={true}>
            <Dialog.Title>{title}</Dialog.Title>
            <Dialog.Content>
                <Text>{message}</Text>
                <TextInput value={text} onChangeText={setText} />
            </Dialog.Content>
            <Dialog.Actions>
                <Button onPress={handleCancel}>Cancel</Button>
                <Button onPress={handleConfirm}>Confirm</Button>
            </Dialog.Actions>
        </Dialog>
    );
};

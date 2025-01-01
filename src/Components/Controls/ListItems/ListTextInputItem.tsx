import React, {useEffect, useState} from 'react';
import {TextInput} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {useToggle} from '../../Hooks/useToggle';
import {StyleProp} from 'react-native/Libraries/StyleSheet/StyleSheet';
import {TextStyle} from 'react-native/Libraries/StyleSheet/StyleSheetTypes';
import {ListIcon} from './ListIcon';

export interface InputProps {
    title?: string;
    readonly?: boolean;
    secureTextEntry?: boolean;
    style?: StyleProp<TextStyle>;
    placeholder?: string;
    icon?: string;
    iconColor?: string;
    iconBackgroundColor?: string;
}

interface TextInputProps extends InputProps {
    inputMode?: 'text' | 'email';
    value: string;
    onValueChanged?: (value: string) => void;
}

export const ListTextInputItem: React.FC<TextInputProps> = ({
                                                                title = '',
                                                                value,
                                                                placeholder,
                                                                onValueChanged,
                                                                readonly,
                                                                secureTextEntry = false,
                                                                style,
                                                                icon,
                                                                iconColor,
                                                                iconBackgroundColor,
                                                            }) => {
    const [inputValue, setInputValue] = useState<string | null>(value as string);
    const [hidePassword, toggleHidePassword] = useToggle(secureTextEntry);

    const handleInputChanged = (input: string) => {
        setInputValue((prevValue) => {
            if (prevValue !== input) {
                onValueChanged?.(input);
            }
            return input;
        });
    };

    useEffect(() => {
        if (inputValue !== value) {
            setInputValue(value as string);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.textInput, style]}
                placeholder={placeholder}
                mode="flat"
                label={title}
                value={inputValue ?? ''}
                onChangeText={handleInputChanged}
                disabled={readonly}
                secureTextEntry={hidePassword}
                left={icon && <ListIcon icon={icon} iconColor={iconColor} iconBackgroundColor={iconBackgroundColor} />}
                right={
                    secureTextEntry && (
                        <TextInput.Icon
                            icon={secureTextEntry ? 'eye' : 'eye-off'}
                            onPress={toggleHidePassword}
                        />
                    )
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 5,
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
    },
});

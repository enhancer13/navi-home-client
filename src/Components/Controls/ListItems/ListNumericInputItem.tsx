import React, {useEffect, useState} from 'react';
import {useToggle} from '../../Hooks/useToggle';
import {StyleSheet, View} from 'react-native';
import {TextInput} from 'react-native-paper';
import {InputProps} from './ListTextInputItem';

interface NumericProps extends InputProps {
    inputMode: 'decimal' | 'numeric';
    value: number | null;
    onValueChanged: (value: number | null) => void;
}

export const ListNumericInputItem: React.FC<NumericProps> = ({
                                                                 title = '',
                                                                 value,
                                                                 placeholder,
                                                                 onValueChanged,
                                                                 readonly,
                                                                 secureTextEntry = false,
                                                                 style,
                                                                 inputMode,
                                                             }) => {
    const [inputValue, setInputValue] = useState<string>(value?.toString() ?? '');
    const [hideInput, toggleHideInput] = useToggle(secureTextEntry);

    const handleInputChanged = (input: string) => {
        if (input === '') {
            onValueChanged(null);
            setInputValue(input);
            return;
        }

        // inputMode doesnt work on desktop devices
        const isNumericInput = inputMode === 'numeric';
        const isDecimalInput = inputMode === 'decimal';
        const isValidInput =
            isNumericInput && /^[0-9]*$/.test(input) // Numeric input allows integers only
            || isDecimalInput && /^(\d+([.,]\d*)?|[.,](\d+))$/.test(input); // Decimal input allows integers and decimals in specific formats
        if (!isValidInput) {
            return;
        }

        const inputNormalized = input.replace(',', '.');
        const newValue: number | null = parseFloat(inputNormalized);
        if (isNaN(newValue)) {
            throw new Error(`Cannot parse text input as number: ${input}`);
        }

        setInputValue(input);
        onValueChanged(newValue);
    };

    useEffect(() => {
        const newValue = value?.toString() ?? '';
        if (inputValue !== newValue) {
            setInputValue(newValue);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <View style={styles.container}>
            <TextInput
                inputMode={inputMode}
                style={[styles.textInput, style]}
                placeholder={placeholder}
                mode="flat"
                label={title}
                value={inputValue}
                onChangeText={handleInputChanged}
                disabled={readonly}
                secureTextEntry={hideInput}
                right={
                    secureTextEntry && (
                        <TextInput.Icon
                            icon={secureTextEntry ? 'eye' : 'eye-off'}
                            onPress={toggleHideInput}
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

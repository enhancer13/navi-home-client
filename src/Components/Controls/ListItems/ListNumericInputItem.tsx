import React, {useEffect, useState} from "react";
import {useToggle} from "../../Hooks/useToggle";
import {StyleSheet, View} from "react-native";
import {TextInput} from "react-native-paper";
import {InputProps} from "./ListTextInputItem";

interface NumericProps extends InputProps {
    inputMode: "decimal" | "numeric";
    value: number | null;
    onValueChanged: (value: string | number | null) => void;
}

export const ListNumericInputItem: React.FC<NumericProps> = ({
                                                                 title = "",
                                                                 value,
                                                                 placeholder,
                                                                 onValueChanged,
                                                                 readonly,
                                                                 secureTextEntry = false,
                                                                 style,
                                                                 inputMode,
                                                             }) => {
    const [inputValue, setInputValue] = useState<number | null>(value as number);
    const [hidePassword, toggleHidePassword] = useToggle(secureTextEntry);

    const handleInputChanged = (input: string) => {
        let newValue: number | null = parseFloat(input);
        if (isNaN(newValue)) {
            newValue = null;
        }

        setInputValue((prevValue) => {
            if (prevValue !== newValue) {
                onValueChanged(newValue);
            }
            return newValue;
        });
    };

    useEffect(() => {
        if (inputValue !== value) {
            setInputValue(value);
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
                value={inputValue?.toString() ?? ""}
                onChangeText={handleInputChanged}
                disabled={readonly}
                secureTextEntry={hidePassword}
                right={
                    secureTextEntry && (
                        <TextInput.Icon
                            icon={secureTextEntry ? "eye" : "eye-off"}
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
        width: "100%",
        marginBottom: 5,
        alignItems: "center",
    },
    textInput: {
        width: "100%",
    },
});

import React, {useEffect} from "react";
import {TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {useToggle} from "../../Hooks/useToggle";
import {StyleProp} from "react-native/Libraries/StyleSheet/StyleSheet";
import {TextStyle} from "react-native/Libraries/StyleSheet/StyleSheetTypes";

declare type Props = {
    value: string;
    onValueChanged: (value: string) => void;
    title?: string;
    readonly?: boolean;
    secureTextEntry?: boolean;
    style?: StyleProp<TextStyle> | undefined;
    placeholder?: string | undefined;
}

export const ListTextInputItem: React.FC<Props> = ({
                                                       title = '',
                                                       value,
                                                       placeholder,
                                                       onValueChanged,
                                                       readonly,
                                                       secureTextEntry = false,
                                                       style
                                                   }) => {
    const [inputValue, setInputValue] = React.useState(value);
    const [hidePassword, toggleHidePassword] = useToggle(secureTextEntry);

    const onInputChanged = (text: string) => {
        setInputValue(text);
    };

    useEffect(() => {
        if (inputValue != value) {
            setInputValue(value);
        }
    }, [value])

    useEffect(() => {
        if (inputValue != value) {
            onValueChanged(inputValue);
        }
    }, [inputValue])

    return (
        <View style={styles.container}>
            <TextInput
                style={[styles.textInput, style]}
                placeholder={placeholder}
                mode="flat"
                label={title}
                value={inputValue}
                onChangeText={onInputChanged}
                disabled={readonly}
                secureTextEntry={hidePassword}
                right={secureTextEntry && (
                    <TextInput.Icon
                        icon={secureTextEntry ? "eye" : "eye-off"}
                        onPress={toggleHidePassword}
                    />
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 5,
        alignItems: "center",
    },
    textInput: {
        width: '100%'
    }
})

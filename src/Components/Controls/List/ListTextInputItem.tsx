import React, {useEffect} from "react";
import {TextInput} from "react-native-paper";
import {StyleSheet, View} from "react-native";
import {useToggle} from "../../Hooks/useToggle";

declare type Props = {
    title: string;
    value: string;
    onValueChanged: (value: string) => void;
    readonly?: boolean;
    secureTextEntry?: boolean;
}

export const ListTextInputItem: React.FC<Props> = ({
                                                       title,
                                                       value,
                                                       onValueChanged,
                                                       readonly,
                                                       secureTextEntry = false
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
        marginBottom: 10
    }
})

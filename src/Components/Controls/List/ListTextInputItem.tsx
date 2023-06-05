import React, {useEffect} from "react";
import {TextInput} from "react-native-paper";
import {View} from "react-native";

declare type Props = {
    title: string;
    value: string | undefined;
    onValueChanged: (value: string | undefined) => void;
    readonly?: boolean;
    secureTextEntry?: boolean;
}

export const ListTextInputItem: React.FC<Props> = ({
                                                       title,
                                                       value,
                                                       onValueChanged,
                                                       readonly,
                                                       secureTextEntry
                                                   }) => {
    const [inputValue, setInputValue] = React.useState(value);

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
        <View style={{width: '100%', marginBottom: 10}}>
            <TextInput
                mode="flat"
                label={title}
                value={inputValue}
                onChangeText={onInputChanged}
                disabled={readonly}
                secureTextEntry={secureTextEntry}
                right={secureTextEntry && <TextInput.Icon icon="eye" />}
            />
        </View>
    )
}

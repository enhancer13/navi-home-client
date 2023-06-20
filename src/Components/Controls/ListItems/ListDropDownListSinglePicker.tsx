import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import {Divider, List} from 'react-native-paper';
import {DropDownListPicker} from "../DropDownListPicker";
import {ItemType, ValueType} from "react-native-dropdown-picker";

declare type Props<T extends ValueType> = {
    title: string;
    selectedItem: T;
    items: T[];
    readonly: boolean;
    onChange: (value: any) => void;
    titleFormatter?: (title: string) => string;
};

export const ListDropDownListSinglePicker: React.FC<Props<string>> = ({
                                                                     title,
                                                                     selectedItem,
                                                                     items,
                                                                     readonly,
                                                                     onChange,
                                                                     titleFormatter
                                                                 }) => {

    const formattedItems: ItemType<string>[] = useMemo(() => {
        return items.map(x => {
            const itemLabel = titleFormatter ? titleFormatter(x) : x;
            return {
                label: itemLabel,
                value: x
            };
        });
    }, [items, titleFormatter]);

    return (
        <>
            <List.Item title={title} />
            <DropDownListPicker
                selectedItem={selectedItem}
                items={formattedItems}
                onItemChanged={onChange}
                disabled={readonly}
            />
            <Divider style={styles.divider}/>
        </>
    );
}

const styles = StyleSheet.create({
    divider: {
        marginVertical: 10,
    }
});

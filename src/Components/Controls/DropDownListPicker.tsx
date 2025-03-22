import React, {useState, useEffect, useCallback, useMemo} from 'react';
import DropDownPicker, {ItemType, ValueType} from 'react-native-dropdown-picker';
import {StyleProp, StyleSheet, ViewStyle} from 'react-native';
import isEqual from 'lodash/isEqual';
import {MD3Theme as Theme} from 'react-native-paper';
import {useTheme} from 'react-native-paper';

interface DropDownListPickerProps<T extends ValueType> {
    selectedItem: null | T | T[];
    items: ItemType<T>[];
    onItemChanged: (item: T | T[] | null) => void;
    disabled?: boolean;
    multiple?: boolean;
    loading?: boolean;
    containerStyle?: StyleProp<ViewStyle> | undefined;
}

export const DropDownListPicker: React.FC<DropDownListPickerProps<any>> = ({
                                                                               selectedItem: initialSelectedItem,
                                                                               items: initialItems,
                                                                               onItemChanged,
                                                                               disabled,
                                                                               containerStyle,
                                                                               multiple = false,
                                                                               loading = false,
                                                                           }) => {
    const [open, setOpen] = useState<boolean>(false);
    const [prevSelectedItem, setPrevSelectedItem] = useState<any | null>(null);
    const [selectedItem, setSelectedItem] = useState<any | null>(initialSelectedItem);
    const [items, setItems] = useState<any[]>(initialItems);
    const theme = useTheme();
    const styles = useMemo(() => createStyles(theme), [theme]);

    useEffect(() => {
        if (!isEqual(initialItems, items)) {
            setItems(initialItems);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialItems]);

    useEffect(() => {
        if (multiple && !isEqual(selectedItem, initialSelectedItem as any[])) {
            setSelectedItem(initialSelectedItem);
            setPrevSelectedItem(initialSelectedItem);
        }

        if (!multiple && selectedItem !== initialSelectedItem) {
            setSelectedItem(initialSelectedItem);
            setPrevSelectedItem(initialSelectedItem);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialSelectedItem]);

    const onChangeValue = useCallback((value: ValueType | ValueType[] | null) => {
        if (multiple && !isEqual(prevSelectedItem, value)) {
            setPrevSelectedItem(value);
            onItemChanged?.(value);
            return;
        }
        if (!multiple && prevSelectedItem !== value && value !== null) {
            setPrevSelectedItem(value);
            onItemChanged?.(value);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prevSelectedItem]);

    return (
        <DropDownPicker
            open={open}
            setOpen={setOpen}
            value={selectedItem}
            setValue={setSelectedItem}
            items={items}
            onChangeValue={onChangeValue}
            containerStyle={containerStyle}
            dropDownContainerStyle={styles.dropDownContainerStyle}
            style={styles.picker}
            textStyle={styles.pickerText}
            badgeTextStyle={styles.badgeText}
            disableBorderRadius={true}
            disabled={disabled}
            dropDownDirection="TOP"
            multiple={multiple}
            loading={loading}
            mode="BADGE"
            badgeColors={theme.colors.surface}
            badgeDotColors={['#e76f51', '#00b4d8', '#e9c46a', '#e76f51', '#8ac926', '#00b4d8', '#e9c46a']}
            listMode={'SCROLLVIEW'}
        />
    );
};

const createStyles = (theme: Theme) => StyleSheet.create({
    picker: {
        backgroundColor: theme.colors.surfaceVariant,
        borderWidth: 0,
    },
    pickerText: {
        color: theme.colors.onSurfaceVariant,
    },
    badgeText: {
        color: theme.colors.onSurface,
    },
    dropDownContainerStyle: {
        backgroundColor: theme.colors.surfaceVariant,
        borderWidth: 0.5,
        borderColor: theme.colors.primary,
    },
});

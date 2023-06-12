import {
    EntityFieldInputTypes, EntityFieldSearchPolicies,
    IEntity,
    IEntityFieldDefinition,
} from "../../../../BackendTypes";
import {
    ListDateTimePicker,
    ListSwitchItem,
    ListTextInputItem,
} from "../../../../Components/Controls/List";
import {ListDropDownListSinglePicker} from "../../../../Components/Controls/List/ListDropDownListSinglePicker";
import {ListEntityDropDownListPicker} from "../../../../Components/Controls/List/ListEntityDropDownListPicker";
import {StatusBadge} from "../StatusBadge";
import {StyleSheet, View} from 'react-native';
import {snakeToPascal} from "../../../../Helpers/StringUtils";
import React from "react";
import {ListItem} from "../../ListItem";

class EditorControlFactory {
    create(fieldDefinition: IEntityFieldDefinition, listItem: ListItem, readonly: boolean, updateFieldValue: (fieldName: string, value: unknown) => void): React.ReactElement {
        readonly = readonly || fieldDefinition.inputDisabled;
        const fieldName = fieldDefinition.fieldName;
        const fieldTitle = fieldDefinition.fieldTitle;
        const value = listItem.getFieldValue(fieldName);
        const fieldStatus = listItem.isFieldModified(fieldName) ? 'modified' : null;

        switch (fieldDefinition.fieldDataType) {
            case EntityFieldInputTypes.PASSWORD:
            case EntityFieldInputTypes.TEXT:
            case EntityFieldInputTypes.NUMBER:
            case EntityFieldInputTypes.EMAIL:
                return (
                    <View style={styles.listItemContainer}>
                        <ListTextInputItem
                            title={fieldTitle}
                            readonly={readonly}
                            value={value?.toString() ?? ''}
                            onValueChanged={(x) => updateFieldValue(fieldName, x)}
                            secureTextEntry={fieldDefinition.fieldDataType === EntityFieldInputTypes.PASSWORD}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeRight]} status={fieldStatus}/>
                    </View>
                );
            case EntityFieldInputTypes.CHECKBOX:
                return (
                    <View style={styles.listItemContainer}>
                        <ListSwitchItem
                            title={fieldTitle}
                            readonly={readonly}
                            value={value as boolean}
                            action={(x) => updateFieldValue(fieldName, x)}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeLeft]} status={fieldStatus}/>
                    </View>
                );
            case EntityFieldInputTypes.DATE:
            case EntityFieldInputTypes.TIME:
            case EntityFieldInputTypes.DATETIME:
                const mode = fieldDefinition.fieldDataType.toLowerCase() as 'date' | 'time' | 'datetime';
                return (
                    <View style={styles.listItemContainer}>
                        <ListDateTimePicker
                            title={fieldTitle}
                            mode={mode}
                            value={value?.toString()}
                            onChange={(x) => updateFieldValue(fieldName, x)}
                            readonly={readonly}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeLeft]} status={fieldStatus}/>
                    </View>
                );
            case EntityFieldInputTypes.SELECT:
                return (
                    <View style={styles.listItemContainer}>
                        <ListDropDownListSinglePicker
                            title={fieldTitle}
                            selectedItem={value as string}
                            items={Object.values(fieldDefinition.fieldEnumValues)}
                            readonly={readonly}
                            onChange={(value) => updateFieldValue(fieldName, value)}
                            titleFormatter={snakeToPascal}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeRight]} status={fieldStatus}/>
                    </View>
                );
            case EntityFieldInputTypes.MULTIPLE_SELECT:
            case EntityFieldInputTypes.SINGLE_SELECT:
                return (
                    <View style={styles.listItemContainer}>
                        <ListEntityDropDownListPicker
                            entityName={fieldDefinition.objectName}
                            title={fieldTitle}
                            readonly={readonly}
                            selectedData={value as IEntity | IEntity[]}
                            onChange={(value: unknown) => updateFieldValue(fieldName, value)}
                            multiple={fieldDefinition.fieldDataType === EntityFieldInputTypes.MULTIPLE_SELECT}
                            titleFormatter={fieldDefinition.searchPolicy === EntityFieldSearchPolicies.STATIC ? snakeToPascal : undefined}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeRight]} status={fieldStatus}/>
                    </View>
                );
            default:
                throw new Error(`Not supported field data type: ${fieldDefinition.fieldDataType}`);
        }
    }
}

const styles = StyleSheet.create({
    listItemContainer: {
        flex: 1,
    },
    statusBadge: {
        position: 'absolute',
        top: 0,
    },
    statusBadgeLeft: {
        left: 0,
    },
    statusBadgeRight: {
        right: 0,
    },
});

export const editorControlFactory = new EditorControlFactory();

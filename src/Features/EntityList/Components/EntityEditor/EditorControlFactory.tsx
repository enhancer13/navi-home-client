import {
    EntityFieldInputTypes,
    EntityFieldSearchPolicies,
    IEntity,
    IEntityFieldDefinition,
} from "../../../../BackendTypes";
import {
    ListDateTimePicker,
    ListNumericInputItem,
    ListSwitchItem,
    ListTextInputItem,
} from "../../../../Components/Controls/ListItems";
import {ListDropDownListSinglePicker} from "../../../../Components/Controls/ListItems/ListDropDownListSinglePicker";
import {ListEntityDropDownListPicker} from "../../../../Components/Controls/ListItems/ListEntityDropDownListPicker";
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
        const fieldDataType = fieldDefinition.fieldDataType;
        switch (fieldDataType) {
            case EntityFieldInputTypes.PASSWORD:
            case EntityFieldInputTypes.TEXT:
                return (
                    <View style={styles.listItemContainer}>
                        <ListTextInputItem
                            title={fieldTitle}
                            readonly={readonly}
                            value={value as string}
                            onValueChanged={(x) => updateFieldValue(fieldName, x)}
                            secureTextEntry={fieldDataType === EntityFieldInputTypes.PASSWORD}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeRight]} status={fieldStatus}/>
                    </View>
                );
            case EntityFieldInputTypes.EMAIL:
                return (
                    <View style={styles.listItemContainer}>
                        <ListTextInputItem
                            title={fieldTitle}
                            readonly={readonly}
                            value={value as string}
                            onValueChanged={(x) => updateFieldValue(fieldName, x)}
                            inputMode={"email"}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeRight]} status={fieldStatus}/>
                    </View>
                );
            case EntityFieldInputTypes.NUMBER: //TODO for legacy compatibility, remove after upgrade
            case EntityFieldInputTypes.INTEGER:
            case EntityFieldInputTypes.DECIMAL:
                return (
                    <View style={styles.listItemContainer}>
                        <ListNumericInputItem
                            title={fieldTitle}
                            readonly={readonly}
                            value={value as number}
                            onValueChanged={(x) => updateFieldValue(fieldName, x)}
                            inputMode={fieldDataType === EntityFieldInputTypes.INTEGER ? "numeric" : "decimal"}
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
            case EntityFieldInputTypes.DATETIME: {
                const mode = fieldDataType.toLowerCase() as 'date' | 'time' | 'datetime';
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
            }
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
                            multiple={fieldDataType === EntityFieldInputTypes.MULTIPLE_SELECT}
                            titleFormatter={fieldDefinition.searchPolicy === EntityFieldSearchPolicies.STATIC ? snakeToPascal : undefined}
                        />
                        <StatusBadge style={[styles.statusBadge, styles.statusBadgeRight]} status={fieldStatus}/>
                    </View>
                );
            default:
                throw new Error(`Not supported field data type: ${fieldDataType}, ${fieldName}`);
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

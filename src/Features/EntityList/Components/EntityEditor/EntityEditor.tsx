import React, {useCallback, useEffect, useState, useMemo, useRef} from 'react';
import {Animated, Modal, StyleSheet} from 'react-native';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {groupBy} from "lodash";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import SafeAreaView from "../../../../Components/Layout/SafeAreaView";
import {AnimatedSectionList, ISection} from "../../../../Components/Controls/List";
import {ListItem} from '../../ListItem';
import {splitPascalCase} from "../../../../Helpers/StringUtils";
import {EntityEditorHeader} from "./EntityEditorHeader";
import {editorControlFactory} from "./EditorControlFactory";
import {IEntityDefinition} from "../../../../Framework/Data/DataManager";
import {IEntityFieldDefinition} from "../../../../BackendTypes";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";

type EntityEditorProps = {
    visible: boolean;
    listItem: ListItem | null;
    entityDefinition: IEntityDefinition;
    onClose: () => void;
}

const TITLE_HEIGHT = hp(10);

export const EntityEditor: React.FC<EntityEditorProps> = ({
                                                              visible,
                                                              listItem: initialListItem,
                                                              entityDefinition,
                                                              onClose
                                                          }) => {
    const [itemChanged, setItemChanged] = useState<object>({});
    const [listItem, setListItem] = useState<ListItem | null>(null);
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (initialListItem) {
            setListItem(initialListItem.clone());
        }
    }, [initialListItem]);

    const updateFieldValue = useCallback((fieldName: string, value: unknown) => {
        if (!listItem) {
            throw new Error('Invalid EntityEditor state: list item is null');
        }

        listItem.setFieldValue(fieldName, value);
        setItemChanged({});
    }, [listItem]);

    const editorControlGroups = useMemo(() => {
        const fieldDefinitions = [...entityDefinition.objectFields];
        fieldDefinitions.sort((a, b) => a.rowGroup - b.rowGroup || a.fieldOrder - b.fieldOrder);
        return groupBy(fieldDefinitions, x => x.rowGroup);
    }, [entityDefinition]);

    const getSections: Array<ISection> = useMemo(() => {
        if (!listItem) {
            return [];
        }

        return Object.values(editorControlGroups).map((fieldDefinitions: IEntityFieldDefinition[]) => {
            const items = fieldDefinitions.map((fieldDefinition) =>
                editorControlFactory.create(fieldDefinition, listItem, !entityDefinition.databaseMethods.update, updateFieldValue));
            return {items};
        });
    }, [entityDefinition, editorControlGroups, listItem, itemChanged, updateFieldValue]);

    const onDone = useCallback(() => {
        if (!listItem || !initialListItem) {
            throw new Error('Invalid EntityEditor state: list item is null');
        }

        initialListItem.copyFrom(listItem)
        onClose();
    }, [initialListItem, listItem, onClose]);

    const sectionListTitle = splitPascalCase(entityDefinition.objectName);
    return (
        <Modal visible={visible} hardwareAccelerated >
            <SafeAreaProvider>
                <SafeAreaView style={styles.container} ignoreTopInsets={true} ignoreBottomInsets={false}>
                    <EntityEditorHeader
                        title={sectionListTitle}
                        onCancel={onClose}
                        onDone={onDone}
                        scrollY={scrollY}
                        scrollThreshold={TITLE_HEIGHT}/>
                    <AnimatedSectionList
                        titleHeight={TITLE_HEIGHT}
                        title={sectionListTitle}
                        sections={getSections}
                        />
                </SafeAreaView>
            </SafeAreaProvider>
        </Modal>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'stretch',
    },
});

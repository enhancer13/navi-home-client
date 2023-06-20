import React, {useCallback, useRef, useState} from "react";
import {IEntity} from "../../BackendTypes";
import {ListItem} from "./ListItem";
import {Animated, StyleSheet, View} from "react-native";
import EntityList from "./EntityList";
import {getDeviceTypeSync, isTablet} from "react-native-device-info";
import {useEntityDataManager} from "../../Components/Hooks/EntityDataManager/useEntityDataManager";
import {EntityEditor} from "./Components/EntityEditor/EntityEditor";
import {useEntityEditor} from "./Hooks/useEntityEditor";
import {StatusBadge} from "./Components/StatusBadge";
import {ParentEntityRestriction} from "./Hooks/useVolatileEntityCollection";
import {AppHeader} from "../../Components/Layout";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";

export interface EntityViewComponentProps {
    entity: IEntity;
    width: number;
}

declare type EntityListScreenProps = {
    entityName: string;
    EntityViewComponent: React.ComponentType<EntityViewComponentProps>;
    onItemPress?: (item: ListItem) => void;
    columnCount?: number;
    backButton?: boolean;
    enableSearch?: boolean;
    parentEntityRestriction?: ParentEntityRestriction;
}

declare type State = {
    itemsCount: number;
    selectionActive: boolean;
    selectedItemsCount: number;
}

const defaultState: State = {
    itemsCount: 0,
    selectionActive: false,
    selectedItemsCount: 0,
}

const tabletMode = (isTablet() || getDeviceTypeSync() === 'Desktop')
const defaultItemsPerPage = tabletMode ? 50 : 20;
const defaultColumnsCount = tabletMode ? 2 : 1;

export const EntityListScreen: React.FC<EntityListScreenProps> = ({
                                                                      entityName,
                                                                      EntityViewComponent,
                                                                      backButton,
                                                                      enableSearch = true,
                                                                      onItemPress,
                                                                      columnCount = defaultColumnsCount,
                                                                      parentEntityRestriction
                                                                  }) => {
    const [state, setState] = useState<State>(defaultState);
    const [queryFilter, setQueryFilter] = useState('');
    const {editorVisible, editorListItem, dataChanged, openEditor, closeEditor} = useEntityEditor();
    const entityDataManager = useEntityDataManager(entityName);
    const scrollY = useRef(new Animated.Value(0)).current;

    const onListItemPress = useCallback((listItem: ListItem) => {
        if (onItemPress) {
            onItemPress(listItem);
            return;
        }

        openEditor(listItem);
    }, [onItemPress, openEditor]);

    const renderEntityView = useCallback((listItem: ListItem, props: { width: number }): React.ReactElement => {
        const entity = listItem.getOriginalEntity();
        const status = listItem.isNew() ? 'new' : listItem.isModified() ? 'modified' : null;
        return (
            <>
                {/* eslint-disable-next-line react/prop-types */}
                <EntityViewComponent entity={entity} width={props.width}/>
                <StatusBadge style={styles.statusBadge} status={status}/>
            </>
        );
    }, [EntityViewComponent]);

    const handleItemsCountChanged = useCallback((count: number) => {
        setState(prevState => ({...prevState, itemsCount: count}));
    }, []);

    const handleSelectionStatusChanged = useCallback((active: boolean) => {
        setState(prevState => ({...prevState, selectionActive: active}));
    }, []);

    const handleSelectedItemsCountChanged = useCallback((count: number) => {
        setState(prevState => ({...prevState, selectedItemsCount: count}));
    }, []);

    const handleSearchQueryChange = useCallback((query: string) => {
        setQueryFilter(query);
    }, []);

    if (!entityDataManager) {
        return null;
    }

    const subtitle = state.selectionActive ? `Selected items: ${state.selectedItemsCount}/${state.itemsCount}` : `Number of items: ${state.itemsCount}`;

    return (
        <View style={styles.container}>
            <AppHeader enableBackButton={backButton} title={subtitle}
                       enableSearch={enableSearch}
                       onSearchQueryChange={handleSearchQueryChange}
                       scrollY={scrollY}/>
            <EntityEditor visible={editorVisible}
                          listItem={editorListItem}
                          onClose={closeEditor}
                          entityDefinition={entityDataManager.entityDefinition}/>
            <EntityList
                entityDataManager={entityDataManager}
                itemsPerPage={defaultItemsPerPage}
                parentEntityRestriction={parentEntityRestriction}
                renderItem={renderEntityView}
                columnCount={columnCount}
                queryFilter={queryFilter}
                onItemPress={onListItemPress}
                onSelectionStatusChanged={handleSelectionStatusChanged}
                onItemsCountChanged={handleItemsCountChanged}
                onSelectedItemsCountChanged={handleSelectedItemsCountChanged}
                extraData={dataChanged}
                onScroll={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
                    scrollY.setValue(event.nativeEvent.contentOffset.y);
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: 0,
    },
    statusBadge: {
        position: 'absolute',
        top: '5%',
        right: '5%',
    }
});

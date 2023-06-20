import React, {useCallback, useEffect, useRef, useState} from 'react';
import SelectableList from './Components/SelectableList/SelectableList';
import {ListItem} from './ListItem';
import {useActionsStatus} from "./Hooks/useActionsStatus";
import {EntityActionsBar} from "./Components/EntityActionsBar";
import {heightPercentageToDP as hp} from "react-native-responsive-screen";
import {IEntity} from "../../BackendTypes";
import {useEntityListData} from "./Hooks/useEntityListData";
import {IEntityDataManager} from "../../Framework/Data/DataManager/IEntityDataManager";
import {useEntityActions} from "./Hooks/useEntityActions";
import FlexContainer from "../../Components/Layout/FlexContainer";
import {ModalLoadingActivityIndicator} from "../../Components/Controls";
import {usePrimaryAction} from "./Hooks/usePrimaryAction";
import {ParentEntityRestriction} from "./Hooks/useVolatileEntityCollection";
import {useTheme} from "react-native-paper";
import {NativeSyntheticEvent} from "react-native/Libraries/Types/CoreEventTypes";
import {NativeScrollEvent} from "react-native/Libraries/Components/ScrollView/ScrollView";


declare type Props = {
    entityDataManager: IEntityDataManager<IEntity>;
    renderItem: (item: ListItem, props: { width: number }) => React.ReactNode;
    itemsPerPage: number;
    queryFilter?: string;
    onItemPress?: (item: ListItem) => void;
    onItemsCountChanged?: (count: number) => void;
    onSelectionStatusChanged?: (active: boolean) => void;
    onSelectedItemsCountChanged?: (count: number) => void;
    onInternalError?: (errorMessage: string) => void;
    columnCount?: number;
    parentEntityRestriction?: ParentEntityRestriction;
    extraData?: object;
    onScroll?: | ((event: NativeSyntheticEvent<NativeScrollEvent>) => void) | undefined;
}

const EntityList: React.FC<Props> = ({
                                         entityDataManager,
                                         renderItem,
                                         itemsPerPage,
                                         columnCount = 1,
                                         queryFilter,
                                         onItemPress,
                                         onSelectionStatusChanged,
                                         onSelectedItemsCountChanged,
                                         onItemsCountChanged,
                                         parentEntityRestriction,
                                         extraData,
                                         onScroll
                                     }) => {
    const [selectionActive, setSelectionActive] = useState(false);
    const [selectedItems, setSelectedItems] = useState<ListItem[]>([]);
    const selectableListRef = useRef<SelectableList<ListItem>>(null);
    const entityDefinition = entityDataManager.entityDefinition;

    const scrollPositionRef = useRef(0);
    const prevScrollPositionRef = useRef(0);

    const {
        loading,
        totalCount,
        items,
        setItems,
        fetchNextPage,
        refreshPages
    } = useEntityListData(entityDataManager, queryFilter, itemsPerPage, parentEntityRestriction);
    const {doSave, doCreate, doDelete, doCopy, doRevert} = useEntityActions(entityDataManager, selectedItems, setItems);
    const actionsStatus = useActionsStatus(items, selectedItems, entityDefinition);
    const [primaryLabel, onPrimary] = usePrimaryAction(actionsStatus, selectableListRef, items, doSave, doCreate);
    const theme = useTheme();

    useEffect(() => {
        onSelectionStatusChanged && onSelectionStatusChanged(selectionActive);
    }, [onSelectionStatusChanged, selectionActive]);

    useEffect(() => {
        onSelectedItemsCountChanged && onSelectedItemsCountChanged(selectedItems.length);
    }, [onSelectedItemsCountChanged, selectedItems]);

    useEffect(() => {
        onItemsCountChanged && onItemsCountChanged(totalCount);
    }, [onItemsCountChanged, totalCount]);

    useEffect(() => {
        setItems(prevItems => [...prevItems]);
    }, [extraData, setItems]);

    const onSelectionListItemPress = (item: ListItem) => {
        onItemPress && onItemPress(item);
    }

    const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
        scrollPositionRef.current = event.nativeEvent.contentOffset.y;
        onScroll && onScroll(event);
    }, [onScroll]);

    const handleEndReached = () => {
        if (scrollPositionRef.current === prevScrollPositionRef.current) {
            return;
        }
        fetchNextPage();
        prevScrollPositionRef.current = scrollPositionRef.current;
    };

    return (
        <FlexContainer>
            <ModalLoadingActivityIndicator visible={loading}/>
            <SelectableList
                ref={selectableListRef}
                keyExtractor={(listItem: ListItem) => listItem.getId()}
                renderItem={renderItem}
                items={items}
                refreshing={loading}
                columnCount={columnCount}
                onRefresh={refreshPages}
                onEndReached={handleEndReached}
                onPress={onSelectionListItemPress}
                onSelectionChanged={(listItems) => setSelectedItems(listItems)}
                onSelectionStarted={() => setSelectionActive(true)}
                onSelectionStopped={() => setSelectionActive(false)}
                theme={theme}
                onScroll={handleScroll}
            />
            <EntityActionsBar
                height={hp(4.5)}
                actionsStatus={actionsStatus}
                selectionActive={selectionActive}
                startSelection={() => selectableListRef.current?.startSelection()}
                stopSelection={() => selectableListRef.current?.stopSelection()}
                onCreate={doCreate}
                onSave={doSave}
                onCopy={doCopy}
                onDelete={doDelete}
                onRevert={doRevert}
                onDeselectAll={() => selectableListRef.current?.deselectAll()}
                onSelectAll={() => selectableListRef.current?.selectAll()}
                primaryLabel={primaryLabel}
                onPrimary={onPrimary}
            />
        </FlexContainer>
    );
}

export default EntityList;

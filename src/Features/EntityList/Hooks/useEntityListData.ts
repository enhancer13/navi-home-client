import {useEffect, useRef, useState} from 'react';
import {ListItem} from '../ListItem';
import {IEntity} from '../../../BackendTypes';
import {entityFactory, VolatileDataCollectionEventTypes} from '../../../Framework/Data/DataManager';
import {useDataCollectionLoadingState} from '../../../Components/Hooks/EntityDataManager/useDataCollectionLoadingState';
import {ParentEntityRestriction, useVolatileEntityCollection} from './useVolatileEntityCollection';
import {IEntityDataManager} from '../../../Framework/Data/DataManager/IEntityDataManager';
import {useAsyncError} from '../../ErrorBoundary/Hooks/useAsyncError';

export const useEntityListData = (entityDataManager: IEntityDataManager<IEntity>, filterQuery = '', itemsPerPage?: number, parentEntityRestriction?: ParentEntityRestriction) => {
    const volatileDataCollection = useVolatileEntityCollection(entityDataManager, filterQuery, itemsPerPage, parentEntityRestriction);
    const loading = useDataCollectionLoadingState(volatileDataCollection);
    const withAsyncThrow = useAsyncError();

    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const currentPageRef = useRef(1);
    currentPageRef.current = currentPage;

    const [items, setItems] = useState<ListItem[]>([]);
    const itemsRef = useRef<ListItem[]>([]);
    itemsRef.current = items;

    const entityDefinition = entityDataManager.entityDefinition;

    useEffect(() => {
        async function InitializeVolatileDataCollection() {
            if (!volatileDataCollection) {
                return;
            }
            volatileDataCollection.on(VolatileDataCollectionEventTypes.DataChanged, syncWithDataCollection);
            volatileDataCollection.on(VolatileDataCollectionEventTypes.Loaded, syncWithDataCollection);
            await syncWithDataCollection();
        }

        InitializeVolatileDataCollection();

        return () => {
            volatileDataCollection?.dispose();
        };
    }, [volatileDataCollection]);

    useEffect(() => {
        syncWithDataCollection();
    }, [currentPage]);

    useEffect(() => {
        setTotalCount(items.filter(x => x.isNew()).length + (volatileDataCollection?.count ?? 0));
    }, [items, volatileDataCollection?.count]);

    const syncWithDataCollection = async () => {
        if (!volatileDataCollection) {
            return;
        }

        const loadedListItems = [];
        for (let i = 1; i <= Math.min(currentPageRef.current, volatileDataCollection.totalPages); i++) {
            const page = await withAsyncThrow(async () => await volatileDataCollection.getPage(i));
            loadedListItems.push(...page.data.map(entity => new ListItem(entityDefinition, entity, entityFactory)));
        }
        const mergedListItems = mergeModifiedListItems(itemsRef.current, loadedListItems);
        setItems(prevItems => {
            const newListItems = prevItems.filter(x => x.isNew());
            return [...mergedListItems, ...newListItems];
        });
        setCurrentPage(prevPage => Math.min(volatileDataCollection.totalPages || 1, prevPage));
    };

    const mergeModifiedListItems = (existingListItems: ListItem[], loadedListItems: ListItem[]) => {
        existingListItems.filter(x => x.isModified()).forEach(modifiedListItem => {
            const loadedListItem = loadedListItems.find(x => x.equals(modifiedListItem));
            if (loadedListItem) {
                loadedListItem.updateWith(modifiedListItem);
            }
        });
        return loadedListItems;
    };

    const fetchNextPage = () => {
        if (!volatileDataCollection) {
            return;
        }
        setCurrentPage(prevPage => Math.min(volatileDataCollection.totalPages || 1, prevPage + 1));
    };

    const refreshPages = async () => {
        if (!volatileDataCollection) {
            return;
        }
        await withAsyncThrow(async () => await volatileDataCollection.refresh());
    };

    return {loading, totalCount, items, setItems, fetchNextPage, refreshPages};
};

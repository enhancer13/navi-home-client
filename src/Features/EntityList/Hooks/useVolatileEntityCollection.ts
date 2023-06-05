import {useEffect, useState} from "react";
import {IEntity} from "../../../BackendTypes";
import {IEntityDefinition, IFilterQuery, VolatileDataCollection,} from "../../../Framework/Data/DataManager";
import {IEntityDataManager} from "../../../Framework/Data/DataManager/IEntityDataManager";
import {useAsyncError} from "../../ErrorBoundary/Hooks/useAsyncError";

export type ParentEntityRestriction = {
    entity: IEntity;
    entityDefinition: IEntityDefinition;
}

export const useVolatileEntityCollection = <TEntity extends IEntity>(entityDataManager: IEntityDataManager<TEntity>, filterQuery = '', itemsPerPage?: number, parentEntityRestriction?: ParentEntityRestriction) => {
    const [volatileDataCollection, setVolatileDataCollection] = useState<VolatileDataCollection<TEntity> | null>(null);
    const withAsyncThrow = useAsyncError()

    useEffect(() => {
        let dataCollection: VolatileDataCollection<TEntity>;
        async function InitializeVolatileDataCollection() {
            dataCollection = new VolatileDataCollection(entityDataManager, getFilterQuery(), itemsPerPage);
            await withAsyncThrow(async () => await dataCollection.init());
            setVolatileDataCollection(dataCollection);
        }
        InitializeVolatileDataCollection();

        return () => {
            dataCollection?.dispose();
        }
    }, [entityDataManager]);

    useEffect(() => {
        const query = getFilterQuery();
        volatileDataCollection?.setFilterQuery(query);
    }, [filterQuery]);

    const getFilterQuery = () => {
        const query: IFilterQuery = {
            search: filterQuery,
        };

        if (parentEntityRestriction) {
            const {entity, entityDefinition} = parentEntityRestriction;
            const primarySearchFieldName = entityDefinition.getPrimarySearchFieldName();
            query.extraCondition = {
                [primarySearchFieldName]: entity[primarySearchFieldName] as string
            }
        }
        return query;
    };

    return volatileDataCollection;
}

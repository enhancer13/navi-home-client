import {IEntity} from '../../../BackendTypes';
import {IEntityDataManager} from '../../../Framework/Data/DataManager/IEntityDataManager';
import {useAuth} from '../../../Features/Authentication';
import {useEffect, useState} from 'react';
import {entityDataManagerFactory} from '../../../Framework/Data/DataManager';

export function useEntityDataManager<TEntity extends IEntity>(entityName: string): IEntityDataManager<TEntity> | null | undefined {
    const [entityDataManager, setEntityDataManager] = useState<IEntityDataManager<TEntity> | null>();
    const {authentication} = useAuth();

    useEffect(() => {
        async function InitializeDataManager() {
            if (!authentication) {
                return;
            }
            const dataManager = await entityDataManagerFactory.getDataManager<TEntity>(entityName, authentication);
            setEntityDataManager(dataManager);
        }

        InitializeDataManager();
    }, [entityName, authentication]);

    return entityDataManager;
}

import { useState, useEffect } from 'react';
import {ListItem} from '../ListItem';
import {IEntityDefinition} from '../../../Framework/Data/DataManager';
import {ActionsStatus} from '../Components/EntityActionsBar';

export const useActionsStatus = (items: ListItem[], selectedItems: ListItem[], entityDefinition: IEntityDefinition | undefined) => {
    const [actionsStatus, setActionsStatus] = useState<ActionsStatus>({
        canCreate: false,
        canSave: false,
        canUpdate: false,
        canSelect: false,
        canDelete: false,
        canRevert: false,
        canCopy: false,
        canSelectAll: false,
        canDeselectAll: false,
    });

    useEffect(() => {
        if (entityDefinition) {
            const hasSelectedItems = selectedItems.length > 0;
            const allItemsAreModified = selectedItems.every(x => x.isModified()) && hasSelectedItems;
            const allItemsAreNew = selectedItems.every(x => x.isNew()) && hasSelectedItems;
            const allItemsAreNewOrModified = selectedItems.every(x => x.isNew() || x.isModified()) && hasSelectedItems;
            const databaseMethods = entityDefinition.databaseMethods;

            const canSave = (databaseMethods.update && databaseMethods.create && allItemsAreNewOrModified) ||
                (databaseMethods.update && allItemsAreModified) ||
                (databaseMethods.create && allItemsAreNew);

            setActionsStatus({
                canCreate: databaseMethods.create,
                canUpdate: databaseMethods.update,
                canSave: canSave,
                canSelect: databaseMethods.get,
                canDelete: hasSelectedItems && databaseMethods.delete,
                canRevert: allItemsAreModified,
                canCopy: hasSelectedItems && databaseMethods.create,
                canSelectAll: true,
                canDeselectAll: hasSelectedItems,
            });
        }
    }, [items, selectedItems, entityDefinition]);

    return actionsStatus;
};

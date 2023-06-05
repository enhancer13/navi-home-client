import {ListItem} from "../ListItem";
import {IEntityDataManager} from "../../../Framework/Data/DataManager/IEntityDataManager";
import {IEntity} from "../../../BackendTypes";
import React from "react";
import {usePopupMessage} from "../../Messaging";
import {entityFactory} from "../../../Framework/Data/DataManager";

export const useEntityActions = (entityDataManager: IEntityDataManager<IEntity>, selectedItems: ListItem[], setItems: React.Dispatch<React.SetStateAction<ListItem[]>>) => {
    const {showSuccess, showError} = usePopupMessage();

    const doCreate = () => {
        const entityDefinition = entityDataManager.entityDefinition;
        const entity = entityFactory.create(entityDefinition);
        const newItem = new ListItem(entityDefinition, entity, entityFactory);

        setItems(prevItems => {
            const items = [...prevItems];
            items.push(newItem);
            return items;
        });
    };

    const doCopy = () => {
        const copiedItems = selectedItems.map(item => item.copy());
        setItems(prevItems => [...prevItems].concat(copiedItems));
    };

    const doRevert = () => {
        setItems(prevItems => {
            selectedItems.forEach(item => item.undoPendingChanges());
            return prevItems.filter((item) => !(item.isNew() && selectedItems.some((selectedItem) => selectedItem.equals(item))))
        })
    };

    const doSave = async (items?: ListItem[]) => {
        await InsertNewItems(items);

        await UpdateModifiedItems(items);
    };

    async function InsertNewItems(items?: ListItem[]) {
        items = items ?? selectedItems;
        const newListItems = items.filter(entity => entity.isNew());
        const newEntities = newListItems.map(x => x.getEntity());

        if (newEntities.length == 0) {
            return;
        }

        try {
            await entityDataManager.insert(newEntities);
            setItems(prevItems => prevItems.filter(x => !newListItems.includes(x)));
            showSuccess(`Successfully created ${newEntities.length} item(s).`);
        } catch (ex: any) {
            showError(`Unable to create new item(s). ${ex.message}`);
        }
    }

    async function UpdateModifiedItems(items?: ListItem[]) {
        items = items ?? selectedItems;
        const modifiedListItems = items.filter(entity => entity.isModified());
        const modifiedFieldNames = modifiedListItems.map(x => x.getModifiedFieldNames());
        const modifiedEntities = modifiedListItems.map(x => x.getEntity());

        if (modifiedEntities.length == 0) {
            return;
        }

        try {
            await entityDataManager.update(modifiedEntities, modifiedFieldNames);
            showSuccess(`Successfully updated ${modifiedEntities.length} item(s).`);
        } catch (ex: any) {
            showError(`Unable to update item(s). ${ex.message}`);
        }
    }

    const doDelete = async () => {
        //not persisted in DB, so just remove from the state
        setItems(prevItems => prevItems.filter(x => !(x.isNew() && selectedItems.includes(x))));
        const itemsToDelete = selectedItems.filter(entity => !entity.isNew());

        if (itemsToDelete.length == 0) {
            return;
        }

        try {
            await entityDataManager.delete(itemsToDelete.map(x => x.getEntity()));
            setItems(prevItems => prevItems.filter(x => !itemsToDelete.includes(x)));
            showSuccess(`Successfully deleted ${itemsToDelete.length} item(s).`);
        } catch (ex: any) {
            showError(`Unable to delete item(s). ${ex.message}`);
        }
    };

    return {doSave, doDelete, doCopy, doCreate, doRevert};
}

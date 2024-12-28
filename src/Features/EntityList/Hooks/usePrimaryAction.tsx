import {ActionsStatus} from '../Components/EntityActionsBar';
import React, {useMemo} from 'react';
import SelectableList from '../Components/SelectableList/SelectableList';
import {ListItem} from '../ListItem';

export const usePrimaryAction = (actionsStatus: ActionsStatus, selectableListRef: React.RefObject<SelectableList<ListItem>>, items: ListItem[], doSave: (items?: ListItem[]) => Promise<void>, doCreate: () => void)
    : [string, (() => void)] => {

    return useMemo(() => {
        const newOrModifiedItems = items.filter(x => x.isModified() || x.isNew());
        if ((actionsStatus.canUpdate || actionsStatus.canCreate) && newOrModifiedItems.length > 0) {
            return ['Save', () => doSave(newOrModifiedItems)];
        }

        if (actionsStatus.canCreate) {
            return ['Create', doCreate];
        }

        return ['Select', () => selectableListRef.current?.selectAll()];
    }, [actionsStatus, selectableListRef, items, doSave, doCreate]);
};

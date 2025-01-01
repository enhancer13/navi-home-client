import {useEffect, useState} from 'react';
import {ListItem} from '../ListItem';

export const useEntityEditor = () => {
    const [visible, setVisible] = useState(false);
    const [currentListItem, setCurrentListItem] = useState<ListItem | null>(null);
    const [dataChanged, setDataChanged] = useState<object>({});

    const openEditor = (listItem: ListItem) => {
        setCurrentListItem(listItem);
    };

    const closeEditor = () => {
        setDataChanged({});
        setCurrentListItem(null);
    };

    useEffect(() => {
        setVisible(currentListItem !== null);
    }, [currentListItem]);


    return {editorVisible: visible, editorListItem: currentListItem, dataChanged, openEditor, closeEditor};
};

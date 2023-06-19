import {useEffect, useRef} from 'react';
import IDataStorage from "../../../Framework/Data/DataStorage/IDataStorage";
import {IStorageItem, DataStorageEventTypes} from "../../../Framework/Data/DataStorage";

export function useDataStorage<TStorage extends IDataStorage<IStorageItem>>(storageFactory: () => TStorage) {
    const storage = useRef<TStorage>(storageFactory()).current;
    const eventHandlers = useRef<Map<DataStorageEventTypes, ((args?: any) => void)[]>>(new Map()).current;

    const subscribe = (event: DataStorageEventTypes, listener: (args?: any) => void) => {
        if (!eventHandlers.has(event)) {
            eventHandlers.set(event, []);
        }

        eventHandlers.get(event)?.push(listener);
        storage.on(event, listener);
    };

    const unsubscribe = (event: DataStorageEventTypes, listener: (args?: any) => void) => {
        if (!eventHandlers.has(event)) {
            return;
        }

        const handlers = eventHandlers.get(event);
        const index = handlers?.indexOf(listener);

        if (index !== undefined && index !== -1) {
            handlers?.splice(index, 1);
            storage.off(event, listener);
        }
    };

    useEffect(() => {
        return () => {
            for (const [event, listeners] of eventHandlers) {
                listeners.forEach(listener => storage.off(event, listener));
            }

            eventHandlers.clear();
        };
    }, []);

    return { storage, subscribe, unsubscribe };
}

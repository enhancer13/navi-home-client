import {useEffect, useRef} from "react";
import {DataStorageEventTypes, IStorageItem} from "../../../Framework/Data/DataStorage";
import IDataStorage from "../../../Framework/Data/DataStorage/IDataStorage";

export function useDataStorageEvents<TStorage extends IDataStorage<IStorageItem>>(dataStorage: TStorage) {
    const eventHandlers = useRef<Map<DataStorageEventTypes, ((args?: any) => void)[]>>(new Map()).current;

    const subscribe = (events: DataStorageEventTypes | DataStorageEventTypes[], listener: (args?: any) => void) => {
        const eventsArray = Array.isArray(events) ? events : [events];
        eventsArray.forEach(event => {
            const handlers = eventHandlers.get(event) || [];
            if (handlers.includes(listener)) {
                return;
            }

            handlers.push(listener);
            eventHandlers.set(event, handlers);
            dataStorage.on(event, listener);
        });
    };

    const unsubscribe = (events: DataStorageEventTypes | DataStorageEventTypes[], listener: (args?: any) => void) => {
        const eventsArray = Array.isArray(events) ? events : [events];
        eventsArray.forEach(event => {
            if (!eventHandlers.has(event)) {
                return;
            }

            const handlers = eventHandlers.get(event);
            const index = handlers?.indexOf(listener);

            if (index !== undefined && index !== -1) {
                handlers?.splice(index, 1);
                dataStorage.off(event, listener);
            }
        });
    };

    useEffect(() => {
        return () => {
            for (const [event, listeners] of eventHandlers) {
                listeners.forEach(listener => dataStorage.off(event, listener));
            }

            eventHandlers.clear();
        };
    }, []);

    return { subscribe, unsubscribe };
}

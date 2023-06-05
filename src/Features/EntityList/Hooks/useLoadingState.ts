import {VolatileDataCollection, VolatileDataCollectionEventTypes} from "../../../Framework/Data/DataManager";
import {IEntity} from "../../../BackendTypes";
import {useEffect, useState} from "react";

export const useLoadingState = (volatileDataCollection: VolatileDataCollection<IEntity> | null) => {
    const [loading, setLoading] = useState(false);
    const [internalLoading, setInternalLoading] = useState(false);

    useEffect(() => {
        if (volatileDataCollection) {
            volatileDataCollection.on(VolatileDataCollectionEventTypes.Loading, () => setInternalLoading(true));
            volatileDataCollection.on(VolatileDataCollectionEventTypes.Loaded, () => setInternalLoading(false));
            volatileDataCollection.on(VolatileDataCollectionEventTypes.InternalError, () => setInternalLoading(false));
        }
    }, [volatileDataCollection]);

    useEffect(() => {
        if (internalLoading) {
            const timer = setTimeout(() => setLoading(true), 1000);
            return () => clearTimeout(timer);
        }

        setLoading(false);
    }, [internalLoading]);

    return loading;
};

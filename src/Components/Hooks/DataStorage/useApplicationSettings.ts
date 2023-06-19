import { useEffect, useState } from "react";
import { ApplicationSettings, applicationSettingsStorage } from "../../../Features/LocalStorage";
import {DataStorageEventTypes} from "../../../Framework/Data/DataStorage";
import {useDataStorage} from "./useDataStorage";

export function useApplicationSettings(): ApplicationSettings | null {
    const { storage, subscribe } = useDataStorage(() => applicationSettingsStorage);
    const [applicationSettings, setApplicationSettings] = useState<ApplicationSettings | null>(null);

    useEffect(() => {
        const readApplicationSettings = async () => {
            const settings = await storage.getApplicationSettings();
            setApplicationSettings(settings);
        };

        readApplicationSettings();

        subscribe(DataStorageEventTypes.DataChanged, readApplicationSettings);
        subscribe(DataStorageEventTypes.DataCreated, readApplicationSettings);
    }, []);

    return applicationSettings;
}

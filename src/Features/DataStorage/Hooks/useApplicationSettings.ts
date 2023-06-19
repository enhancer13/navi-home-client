import { useEffect, useState } from "react";
import { ApplicationSettings, applicationSettingsStorage } from "../index";
import {DataStorageEventTypes} from "../../../Framework/Data/DataStorage";
import {useDataStorageEvents} from "./useDataStorageEvents";

export function useApplicationSettings() {
    const { subscribe } = useDataStorageEvents(applicationSettingsStorage);
    const [applicationSettings, setApplicationSettings] = useState<ApplicationSettings | null>(null);

    useEffect(() => {
        const readApplicationSettings = async () => {
            const settings = await applicationSettingsStorage.getApplicationSettings();
            setApplicationSettings(settings);
        };

        readApplicationSettings();

        subscribe(DataStorageEventTypes.DataChanged, readApplicationSettings);
        subscribe(DataStorageEventTypes.DataCreated, readApplicationSettings);
    }, []);

    const updateApplicationSettings = async (applicationSetting: ApplicationSettings) => {
        await applicationSettingsStorage.update(applicationSetting)
    }

    return {applicationSettings, updateApplicationSettings};
}

import {EntityEditorEventTypes} from "./EntityEditorEventTypes";

export interface IEntityEditedEvent {
    entityName: string;

    entityIds: number[];

    eventType: EntityEditorEventTypes;
}

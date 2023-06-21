import cloneDeep from 'lodash/cloneDeep';
import {IEntity} from "../../BackendTypes";
import {ListItemField} from "./ListItemField";
import {IEntityFactory, IEntityDefinition} from "../../Framework/Data/DataManager";

export class ListItem {
    private readonly _originalEntity: IEntity;
    private _entity: IEntity;
    private readonly _entityDefinition: IEntityDefinition;
    private readonly _entityFactory: IEntityFactory;
    private _fields: ListItemField[];

    public constructor(entityDefinition: IEntityDefinition, entity: IEntity, entityFactory: IEntityFactory) {
        this._entityDefinition = entityDefinition;
        this._originalEntity = entity;
        this._entity = cloneDeep(entity);
        this._entityFactory = entityFactory;
        this._fields = Object.keys(entity).map((key) => new ListItemField(key, entity[key]));
    }

    public getId(): string {
        return this._entity.id.toString();
    }

    public getEntity(): IEntity {
        return this._entity;
    }

    public getOriginalEntity(): IEntity {
        return this._originalEntity;
    }

    public static create(entityDefinition: IEntityDefinition, entityFactory: IEntityFactory) {
        const entity = entityFactory.create(entityDefinition);
        return new ListItem(entityDefinition, entity, entityFactory);
    }

    public copy(): ListItem {
        const clonedEntity = cloneDeep(this._entity);
        clonedEntity.id = this._entityFactory.getNextId(this._entityDefinition.objectName);
        const searchFieldName = this._entityDefinition.getPrimarySearchFieldName();
        clonedEntity[searchFieldName] = `copy of "${clonedEntity[searchFieldName]}"`;
        return new ListItem(this._entityDefinition, clonedEntity, this._entityFactory);
    }

    public copyFrom(listItem: ListItem): void {
        listItem._fields.forEach((field) => {
            this.setFieldValue(field.fieldName, listItem.getFieldValue(field.fieldName));
        });
    }

    public updateWith(listItem: ListItem): void {
        listItem.getModifiedFieldNames().forEach((fieldName) => {
            this.setFieldValue(fieldName, listItem.getFieldValue(fieldName));
        });
    }

    public isModified(): boolean {
        return !this.isNew() && this._fields.some((x) => x.isValueModified());
    }

    public isNew(): boolean {
        return this._originalEntity.id <= 0;
    }

    public undoPendingChanges() {
        this._entity = cloneDeep(this._originalEntity);
        this._fields.forEach(x => x.undoPendingChanges());
    }

    public getFieldValue(fieldName: string): unknown {
        return this._listItemField(fieldName).currentValue;
    }

    public setFieldValue(fieldName: string, value: unknown) {
        this._listItemField(fieldName).setValue(value);
        this._entity[fieldName] = value;
    }

    public isFieldModified(fieldName: string): boolean {
        return !this.isNew() && this._listItemField(fieldName).isValueModified();
    }

    public getModifiedFieldNames(): string[] {
        return this._fields.filter((x) => x.isValueModified()).map((x) => x.fieldName);
    }

    public equals(listItem: ListItem): boolean {
        return this._originalEntity.id === listItem.getEntity().id;
    }

    public clone(): ListItem {
        return cloneDeep(this);
    }

    private _listItemField(fieldName: string): ListItemField {
        const listItemField = this._fields.find((x) => x.fieldName === fieldName);
        if (!listItemField) {
            throw new Error(`Field ${fieldName} not found in the list item ${this._entityDefinition.objectName}`);
        }
        return listItemField;
    }
}

import {IEntity} from "../../BackendTypes";
import {cloneDeep, isEqual, sortBy} from "lodash";

export class ListItemField {
    private readonly _fieldName: string;
    private readonly _originalValue: unknown;
    private _currentValue: unknown;

    constructor(fieldName: string, initialValue: unknown) {
        this._fieldName = fieldName;
        this._originalValue = initialValue;
        this._currentValue = cloneDeep(initialValue);
    }

    public get fieldName(): string {
        return this._fieldName;
    }

    public get originalValue(): unknown {
        return this._originalValue;
    }

    public get currentValue(): unknown {
        return this._currentValue;
    }

    public setValue(value: unknown) {
        if (value !== null && this._currentValue !== null && typeof value !== typeof this._currentValue) {
            throw new Error(`Cannot set value of type ${typeof value} to field ${this._fieldName} of type ${typeof this._currentValue}`);
        }
        this._currentValue = value;
    }

    public isValueModified(): boolean {
        if (this._currentValue === null || this._originalValue === null) {
            return this._currentValue !== this._originalValue;
        }

        if (Array.isArray(this._currentValue) && Array.isArray(this._originalValue)) {
            return !this.compareArrays(this._currentValue, this._originalValue);
        }

        if (typeof this._originalValue === 'object' && 'id' in this._originalValue) {
            return (this._currentValue as IEntity).id !== (this._originalValue as IEntity).id;
        }

        return !isEqual(this._currentValue, this._originalValue);
    }

    public undoPendingChanges() {
        this._currentValue = this._originalValue;
    }

    private compareArrays(array1: unknown[], array2: unknown[]): boolean {
        if (array1.length !== array2.length) {
            return false;
        }

        if (array1.length === 0) {
            return true;
        }

        const firstElement = array1[0];
        const isEntityArray = typeof firstElement === 'object' && 'id' in (firstElement as Record<string, unknown>);

        if (isEntityArray) {
            const ids1 = sortBy(array1.map((item) => (item as IEntity).id));
            const ids2 = sortBy(array2.map((item) => (item as IEntity).id));
            return isEqual(ids1, ids2);
        } else {
            return isEqual(sortBy(array1), sortBy(array2));
        }
    }
}

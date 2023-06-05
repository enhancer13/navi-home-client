export class Page<T> {
    private readonly _data: T[];
    private readonly _pageNumber: number;

    constructor(data: T[], pageNumber: number) {
        this._data = data;
        this._pageNumber = pageNumber;
    }

    public get data(): T[] {
        return this._data;
    }

    public get pageNumber(): number {
        return this._pageNumber;
    }
}

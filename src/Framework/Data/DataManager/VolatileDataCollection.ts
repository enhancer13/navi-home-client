import {IEntityDataManager} from "./IEntityDataManager";
import {EntityEditorEventTypes, IEntity, IEntityEditedEvent} from "../../../BackendTypes";
import {IFilterQuery} from "./EntityDataManager";
import {EventRegister} from "react-native-event-listeners";
import {EventEmitter} from 'events';
import {Page} from "./Page";

export enum VolatileDataCollectionEventTypes {
    DataChanged = 'dataChanged',
    Loading = 'loading',
    Loaded = 'loaded',
    InternalError = 'internalError'
}

export class VolatileDataCollection<TEntity extends IEntity> implements AsyncIterableIterator<TEntity> {
    private readonly _entityDataManager: IEntityDataManager<TEntity>;
    private readonly _pages: Page<TEntity>[];
    private readonly _loadedPageNumbers: Set<number>;
    private readonly _pageSize: number;

    private _filterQuery?: IFilterQuery;
    private _count: number;
    private _totalPages: number;
    private _firebaseMessageListener: any;
    private _eventEmitter: EventEmitter;

    private _cursor = 0;

    constructor(entityDataManager: IEntityDataManager<TEntity>, filterQuery?: IFilterQuery, pageSize = 30) {
        this._pages = [];
        this._entityDataManager = entityDataManager;
        this._eventEmitter = new EventEmitter();

        if (filterQuery) {
            this._filterQuery = filterQuery;
        }

        this._loadedPageNumbers = new Set<number>();
        this._pageSize = pageSize;
        this._count = 0;
        this._totalPages = 0;
    }

    public async get(index: number): Promise<TEntity> {
        const pageNumber = Math.floor(index / this._pageSize) + 1;
        if (!this.isPageLoaded(pageNumber)) {
            await this.loadPages(pageNumber);
        }
        return this._pages[pageNumber - 1].data[index % this._pageSize];
    }

    public async getPage(pageNumber: number): Promise<Page<TEntity>> {
        if (!this.isPageLoaded(pageNumber)) {
            await this.loadPages(pageNumber);
        }
        return this._pages[pageNumber - 1];
    }

    public get count(): number {
        return this._count;
    }

    public async refresh(): Promise<void> {
        console.debug(`VolatileDataCollection: Refreshing volatile data collection for entity ${this._entityDataManager.entityDefinition.objectName}...`);
        const loadedPages = Array.from(this._loadedPageNumbers);
        this._loadedPageNumbers.clear();
        await this.loadPages(...loadedPages);
    }

    public async init(): Promise<void> {
        await this.loadPages(1);
        this._firebaseMessageListener = EventRegister.addEventListener('entityEditor', (event) => this.handleEntityEditorEvent(event));
    }

    public setFilterQuery(filterQuery: IFilterQuery): void {
        this._filterQuery = filterQuery;
        this.refresh();
    }

    public on(event: VolatileDataCollectionEventTypes, listener: (args?: any) => void) {
        console.debug(`VolatileDataCollection: Adding listener for event ${event}`);
        this._eventEmitter.addListener(event, listener);
    }

    public dispose(): void {
        console.debug(`VolatileDataCollection: Disposing volatile data collection for entity ${this._entityDataManager.entityDefinition.objectName}...`);
        if (typeof this._firebaseMessageListener === "string") {
            EventRegister.removeEventListener(this._firebaseMessageListener);
        }
        this._eventEmitter.removeAllListeners();

        this._pages.length = 0;
        this._loadedPageNumbers.clear();
        this._count = 0;
        this._totalPages = 0;
    }

    public get totalPages(): number {
        return this._totalPages;
    }

    private async loadPages(...pageNumbers: number[]): Promise<void> {
        let loadingStarted = false;
        for (const pageNumber of pageNumbers) {
            if (this.isPageLoaded(pageNumber)) {
                continue;
            }
            console.debug(`VolatileDataCollection: Page ${pageNumber} is not loaded, loading...`);

            if (!loadingStarted) {
                loadingStarted = true;
                this._eventEmitter.emit(VolatileDataCollectionEventTypes.Loading);
            }

            const pageQuery = {
                page: pageNumber,
                size: this._pageSize
            };

            let loadedPage;
            try {
                loadedPage = await this._entityDataManager.get(pageQuery, this._filterQuery);
            } catch (error) {
                console.error(`VolatileDataCollection: Error while loading page ${pageNumber}: ${error}`);
                this._eventEmitter.emit(VolatileDataCollectionEventTypes.InternalError, error);
                throw error;
            }

            this._count = loadedPage.total_elements;
            this._totalPages = loadedPage.last_page;
            this._pages.length = this._totalPages;

            this._pages[loadedPage.current_page - 1] = new Page(loadedPage.data as TEntity[], loadedPage.current_page);
            console.debug(`VolatileDataCollection: Loaded page ${pageNumber} of ${this._totalPages} (${loadedPage.current_elements} elements)`);
            this._loadedPageNumbers.add(pageNumber);
        }

        if (loadingStarted) {
            this._eventEmitter.emit(VolatileDataCollectionEventTypes.Loaded);
        }
    }

    private isPageLoaded(page: number): boolean {
        return this._loadedPageNumbers.has(page);
    }

    private async handleEntityEditorEvent(entityEditorEvent: IEntityEditedEvent) {
        const entityName = this._entityDataManager.entityDefinition.objectName.toLowerCase();
        console.debug(`${entityName} - ${entityEditorEvent.entityName}`)
        if (entityEditorEvent.entityName !== entityName) {
            return;
        }

        console.debug(`VolatileDataCollection: received entityEditor event for ${entityName} with eventType ${entityEditorEvent.eventType} and id's ${entityEditorEvent.entityIds}`)
        switch (entityEditorEvent.eventType) {
            case EntityEditorEventTypes.CREATED:
            case EntityEditorEventTypes.DELETED: {
                // Reload all loaded pages
                await this.refresh();
                break;
            }
            case EntityEditorEventTypes.UPDATED: {
                // define first affected page from the list of loaded pages
                let firstAffectedPage = this._totalPages + 1;
                const affectedIds = entityEditorEvent.entityIds;
                for (const pageNumber of Array.from(this._loadedPageNumbers).sort((a, b) => a - b)) {
                    const affectedEntity = this._pages[pageNumber - 1].data.find(entity => affectedIds.includes(entity.id));
                    if (affectedEntity && pageNumber < firstAffectedPage) {
                        firstAffectedPage = pageNumber;
                    }
                }

                const pageNumbersToReload = Array.from(this._loadedPageNumbers).filter(pageNumber => pageNumber >= firstAffectedPage);
                if (pageNumbersToReload.length === 0) {
                    return;
                }
                pageNumbersToReload.forEach(pageNumber => this._loadedPageNumbers.delete(pageNumber));
                await this.loadPages(...pageNumbersToReload);
                break;
            }
        }
        this._eventEmitter.emit(VolatileDataCollectionEventTypes.DataChanged);
    }

    [Symbol.asyncIterator](): AsyncIterableIterator<TEntity> {
        return this;
    }

    async next(): Promise<IteratorResult<TEntity>> {
        if (this._cursor < this._count) {
            return { done: false, value: await this.get(this._cursor++) };
        } else {
            return { done: true, value: null };
        }
    }
}

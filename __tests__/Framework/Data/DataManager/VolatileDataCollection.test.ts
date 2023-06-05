// noinspection DuplicatedCode

import {IEntityDataManager} from "../../../../src/Framework/Data/DataManager/IEntityDataManager";
import {EntityEditorEventTypes, IEntity, IEntityEditedEvent} from "../../../../src/BackendTypes";
import {
    IEntityDefinition,
    VolatileDataCollection,
    VolatileDataCollectionEventTypes
} from "../../../../src/Framework/Data/DataManager";
import {anything, deepEqual, instance, mock, resetCalls, verify, when} from "ts-mockito";
import {EventRegister} from "react-native-event-listeners";
import {assertTrueAtLeast, tryVerify, waitUntil} from "../../../../src/TestUtils/test-utils";

describe('VolatileDataCollection', () => {
    let entityDataManagerMock: IEntityDataManager<IEntity>;

    beforeEach(() => {
       EventRegister.removeAllListeners();
        entityDataManagerMock = mock<IEntityDataManager<IEntity>>();
    });

    afterEach(() => {
        EventRegister.removeAllListeners();
    });

    describe('constructor', () => {
        test('initial collection size is zero', () => {
            const collection = new VolatileDataCollection(instance(entityDataManagerMock));
            expect(collection.count).toBe(0);
        });
    });

    describe('init', () => {
        test('should load the first page', async () => {
            // Arrange
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock));
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 1,
                    total_elements: 0,
                    current_page: 1,
                    elements_per_page: 2
                });

            // Act
            await volatileDataCollection.init();

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: 30}), anything())).once();
        });

        test('should have first page as loaded even in case of empty data', async () => {
            // Arrange
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock));
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 1,
                    total_elements: 0,
                    current_page: 1,
                    elements_per_page: 2
                });

            // Act
            await volatileDataCollection.init();

            // Assert
            expect(volatileDataCollection["_loadedPageNumbers"]).toContain(1);
        });

        test('should load the first page with the given size', async () => {
            // Arrange
            const pageSize = 45;
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, pageSize);
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 1,
                    total_elements: 0,
                    current_page: 1,
                    elements_per_page: 45
                });

            // Act
            await volatileDataCollection.init();

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: pageSize}), anything())).once();
        });

        test('should load the first page with the specified filter', async () => {
            // Arrange
            const filterQuery = {
                sort: 'desc',
                search: 'SearchFieldValue',
                equal: true,
                extraCondition: {'id': '102'}
            };
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), filterQuery);
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 1,
                    total_elements: 0,
                    current_page: 1,
                    elements_per_page: 2
                });

            // Act
            await volatileDataCollection.init();

            // Assert
            verify(entityDataManagerMock.get(anything(), filterQuery)).once();
        });

        test('should initialize the collection size within page total elements count', async () => {
            // Arrange
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock));
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const totalElements = 100;
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 50,
                    total_elements: totalElements,
                    current_page: 1,
                    elements_per_page: 2
                });

            // Act
            await volatileDataCollection.init();

            // Assert
            expect(volatileDataCollection.count).toBe(totalElements);
        });
    });

    describe('get', () => {
        test("should throw an error when trying to retrieve an element from an empty collection", async () => {
            const collection = new VolatileDataCollection(instance(entityDataManagerMock));
            await expect(collection.get(0)).rejects.toThrowError();
        });

        test("should retrieve an element without additional fetch when the element is within a loaded page)", async () => {
            //Arrange
            const testData = [
                {id: 1},
                {id: 2}
            ];
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testData,
                    current_elements: testData.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 1,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();
            resetCalls(entityDataManagerMock);

            //Act
            const result = await volatileDataCollection.get(1);

            //Assert
            expect(result).toEqual(testData[1]);
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).never();
        });

        test("should fetch an element using the data manager when the element is within an unloaded page", async () => {
            //Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage2 = [
                {id: 3},
                {id: 4}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 1,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage2,
                    current_elements: testDataPage2.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 2,
                    elements_per_page: 2
                });

            const collection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await collection.init();

            //Act
            const result = await collection.get(3);

            //Assert
            expect(result).toEqual(testDataPage2[1]);
            verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything())).once();
        });

        test("should fetch an element using the data manager and specified filter when the element is within an unloaded page", async () => {
            //Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage2 = [
                {id: 3},
                {id: 4}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 1,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage2,
                    current_elements: testDataPage2.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 2,
                    elements_per_page: 2
                });

            const filterQuery = {
                sort: 'desc',
                search: 'SearchFieldValue',
                equal: true,
                extraCondition: {'id': '102'}
            };
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), filterQuery, 2);
            await volatileDataCollection.init();

            //Act
            await volatileDataCollection.get(3);

            //Assert
            verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), filterQuery)).once();
        });

        test("should update count when fetching element within an unloaded page and number of total number elements was changed after initialization", async () => {
            //Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage2 = [
                {id: 3},
                {id: 4}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 1,
                    elements_per_page: 2
                });

            const newNumberOfTotalElements = 6;
            when(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage2,
                    current_elements: testDataPage2.length,
                    last_page: 3,
                    total_elements: newNumberOfTotalElements,
                    current_page: 2,
                    elements_per_page: 2
                });

            const filterQuery = {
                sort: 'desc',
                search: 'SearchFieldValue',
                equal: true,
                extraCondition: {'id': '102'}
            };
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), filterQuery, 2);
            await volatileDataCollection.init();

            //Act
            await volatileDataCollection.get(3);

            //Assert
            expect(volatileDataCollection.count).toBe(newNumberOfTotalElements);
        });
    });

    describe('refresh', () => {
        test('should try to load first page if collection is empty always', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];

            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 0,
                    total_elements: 0, // initial state collection is empty
                    current_page: 1,
                    elements_per_page: 2
                })
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 2,
                    total_elements: 2, // after refresh collection is not empty
                    current_page: 1,
                    elements_per_page: 2
                })

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();
            resetCalls(entityDataManagerMock);

            // Act
            await volatileDataCollection.refresh();

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).once();
            expect(volatileDataCollection.count).toBe(2);
        });

        test('should NOT distribute DataChanged event when refreshing one or many pages', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage2 = [
                {id: 3},
                {id: 4}
            ];
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 1,
                    elements_per_page: 2
                })
                .thenResolve({
                    data: testDataPage2,
                    current_elements: testDataPage2.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 2,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();
            const eventListenerMock = jest.fn();
            volatileDataCollection.on(VolatileDataCollectionEventTypes.DataChanged, eventListenerMock);
            await volatileDataCollection.get(3);
            eventListenerMock.mockClear();

            // Act
            await volatileDataCollection.refresh();

            // Assert
            expect(eventListenerMock).toBeCalledTimes(0);
        });

        test('should NOT publish DataChanged event when loaded pages are refreshed', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];

            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 2,
                    total_elements: 4,
                    current_page: 1,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();
            const eventListenerMock = jest.fn();
            volatileDataCollection.on(VolatileDataCollectionEventTypes.DataChanged, eventListenerMock);

            // Act
            await volatileDataCollection.refresh();

            // Assert
            expect(eventListenerMock).toBeCalledTimes(0);
        });

        test('should fetch only previously loaded pages once more', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage3 = [
                {id: 5},
                {id: 6}
            ];
            const testDataPage4 = [
                {id: 7},
                {id: 8}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 1,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage3,
                    current_elements: testDataPage3.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 3,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage4,
                    current_elements: testDataPage4.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 4,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();
            await volatileDataCollection.get(4);
            await volatileDataCollection.get(6);
            resetCalls(entityDataManagerMock);

            // Act
            await volatileDataCollection.refresh();

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).once();
            verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything())).never();
            verify(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything())).once();
            verify(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything())).once();
        });

        test('should set count to 0 when all data is deleted on server', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];

            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 1,
                    total_elements: 2,
                    current_page: 1,
                    elements_per_page: 2
                })
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 0,
                    total_elements: 0,
                    current_page: 0,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();

            // Act
            await volatileDataCollection.refresh();

            // Assert
            expect(volatileDataCollection.count).toBe(0);
        });

        test('should resize internal pages collection when total pages count reduced with the next request', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];

            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 5,
                    total_elements: 9,
                    current_page: 1,
                    elements_per_page: 2
                })
                .thenResolve({
                    data: [
                        {id: 1},
                    ],
                    current_elements: 1,
                    last_page: 1,
                    total_elements: 1,
                    current_page: 1,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();

            // Act
            await volatileDataCollection.refresh();

            // Assert
            expect(volatileDataCollection["_pages"].length).toEqual(1);
            expect(volatileDataCollection["_pages"][0].data).toEqual([{id: 1}]);
        });
    });

    describe('dispose', () => {
        it('should remove all event listeners when dispose is called', async () => {
            // Arrange
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock));
            const onDataChangedListener = () => undefined;
            volatileDataCollection.on(VolatileDataCollectionEventTypes.DataChanged, onDataChangedListener);

            // Act
            volatileDataCollection.dispose();

            // Assert
            expect(volatileDataCollection["_eventEmitter"].listenerCount(VolatileDataCollectionEventTypes.DataChanged)).toBe(0);
        });

        it('should unsubscribe from eventRegistry when dispose is called', async () => {
            // Arrange
            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock));
            const eventRegisterSpy = jest.spyOn(EventRegister, 'removeEventListener');
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 1,
                    total_elements: 0,
                    current_page: 1,
                    elements_per_page: 0
                })
            await volatileDataCollection.init();

            // Act
            volatileDataCollection.dispose();

            // Assert
            expect(eventRegisterSpy).toHaveBeenCalled();
        });

        it('should clear collection data when dispose is called', async () => {
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];

            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 1,
                    total_elements: 2,
                    current_page: 1,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init();

            // Act
            volatileDataCollection.dispose();

            // Assert
            expect(volatileDataCollection["_pages"]).toEqual([]);
            expect(volatileDataCollection["_count"]).toBe(0);
            expect(volatileDataCollection["_totalPages"]).toBe(0);
            expect(volatileDataCollection["_loadedPageNumbers"].size).toBe(0);
        });
    });

    describe('on', () => {
        test('should distribute DataChanged event to multiple listeners', async () => {
            // Arrange
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 0,
                    total_elements: 0,
                    current_page: 1,
                    elements_per_page: 2
                });
            const entityDefinitionMock = mock<IEntityDefinition>();
            when(entityDefinitionMock.objectName).thenReturn("TestEntityEvent");
            when(entityDataManagerMock.entityDefinition).thenReturn(instance(entityDefinitionMock));

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            const firstListenerMock = jest.fn();
            const secondListenerMock = jest.fn();
            await volatileDataCollection.init();
            volatileDataCollection.on(VolatileDataCollectionEventTypes.DataChanged, firstListenerMock);
            volatileDataCollection.on(VolatileDataCollectionEventTypes.DataChanged, secondListenerMock);

            // Act
            const entityEditedEvent: IEntityEditedEvent = {
                entityName: "testentityevent",
                entityIds: [10],
                eventType: EntityEditorEventTypes.CREATED
            }
            EventRegister.emit('entityEditor', entityEditedEvent);

            // Assert
            await waitUntil(() =>
                tryVerify(
                    () => {
                        expect(firstListenerMock).toBeCalledTimes(1)
                        expect(secondListenerMock).toBeCalledTimes(1)
                    },
                    true
                )
            );
        });

        test('should not distribute Loading and Loaded events when page has already loaded', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];

            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 1,
                    total_elements: 2,
                    current_page: 1,
                    elements_per_page: 2
                });

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            const loadingListenerMock = jest.fn();
            const loadedListenerMock = jest.fn();
            await volatileDataCollection.init();
            volatileDataCollection.on(VolatileDataCollectionEventTypes.Loading, loadingListenerMock);
            volatileDataCollection.on(VolatileDataCollectionEventTypes.Loaded, loadedListenerMock);

            // Act
            await volatileDataCollection.get(0);

            // Assert
            expect(loadingListenerMock).toBeCalledTimes(0)
        });

        test('should distribute Loading and Loaded events only once when loading multiple pages', async () => {
            // Arrange
            when(entityDataManagerMock.get(anything(), anything()))
                .thenResolve({
                    data: [
                        {id: 1},
                        {id: 2}
                    ],
                    current_elements: 2,
                    last_page: 3,
                    total_elements: 6,
                    current_page: 1,
                    elements_per_page: 2
                })
                .thenResolve({
                    data: [
                        {id: 2},
                        {id: 3}
                    ],
                    current_elements: 2,
                    last_page: 3,
                    total_elements: 6,
                    current_page: 2,
                    elements_per_page: 2
                })
                .thenResolve({
                    data: [
                        {id: 4},
                        {id: 5}
                    ],
                    current_elements: 2,
                    last_page: 3,
                    total_elements: 6,
                    current_page: 3,
                    elements_per_page: 2
                })

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            const loadingListenerMock = jest.fn();
            const loadedListenerMock = jest.fn();
            await volatileDataCollection.init();
            await volatileDataCollection.get(2); // load page 2
            await volatileDataCollection.get(4); // load page 3
            volatileDataCollection.on(VolatileDataCollectionEventTypes.Loading, loadingListenerMock);
            volatileDataCollection.on(VolatileDataCollectionEventTypes.Loading, loadedListenerMock);

            // Act
            await volatileDataCollection.refresh();

            // Assert
            expect(loadingListenerMock).toBeCalledTimes(1)
            expect(loadedListenerMock).toBeCalledTimes(1)
        });
    });

    describe('handleEntityEditorEvent', () => {
        test('entity updated event should trigger refreshing only loaded pages and only starting with page which contains the updated entity ID', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage3 = [
                {id: 5},
                {id: 6}
            ];
            const testDataPage4 = [
                {id: 7},
                {id: 8}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 1,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage3,
                    current_elements: testDataPage3.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 3,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage4,
                    current_elements: testDataPage4.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 4,
                    elements_per_page: 2
                });
            const entityDefinitionMock = mock<IEntityDefinition>();
            when(entityDefinitionMock.objectName).thenReturn("TestEntityEvent");
            when(entityDataManagerMock.entityDefinition).thenReturn(instance(entityDefinitionMock));

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init(); // load page 1
            await volatileDataCollection.get(4); // load page 2
            await volatileDataCollection.get(6); // load page 3
            resetCalls(entityDataManagerMock);

            // Act
            const entityEditedEvent: IEntityEditedEvent = {
                entityName: "testentityevent",
                entityIds: [8, 3, 5], // 8 is on page 4, 3 is not loaded, 5 is on page 3
                eventType: EntityEditorEventTypes.UPDATED
            }
            EventRegister.emit('entityEditor', entityEditedEvent);
            await waitUntil(() =>
                tryVerify(
                    () => {
                        verify(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything())).once();
                        verify(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything())).once();
                    },
                    true
                )
            );

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).never();
            verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything())).never();
            verify(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything())).once();
            verify(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything())).once();
        });

        test('entity changed event should not trigger any data loading if entity ID belongs to not loaded page', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 1,
                    elements_per_page: 2
                });
            const entityDefinitionMock = mock<IEntityDefinition>();
            when(entityDefinitionMock.objectName).thenReturn("TestEntityEvent");
            when(entityDataManagerMock.entityDefinition).thenReturn(instance(entityDefinitionMock));

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init(); // load page 1
            resetCalls(entityDataManagerMock);

            // Act
            const entityEditedEvent: IEntityEditedEvent = {
                entityName: "testentityevent",
                entityIds: [3], // page 2 is not loaded
                eventType: EntityEditorEventTypes.UPDATED
            }
            EventRegister.emit('entityEditor', entityEditedEvent);
            await assertTrueAtLeast(() =>
                tryVerify(() => verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything())).never(), true),
                300
            );

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything())).never()
        });

        test('entity created event should trigger refreshing of all loaded pages', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage3 = [
                {id: 5},
                {id: 6}
            ];
            const testDataPage4 = [
                {id: 7},
                {id: 8}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 1,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage3,
                    current_elements: testDataPage3.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 3,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage4,
                    current_elements: testDataPage4.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 4,
                    elements_per_page: 2
                });
            const entityDefinitionMock = mock<IEntityDefinition>();
            when(entityDefinitionMock.objectName).thenReturn("TestEntityEvent");
            when(entityDataManagerMock.entityDefinition).thenReturn(instance(entityDefinitionMock));

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init(); // load page 1
            await volatileDataCollection.get(4); // load page 2
            await volatileDataCollection.get(6); // load page 3
            resetCalls(entityDataManagerMock);

            // Act
            const entityEditedEvent: IEntityEditedEvent = {
                entityName: "testentityevent",
                entityIds: [10],
                eventType: EntityEditorEventTypes.CREATED
            }
            EventRegister.emit('entityEditor', entityEditedEvent);
            await waitUntil(() =>
                tryVerify(
                    () => {
                        verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).once();
                        verify(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything())).once();
                        verify(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything())).once();
                    },
                    true
                )
            );

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).once();
            verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything())).never();
            verify(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything())).once();
            verify(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything())).once();
        });

        test('entity deleted event should trigger refreshing of all loaded pages', async () => {
            // Arrange
            const testDataPage1 = [
                {id: 1},
                {id: 2}
            ];
            const testDataPage3 = [
                {id: 5},
                {id: 6}
            ];
            const testDataPage4 = [
                {id: 7},
                {id: 8}
            ];

            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage1,
                    current_elements: testDataPage1.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 1,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage3,
                    current_elements: testDataPage3.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 3,
                    elements_per_page: 2
                });
            when(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything()))
                .thenResolve({
                    data: testDataPage4,
                    current_elements: testDataPage4.length,
                    last_page: 4,
                    total_elements: 8,
                    current_page: 4,
                    elements_per_page: 2
                });
            const entityDefinitionMock = mock<IEntityDefinition>();
            when(entityDefinitionMock.objectName).thenReturn("TestEntityEvent");
            when(entityDataManagerMock.entityDefinition).thenReturn(instance(entityDefinitionMock));

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init(); // load page 1
            await volatileDataCollection.get(4); // load page 2
            await volatileDataCollection.get(6); // load page 3
            resetCalls(entityDataManagerMock);

            // Act
            const entityEditedEvent: IEntityEditedEvent = {
                entityName: "testentityevent",
                entityIds: [10],
                eventType: EntityEditorEventTypes.DELETED
            }
            EventRegister.emit('entityEditor', entityEditedEvent);
            await waitUntil(() =>
                tryVerify(
                    () => {
                        verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).once();
                        verify(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything())).once();
                        verify(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything())).once();
                    },
                    true
                )
            );

            // Assert
            verify(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything())).once();
            verify(entityDataManagerMock.get(deepEqual({page: 2, size: 2}), anything())).never();
            verify(entityDataManagerMock.get(deepEqual({page: 3, size: 2}), anything())).once();
            verify(entityDataManagerMock.get(deepEqual({page: 4, size: 2}), anything())).once();
        });

        test('entity changed event should be ignored if entity name is not equal to configured for data collection', async () => {
            // Arrange
            when(entityDataManagerMock.get(deepEqual({page: 1, size: 2}), anything()))
                .thenResolve({
                    data: [],
                    current_elements: 0,
                    last_page: 0,
                    total_elements: 0,
                    current_page: 1,
                    elements_per_page: 2
                });
            const entityDefinitionMock = mock<IEntityDefinition>();
            when(entityDefinitionMock.objectName).thenReturn("TestEntityEvent");
            when(entityDataManagerMock.entityDefinition).thenReturn(instance(entityDefinitionMock));

            const volatileDataCollection = new VolatileDataCollection(instance(entityDataManagerMock), undefined, 2);
            await volatileDataCollection.init(); // load page 1
            resetCalls(entityDataManagerMock);

            // Act
            const entityEditedEvent: IEntityEditedEvent = {
                entityName: "differenttestentityevent",
                entityIds: [10],
                eventType: EntityEditorEventTypes.CREATED
            }
            EventRegister.emit('entityEditor', entityEditedEvent);
            await assertTrueAtLeast(() =>
                tryVerify(() => verify(entityDataManagerMock.get(anything(), anything())).never(), true),
                300
            );

            // Assert
            verify(entityDataManagerMock.get(anything(), anything())).never();
        });
    });
});

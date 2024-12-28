// noinspection JSVoidFunctionReturnValueUsed

import { renderHook, act } from '@testing-library/react';
import {mock, instance, verify, anything} from 'ts-mockito';
import IDataStorage from '../../../../src/Framework/Data/DataStorage/IDataStorage';
import {IStorageItem, DataStorageEventTypes} from '../../../../src/Framework/Data/DataStorage';
import {useDataStorageEvents} from '../../../../src/Features/DataStorage/Hooks/useDataStorageEvents';

describe('useDataStorageEvents', () => {
    let storageMock: IDataStorage<IStorageItem>;
    let listenersMock: ((args?: any) => void)[];
    let listenerMock: (args?: any) => void;

    beforeEach(() => {
        storageMock = mock<IDataStorage<IStorageItem>>();
        listenersMock = [jest.fn(), jest.fn(), jest.fn()];
        listenerMock = jest.fn();
    });

    test('should create storage instance', () => {
        // Act
        renderHook(() => useDataStorageEvents(storageMock));

        // Assert
        verify(storageMock.on(anything(), anything())).never();
        verify(storageMock.off(anything(), anything())).never();
    });

    test('should add listener to storage instance and eventHandlers on subscribe', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerMock);
        });

        // Assert
        verify(storageMock.on(DataStorageEventTypes.DataChanged, listenerMock)).once();
    });

    test('should remove listener from storage instance and clear eventHandlers on unmount', () => {
        // Arrange
        const { result, unmount } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerMock);
        });

        unmount();

        // Assert
        verify(storageMock.off(DataStorageEventTypes.DataChanged, listenerMock)).once();
    });

    test('should add multiple listeners to storage instance and eventHandlers on subscribe', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[0]);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[1]);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[2]);
        });

        // Assert
        listenersMock.forEach(listener => {
            verify(storageMock.on(DataStorageEventTypes.DataChanged, listener)).once();
        });
    });

    test('should remove multiple listeners from storage instance and clear eventHandlers on unmount', () => {
        // Arrange
        const { result, unmount } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[0]);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[1]);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[2]);
        });

        unmount();

        // Assert
        listenersMock.forEach(listener => {
            verify(storageMock.off(DataStorageEventTypes.DataChanged, listener)).once();
        });
    });

    test('should remove listener from storage instance and eventHandlersRef on unsubscribe', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerMock);
            result.current.unsubscribe(DataStorageEventTypes.DataChanged, listenerMock);
        });

        // Assert
        verify(storageMock.on(DataStorageEventTypes.DataChanged, listenerMock)).once();
        verify(storageMock.off(DataStorageEventTypes.DataChanged, listenerMock)).once();
    });

    test('should remove only the specified listener when multiple listeners are subscribed and one is unsubscribed', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));
        const listenerToUnsubscribe = listenersMock[0];

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[1]);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[2]);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerToUnsubscribe);
            result.current.unsubscribe(DataStorageEventTypes.DataChanged, listenerToUnsubscribe);
        });

        // Assert
        verify(storageMock.on(DataStorageEventTypes.DataChanged, listenerToUnsubscribe)).once();
        verify(storageMock.off(DataStorageEventTypes.DataChanged, listenerToUnsubscribe)).once();
        listenersMock.slice(1).forEach(listener => {
            verify(storageMock.on(DataStorageEventTypes.DataChanged, listener)).once();
            verify(storageMock.off(DataStorageEventTypes.DataChanged, listener)).never();
        });
    });

    test('should subscribe and unsubscribe to multiple events', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));
        const events = [DataStorageEventTypes.DataChanged, DataStorageEventTypes.DataDeleted];

        // Act
        act(() => {
            result.current.subscribe(events, listenerMock);
            result.current.unsubscribe(events, listenerMock);
        });

        // Assert
        events.forEach(event => {
            verify(storageMock.on(event, listenerMock)).once();
            verify(storageMock.off(event, listenerMock)).once();
        });
    });

    test('should not throw error when unsubscribing non-subscribed event', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act - Assert
        expect(() => {
            act(() => {
                result.current.unsubscribe(DataStorageEventTypes.DataChanged, listenerMock);
            });
        }).not.toThrow();

        verify(storageMock.off(DataStorageEventTypes.DataChanged, listenerMock)).never();
    });

    test('should not add the same listener multiple times', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerMock);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerMock);
        });

        // Assert
        verify(storageMock.on(DataStorageEventTypes.DataChanged, listenerMock)).once();
    });

    test('should correctly handle different listeners for the same event', () => {
        // Arrange
        const { result } = renderHook(() => useDataStorageEvents(instance(storageMock)));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[0]);
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenersMock[1]);
            result.current.unsubscribe(DataStorageEventTypes.DataChanged, listenersMock[0]);
        });

        // Assert
        verify(storageMock.on(DataStorageEventTypes.DataChanged, listenersMock[0])).once();
        verify(storageMock.off(DataStorageEventTypes.DataChanged, listenersMock[0])).once();
        verify(storageMock.on(DataStorageEventTypes.DataChanged, listenersMock[1])).once();
        verify(storageMock.off(DataStorageEventTypes.DataChanged, listenersMock[1])).never();
    });
});

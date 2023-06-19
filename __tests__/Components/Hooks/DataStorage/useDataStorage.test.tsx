// noinspection JSVoidFunctionReturnValueUsed

import { renderHook, act } from '@testing-library/react-hooks';
import {mock, instance, verify, anything} from "ts-mockito";
import IDataStorage from "../../../../src/Framework/Data/DataStorage/IDataStorage";
import {IStorageItem, DataStorageEventTypes} from "../../../../src/Framework/Data/DataStorage";
import {useDataStorage} from "../../../../src/Components/Hooks/DataStorage/useDataStorage";

describe('useDataStorage', () => {
    let storageMock: IDataStorage<IStorageItem>;
    let listenersMock: ((args?: any) => void)[];
    let listenerMock: (args?: any) => void;

    beforeEach(() => {
        storageMock = mock<IDataStorage<IStorageItem>>();
        listenersMock = [jest.fn(), jest.fn(), jest.fn()];
        listenerMock = jest.fn();
    });

    test('should create storage instance', () => {
        // Arrange
        const storageFactory = () => instance(storageMock);

        // Act
        renderHook(() => useDataStorage(storageFactory));

        // Assert
        verify(storageMock.on(anything(), anything())).never();
        verify(storageMock.off(anything(), anything())).never();

    });

    test('should add listener to storage instance and eventHandlersRef on subscribe', () => {
        // Arrange
        const storageFactory = () => instance(storageMock);
        const { result } = renderHook(() => useDataStorage(storageFactory));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerMock);
        });

        // Assert
        verify(storageMock.on(DataStorageEventTypes.DataChanged, listenerMock)).once();
    });

    test('should remove listener from storage instance and clear eventHandlersRef on unmount', () => {
        // Arrange
        const storageFactory = () => instance(storageMock);
        const { result, unmount } = renderHook(() => useDataStorage(storageFactory));

        // Act
        act(() => {
            result.current.subscribe(DataStorageEventTypes.DataChanged, listenerMock);
        });

        unmount();

        // Assert
        verify(storageMock.off(DataStorageEventTypes.DataChanged, listenerMock)).once();
    });

    test('should add multiple listeners to storage instance and eventHandlersRef on subscribe', () => {
        // Arrange
        const storageFactory = () => instance(storageMock);
        const { result } = renderHook(() => useDataStorage(storageFactory));

        // Act
        act(() => {
            listenersMock.forEach(listener => {
                result.current.subscribe(DataStorageEventTypes.DataChanged, listener);
            });
        });

        // Assert
        listenersMock.forEach(listener => {
            verify(storageMock.on(DataStorageEventTypes.DataChanged, listener)).once();
        });
    });

    test('should remove multiple listeners from storage instance and clear eventHandlersRef on unmount', () => {
        // Arrange
        const storageFactory = () => instance(storageMock);
        const { result, unmount } = renderHook(() => useDataStorage(storageFactory));

        // Act
        act(() => {
            listenersMock.forEach(listener => {
                result.current.subscribe(DataStorageEventTypes.DataChanged, listener);
            });
        });

        unmount();

        // Assert
        listenersMock.forEach(listener => {
            verify(storageMock.off(DataStorageEventTypes.DataChanged, listener)).once();
        });
    });

    test('should remove listener from storage instance and eventHandlersRef on unsubscribe', () => {
        // Arrange
        const storageFactory = () => instance(storageMock);
        const { result } = renderHook(() => useDataStorage(storageFactory));

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
        const storageFactory = () => instance(storageMock);
        const { result } = renderHook(() => useDataStorage(storageFactory));
        const listenerToUnsubscribe = listenersMock[0];

        // Act
        act(() => {
            listenersMock.forEach(listener => {
                result.current.subscribe(DataStorageEventTypes.DataChanged, listener);
            });
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
});

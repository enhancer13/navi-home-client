import {DefaultMapper, DataContext} from "../../../../../src/Framework/Data/DataStorage";
import {ServerInfo} from "../../../../../src/Features/LocalStorage";

const contextName = 'ServerInfo';
const mapper = new DefaultMapper<ServerInfo>();
const dataContext = new DataContext<ServerInfo>(contextName, mapper);

beforeEach(async () => {
    await dataContext.deleteAll();
});

describe('DataContext', () => {
    // Arrange
    const server1 = new ServerInfo('Server 1', '192.168.1.1');
    const server2 = new ServerInfo('Server 2', '192.168.1.2');

    describe('save', () => {
        it('should save an entity', async () => {
            // Act
            await dataContext.save(server1);

            // Assert
            const savedServer = await dataContext.getBy((s) => s.serverName === server1.serverName);
            expect(savedServer).toMatchObject(server1);
        });
    });

    describe('saveMultiple', () => {
        it('should save multiple entities', async () => {
            // Act
            await dataContext.saveMultiple([server1, server2]);

            // Assert
            const savedServers = await dataContext.getAll();
            expect(savedServers).toHaveLength(2);
            expect(savedServers).toEqual(expect.arrayContaining([expect.objectContaining(server1), expect.objectContaining(server2)]));
        });
    });

    describe('getBy', () => {
        it('should retrieve an entity by predicate', async () => {
            // Arrange
            await dataContext.saveMultiple([server1, server2]);

            // Act
            const retrievedServer = await dataContext.getBy((s) => s.serverName === server1.serverName);

            // Assert
            expect(retrievedServer).toMatchObject(server1);
        });
    });

    describe('getAll', () => {
        it('should retrieve all entities', async () => {
            // Arrange
            await dataContext.saveMultiple([server1, server2]);

            // Act
            const allServers = await dataContext.getAll();

            // Assert
            expect(allServers).toHaveLength(2);
            expect(allServers).toEqual(expect.arrayContaining([expect.objectContaining(server1), expect.objectContaining(server2)]));
        });
    });

    describe('update', () => {
        it('should update an entity', async () => {
            // Arrange
            await dataContext.save(server1);
            const updatedServerInfo = new ServerInfo('Updated Server', '192.168.1.3');
            updatedServerInfo.key = server1.key;

            // Act
            await dataContext.update(updatedServerInfo);

            // Assert
            const updatedServer = await dataContext.getBy((s) => s.key === server1.key);
            expect(updatedServer).toMatchObject(updatedServerInfo);
        });
    });

    describe('delete', () => {
        it('should delete an entity', async () => {
            // Arrange
            await dataContext.save(server1);

            // Act
            await dataContext.delete(server1);

            // Assert
            const deletedServer = await dataContext.getBy((s) => s.key === server1.key);
            expect(deletedServer).toBeUndefined();
        });
    });

    describe('deleteBy', () => {
        it('should delete an entity by predicate', async () => {
            // Arrange
            await dataContext.saveMultiple([server1, server2]);

            // Act
            await dataContext.deleteBy((s) => s.serverName === server1.serverName);

            // Assert
            const remainingServers = await dataContext.getAll();
            expect(remainingServers).toHaveLength(1);
            expect(remainingServers[0]).toMatchObject(server2);
        });
    });

    describe('deleteAll', () => {
        it('should delete all entities', async () => {
            // Arrange
            await dataContext.saveMultiple([server1, server2]);

            // Act
            await dataContext.deleteAll();

            // Assert
            const remainingServers = await dataContext.getAll();
            expect(remainingServers).toHaveLength(0);
        });
    });

    describe('count', () => {
        it('should return the count of entities', async () => {
            // Arrange
            await dataContext.saveMultiple([server1, server2]);

            // Act
            const count = await dataContext.count();

            // Assert
            expect(count).toBe(2);
        });
    });
});


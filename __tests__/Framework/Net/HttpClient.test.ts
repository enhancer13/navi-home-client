import HttpClient from '../../../src/Framework/Net/HttpClient/HttpClient';
import { Authentication } from '../../../src/Features/Authentication';
import fetchMock from 'jest-fetch-mock';

describe('HttpClient', () => {
    const serverAddress = 'https://api.myserver.com';
    const authentication: Authentication = new Authentication(
        'Dummy',
        serverAddress,
        { Authorization: 'Bearer token' },
        new Date()
    );
    const headers = { 'Custom-Header': 'customValue' };
    const timeout = 1000;
    const client = new HttpClient(timeout);

    beforeEach(() => {
        fetchMock.resetMocks();
    });

    // GIVEN a GET request
    // WHEN the request is successful
    // EXPECT the response to be returned
    it('should return response for successful GET request', async () => {
        // Arrange
        const path = '/get';
        const url = serverAddress + path;
        const responseBody = { message: 'Success' };
        fetchMock.mockResponseOnce(JSON.stringify(responseBody), { status: 200, headers: { 'content-type': 'application/json' } });

        // Act
        const response = await client.get(path, { authentication, headers });

        // Assert
        expect(response).toEqual(responseBody);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(url, {
            method: 'GET',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Custom-Header': 'customValue',
            },
            signal: undefined,
        });
    });

    // GIVEN a POST request
    // WHEN the request is successful
    // EXPECT the response to be returned
    it('should return response for successful POST request', async () => {
        // Arrange
        const path = '/post';
        const url = serverAddress + path;
        const requestBody = JSON.stringify({ field: 'value' });
        const responseBody = { message: 'Success' };
        fetchMock.mockResponseOnce(JSON.stringify(responseBody), { status: 200, headers: { 'content-type': 'application/json' } });

        // Act
        const response = await client.post(path, { body: requestBody, authentication, headers });

        // Assert
        expect(response).toEqual(responseBody);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(url, {
            method: 'POST',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Custom-Header': 'customValue',
            },
            body: requestBody,
            signal: undefined,
        });
    });

    // GIVEN a PUT request
    // WHEN the request is successful
    // EXPECT the response to be returned
    it('should return response for successful PUT request', async () => {
        // Arrange
        const path = '/put';
        const url = serverAddress + path;
        const requestBody = JSON.stringify({ field: 'value' });
        const responseBody = { message: 'Success' };
        fetchMock.mockResponseOnce(JSON.stringify(responseBody), { status: 200, headers: { 'content-type': 'application/json' } });

        // Act
        const response = await client.put(path, { body: requestBody, authentication, headers });

        // Assert
        expect(response).toEqual(responseBody);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(url, {
            method: 'PUT',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Custom-Header': 'customValue',
            },
            body: requestBody,
            signal: undefined,
        });
    });

    // GIVEN a DELETE request
    // WHEN the request is successful
    // EXPECT the response to be returned
    it('should return response for successful DELETE request', async () => {
        // Arrange
        const path = '/delete';
        const url = serverAddress + path;
        const requestBody = JSON.stringify({ field: 'value' });
        const responseBody = { message: 'Success' };
        fetchMock.mockResponseOnce(JSON.stringify(responseBody), { status: 200, headers: { 'content-type': 'application/json' } });

        // Act
        const response = await client.delete(path, { body: requestBody, authentication, headers });

        // Assert
        expect(response).toEqual(responseBody);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        expect(fetchMock).toHaveBeenCalledWith(url, {
            method: 'DELETE',
            headers: {
                Authorization: 'Bearer token',
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Custom-Header': 'customValue',
            },
            body: requestBody,
            signal: undefined,
        });
    });

    // GIVEN a GET request
    // WHEN the request times out
    // EXPECT a timeout error to be thrown
    it('should throw a timeout error when the request times out', async () => {
        // Arrange
        const path = '/timeout';

        // Simulate a delayed response
        fetchMock.mockImplementationOnce(() =>
            new Promise((resolve) => setTimeout(() => resolve(new Response('', { status: 200, headers: { 'Content-Type': 'application/json' } })), timeout * 2))
        );

        // Act and Assert
        await expect(client.get(path, { authentication, headers })).rejects.toThrow(
            'Connection timeout, service is unavailable.'
        );
    });

    // GIVEN a request
    // WHEN the response has an error status code
    // EXPECT an error with the status code and error message to be thrown
    it('should throw an error with status code and error message for failed requests', async () => {
        // Arrange
        const path = '/error';
        const responseBody = { message: 'Failed', details: 'Invalid request' };
        fetchMock.mockResponseOnce(JSON.stringify(responseBody), { status: 400, headers: { 'content-type': 'application/json' } });

        // Act and Assert
        await expect(client.get(path, { authentication, headers })).rejects.toThrow(
            'Server returned status code 400: Failed (Invalid request)'
        );
    });

    // GIVEN a GET request
    // WHEN the request is aborted
    // EXPECT an abort error to be thrown
    it('should throw an abort error when the request is aborted', async () => {
        // Arrange
        const path = '/abort';
        const abortController = new AbortController();
        const { signal } = abortController;

        // Simulate a delayed response
        fetchMock.mockImplementationOnce(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve(new Response('', { status: 200, headers: { 'Content-Type': 'application/json' } })), timeout * 2)
                )
        );

        // Act
        const requestPromise = client.get(path, { authentication, headers, signal });

        // Abort the request before the timeout
        setTimeout(() => abortController.abort(), timeout / 4);

        // Assert
        await expect(requestPromise).rejects.toThrow('The user aborted a request.');
    });

    // GIVEN a POST request
    // WHEN the request is aborted
    // EXPECT the request to be aborted without throwing a timeout error
    it('should abort the request when the signal is triggered for POST requests', async () => {
        // Arrange
        const path = '/abort-post';
        const requestBody = JSON.stringify({ field: 'value' });

        // Simulate a delayed response
        fetchMock.mockImplementationOnce(
            () =>
                new Promise((resolve) =>
                    setTimeout(() => resolve(new Response('', { status: 200, headers: { 'Content-Type': 'application/json' } })), timeout * 2)
                )
        );

        const abortController = new AbortController();
        const { signal } = abortController;

        // Act
        const requestPromise = client.post(path, {
            body: requestBody,
            authentication,
            headers,
            signal,
        });
        abortController.abort();

        // Assert
        await expect(requestPromise).rejects.toThrow('The user aborted a request.');
    });
});

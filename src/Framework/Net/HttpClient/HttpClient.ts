import IHttpClient from './IHttpClient';
import {ErrorResponse} from "../../../BackendTypes";
import {HttpRequestOptions} from "./HttpRequestOptions";
import {HttpMethod} from "./HttpMethod";
import {AuthenticationFailed} from "../../../Errors/AuthenticationFailed";

export default class HttpClient implements IHttpClient {
    private readonly _timeout: number;

    constructor(timeout = 15000) {
        this._timeout = timeout;
    }

    public async get<TResponse>(path: string, httpRequestOptions?: HttpRequestOptions): Promise<TResponse> {
        return this.send<TResponse>(path, HttpMethod.GET, httpRequestOptions);
    }

    public async put<TResponse>(path: string, httpRequestOptions?: HttpRequestOptions): Promise<TResponse> {
        return this.send<TResponse>(path, HttpMethod.PUT, httpRequestOptions);
    }

    public async post<TResponse>(path: string, httpRequestOptions?: HttpRequestOptions): Promise<TResponse> {
        return this.send<TResponse>(path, HttpMethod.POST, httpRequestOptions);
    }

    public async delete<TResponse>(path: string, httpRequestOptions?: HttpRequestOptions): Promise<TResponse> {
        return this.send<TResponse>(path, HttpMethod.DELETE, httpRequestOptions);
    }

    public async send<TResponse>(path: string, method: HttpMethod, httpRequestOptions?: HttpRequestOptions): Promise<TResponse> {
        const {body, authentication, headers, signal} = httpRequestOptions || {};
        if (authentication) {
            path = authentication.serverAddress + path;
        }

        const options: RequestInit = {
            method,
            headers: {
                ...authentication?.authorizationHeader,
                'Content-Type': 'application/json',
                Accept: 'application/json',
                ...headers
            },
            signal
        };
        console.debug('headers: ', options.headers)
        console.debug('body: ', body)
        console.debug('url: ', path)

        if (body) {
            options.body = body;
        }

        const fetchPromise = window.fetch(path, options)
            .then(this.checkResponse)
            .then(response => {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    return response.json();
                }
                return response.text();
            });

        const timeout = httpRequestOptions?.timeout || this._timeout;
        const timeoutPromise = new Promise((_, reject) => {
                const timeoutId = setTimeout(() => reject(new Error("Connection timeout, service is unavailable.")), timeout);

                signal?.addEventListener("abort", () => {
                    clearTimeout(timeoutId);
                    reject(new Error("The user aborted a request."));
                });
            }
        );
        return Promise.race([fetchPromise, timeoutPromise]);
    }

    private async checkResponse(response: Response): Promise<Response> {
        if (response.status >= 200 && response.status < 300) {
            return response;
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.indexOf('application/json') !== -1) {
            const errorResponse: ErrorResponse = await response.json();
            const errorMessage = `Server returned status code ${response.status}: ${errorResponse.message} (${errorResponse.details})`;
            if (response.status === 401) {
                throw new AuthenticationFailed(errorMessage);
            }
            throw new Error(errorMessage);
        } else {
            const errorMessage = `Server returned status code ${response.status} with unknown error`;
            throw new Error(errorMessage);
        }
    }
}

const httpClient = new HttpClient();
export {httpClient};

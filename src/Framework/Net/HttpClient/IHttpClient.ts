import {HttpRequestOptions} from './HttpRequestOptions';
import {HttpMethod} from './HttpMethod';

export default interface IHttpClient {
    get<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>;

    put<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>;

    post<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>;

    delete<TResponse>(url: string, options?: HttpRequestOptions): Promise<TResponse>;

    send<TResponse>(path: string, method: HttpMethod, httpRequestOptions?: HttpRequestOptions): Promise<TResponse>;
}

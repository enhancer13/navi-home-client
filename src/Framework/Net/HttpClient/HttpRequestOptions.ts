import {Authentication} from "../../../Features/Authentication";

import {HttpHeaders} from "./HttpHeaders";

export declare type HttpRequestOptions = {
    authentication?: Authentication | null;
    headers?: HttpHeaders;
    body?: string | null;
    signal?: AbortSignal;
    timeout?: number;
    returnRawResponse?: boolean;
};

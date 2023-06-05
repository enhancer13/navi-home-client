export class AuthenticationFailed extends Error {
    constructor(message?: string) {
        super(message);
        this.name = 'AuthenticationFailed';

        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, AuthenticationFailed);
        }
    }
}

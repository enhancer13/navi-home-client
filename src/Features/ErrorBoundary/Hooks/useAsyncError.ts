import {useState} from 'react';

export const useAsyncError = () => {
    const [, setError] = useState();

    return async <T>(asyncFn: () => Promise<T>): Promise<T> => {
        try {
            return await asyncFn();
        } catch (e) {
            setError(() => {
                throw e;
            });
            throw e;
        }
    };
};

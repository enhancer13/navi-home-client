import {Dispatch, SetStateAction, useState} from 'react';
import {useLoadingDelay} from './useLoadingDelay';

export const useLoadingState = (initialLoading = false): [boolean, Dispatch<SetStateAction<boolean>>] => {
    const [loading, setLoading] = useState(initialLoading);
    const delayedLoading = useLoadingDelay(loading);
    return [delayedLoading, setLoading];
};

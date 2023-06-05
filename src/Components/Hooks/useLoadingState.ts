import { useEffect, useState } from "react";

export const useLoadingState = (externalLoading: boolean) => {
    const [loading, setLoading] = useState(externalLoading);

    useEffect(() => {
        let timer: number;
        if (externalLoading) {
            timer = window.setTimeout(() => setLoading(true), 1000);
        } else {
            setLoading(false);
        }
        return () => {
            if (timer) {
                window.clearTimeout(timer);
            }
        };
    }, [externalLoading]);

    return loading;
};

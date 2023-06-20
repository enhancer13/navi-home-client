import { useEffect, useState } from "react";

export const useLoadingDelay = (externalLoading: boolean) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setLoading(externalLoading), 1000);

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [externalLoading]);

    return loading;
};


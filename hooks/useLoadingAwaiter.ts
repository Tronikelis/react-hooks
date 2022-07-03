import { useState } from "react";

export default function useLoadingAwaiter(initial = false) {
    const [loading, setLoading] = useState(initial);

    const awaiter = async <T>(promise: Promise<T>) => {
        setLoading(true);
        const res = await promise;
        setLoading(false);

        return res;
    };

    return [loading, awaiter] as const;
}

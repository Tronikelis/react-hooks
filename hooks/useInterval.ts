import { useEffect, useRef } from "react";

export default function useInterval(cb: () => any, ms = 1000) {
    const callbackRef = useRef(cb);
    const intervalRef = useRef<null | NodeJS.Timer>(null);

    callbackRef.current = cb;

    useEffect(() => {
        intervalRef.current = setInterval(() => callbackRef.current(), ms);
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [ms]);

    const reset = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => callbackRef.current(), ms);
    };

    const stop = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    return { reset, stop };
}

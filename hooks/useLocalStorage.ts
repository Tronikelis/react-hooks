import { useEffect, useState } from "react";

let LS_AVAILABLE = false;

const safeParse = (str: string) => {
    try {
        return JSON.parse(str);
    } catch (err) {
        console.warn(err);
        return null;
    }
};

export default function useLocalStorage<T>(key: string, def: T) {
    const [state, setState] = useState(
        LS_AVAILABLE ? (safeParse(localStorage.getItem(key) as string) as T) || def : def
    );

    const setStateWrapper: typeof setState = newState => {
        setState(newState);
        const latest = newState instanceof Function ? newState(state) : newState;
        localStorage.setItem(key, JSON.stringify(latest));
    };

    useEffect(() => {
        LS_AVAILABLE = true;

        const item = localStorage.getItem(key);
        if (item) setState(safeParse(item));
    }, [key]);

    return [state, setStateWrapper] as const;
}

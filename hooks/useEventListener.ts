import { useCallback, useRef } from "react";

type Events = {
    [K in keyof HTMLElementEventMap]: (ev: HTMLElementEventMap[K]) => any;
};

export default function useEventListener(events: Partial<Events> = {}) {
    const elementRef = useRef<HTMLElement | null>(null);

    const setRef = useCallback(
        (node: HTMLElement | null) => {
            const entries = Object.entries(events);

            if (elementRef.current) {
                entries.forEach(([event, cb]) =>
                    elementRef.current?.removeEventListener(event as any, cb)
                );
            }

            if (node) {
                entries.forEach(([event, cb]) => node.addEventListener(event as any, cb));
            }

            elementRef.current = node;
        },
        [events]
    );

    return setRef;
}

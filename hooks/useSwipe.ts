import { useRef } from "react";

import useEventListener from "./useEventListener";

type Direction = "up" | "down" | "left" | "right";

type useSwipeCbs = Partial<{
    onSwipe: (dir: Direction) => any;
    onSwipeRight: () => any;
    onSwipeLeft: () => any;
    onSwipeUp: () => any;
    onSwipeDown: () => any;
}>;

interface useSwipeOpts {
    threshold?: number;
    preventDefault?: boolean;
}

// on mobile disable the scrolling temporarily because it interrupts the swiping
const toggleScroll = (style: "hidden" | "auto") => {
    document.documentElement.style.overflow = style;
};

export default function useSwipe(
    { onSwipe, onSwipeDown, onSwipeLeft, onSwipeRight, onSwipeUp }: useSwipeCbs,
    { preventDefault = true, threshold = 100 }: useSwipeOpts = {
        preventDefault: true,
        threshold: 100,
    }
) {
    const touchedRef = useRef({
        start: {
            x: 0,
            y: 0,
        },
        end: {
            x: 0,
            y: 0,
        },
    });

    const handleEnd = () => {
        const { end, start } = touchedRef.current;
        const margin = {
            x: Math.abs(start.x - end.x) > threshold,
            y: Math.abs(start.y - end.y) > threshold * 0.5,
        };

        if (start.x > end.x && margin.x) {
            onSwipe && onSwipe("left");
            onSwipeLeft && onSwipeLeft();
            return;
        }
        if (start.x < end.x && margin.x) {
            onSwipe && onSwipe("right");
            onSwipeRight && onSwipeRight();
            return;
        }
        if (start.y > end.y && margin.y) {
            onSwipe && onSwipe("up");
            onSwipeUp && onSwipeUp();
            return;
        }
        if (start.y < end.y && margin.y) {
            onSwipe && onSwipe("down");
            onSwipeDown && onSwipeDown();
        }
    };

    const setRef = useEventListener({
        mousedown: ev => {
            preventDefault && ev.preventDefault();

            touchedRef.current.start.x = ev.pageX;
            touchedRef.current.start.y = ev.pageY;
        },
        mouseup: ev => {
            preventDefault && ev.preventDefault();

            touchedRef.current.end.x = ev.pageX;
            touchedRef.current.end.y = ev.pageY;
            handleEnd();
        },

        touchstart: ev => {
            preventDefault && ev.preventDefault();
            toggleScroll("hidden");

            touchedRef.current.start.x = ev.changedTouches[0].screenX;
            touchedRef.current.start.y = ev.changedTouches[0].screenY;
        },
        touchend: ev => {
            preventDefault && ev.preventDefault();
            toggleScroll("auto");

            touchedRef.current.end.x = ev.changedTouches[0].screenX;
            touchedRef.current.end.y = ev.changedTouches[0].screenY;
            handleEnd();
        },
    });

    return setRef;
}

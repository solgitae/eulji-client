import { useState, useEffect, useRef } from "react";

interface UseDelayedLoadingOptions {
    /** Time to wait before showing the skeleton (ms). Default: 150ms */
    delayMs?: number;
    /** Minimum time to show the skeleton once it appears (ms). Default: 500ms */
    minDisplayMs?: number;
}

/**
 * A hook to prevent skeleton flickering.
 * 1. If loading finishes before `delayMs`, the skeleton never shows.
 * 2. If the skeleton shows, it's guaranteed to stay visible for at least `minDisplayMs`
 *    even if the actual loading finishes earlier.
 */
export function useDelayedLoading(
    isLoading: boolean,
    options: UseDelayedLoadingOptions = {}
) {
    const { delayMs = 150, minDisplayMs = 500 } = options;

    const [delayedLoading, setDelayedLoading] = useState(false);
    const skeletonShownAt = useRef<number>(0);

    useEffect(() => {
        let showTimer: number;
        let hideTimer: number = 0;

        if (isLoading) {
            showTimer = window.setTimeout(() => {
                skeletonShownAt.current = Date.now();
                setDelayedLoading(true);
            }, delayMs);
        } else {
            const now = Date.now();
            const timeSinceShown = now - skeletonShownAt.current;

            if (delayedLoading && timeSinceShown < minDisplayMs) {
                hideTimer = window.setTimeout(() => {
                    setDelayedLoading(false);
                    skeletonShownAt.current = 0;
                }, minDisplayMs - timeSinceShown);
            } else {
                setDelayedLoading(false);
                skeletonShownAt.current = 0;
            }
        }

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [isLoading, delayedLoading, delayMs, minDisplayMs]);

    return delayedLoading;
}

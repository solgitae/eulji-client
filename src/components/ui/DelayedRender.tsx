
import React from "react";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";

export function DelayedRender({ children, delay = 150 }: { children: React.ReactNode, delay?: number }) {
    // We treat DelayedRender as always "loading" the skeleton 
    // It will wait `delay` ms to show, and then stay for at least 500ms before unmounting.
    // However, DelayedRender is usually unmounted by the parent when loading is done.
    // If we want it to artificially stay alive, the parent must control the `isLoading` state
    // and pass it down, which it doesn't do here (it just renders this component).
    // So for DelayedRender, we just use a simple timeout for the delay phase.
    
    const [shouldRender, setShouldRender] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setShouldRender(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);

    if (!shouldRender) return null;

    return <>{children}</>;
}

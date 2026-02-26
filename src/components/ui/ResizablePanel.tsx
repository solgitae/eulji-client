
import React, { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/utils/util";

interface ResizableContextValue {
    sizes: number[];
    setSizes: React.Dispatch<React.SetStateAction<number[]>>;
    direction: "horizontal" | "vertical";
}

const ResizableContext = React.createContext<ResizableContextValue>({
    sizes: [50, 50],
    setSizes: () => {},
    direction: "horizontal",
});

export function ResizablePanelGroup({
    children,
    direction = "horizontal",
    className,
    defaultSizes = [50, 50],
}: {
    children: React.ReactNode;
    direction?: "horizontal" | "vertical";
    className?: string;
    defaultSizes?: number[];
}) {
    const [sizes, setSizes] = useState(defaultSizes);

    return (
        <ResizableContext.Provider value={{ sizes, setSizes, direction }}>
            <div
                className={cn(
                    "flex h-full w-full overflow-hidden",
                    direction === "vertical" ? "flex-col" : "flex-row",
                    className,
                )}
            >
                {children}
            </div>
        </ResizableContext.Provider>
    );
}

export function ResizablePanel({
    children,
    className,
    index = 0,
    minSize = 15,
    maxSize = 85,
}: {
    children: React.ReactNode;
    className?: string;
    index?: number;
    minSize?: number;
    maxSize?: number;
}) {
    const { sizes, direction } = React.useContext(ResizableContext);
    const size = sizes[index] ?? 50;

    const style = direction === "horizontal"
        ? { width: `${size}%`, minWidth: `${minSize}%`, maxWidth: `${maxSize}%` }
        : { height: `${size}%`, minHeight: `${minSize}%`, maxHeight: `${maxSize}%` };

    return (
        <div className={cn("overflow-hidden", className)} style={style}>
            {children}
        </div>
    );
}

export function ResizableHandle({
    className,
    panelBefore = 0,
    panelAfter = 1,
}: {
    className?: string;
    panelBefore?: number;
    panelAfter?: number;
}) {
    const { sizes, setSizes, direction } = React.useContext(ResizableContext);
    const [isDragging, setIsDragging] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setIsDragging(true);

            const startPos = direction === "horizontal" ? e.clientX : e.clientY;
            const startSizes = [...sizes];

            const container = containerRef.current?.parentElement;
            if (!container) return;

            const containerSize = direction === "horizontal"
                ? container.getBoundingClientRect().width
                : container.getBoundingClientRect().height;

            const handleMouseMove = (moveEvent: MouseEvent) => {
                const currentPos = direction === "horizontal" ? moveEvent.clientX : moveEvent.clientY;
                const delta = ((currentPos - startPos) / containerSize) * 100;

                const newBefore = Math.min(85, Math.max(15, startSizes[panelBefore] + delta));
                const newAfter = Math.min(85, Math.max(15, startSizes[panelAfter] - delta));

                setSizes((prev) => {
                    const next = [...prev];
                    next[panelBefore] = newBefore;
                    next[panelAfter] = newAfter;
                    return next;
                });
            };

            const handleMouseUp = () => {
                setIsDragging(false);
                document.removeEventListener("mousemove", handleMouseMove);
                document.removeEventListener("mouseup", handleMouseUp);
            };

            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        },
        [sizes, setSizes, direction, panelBefore, panelAfter],
    );

    const isHorizontal = direction === "horizontal";

    return (
        <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            className={cn(
                "relative shrink-0 flex items-center justify-center group overflow-visible z-10",
                isHorizontal
                    ? "w-0 cursor-col-resize"
                    : "h-0 cursor-row-resize",
                className,
            )}
        >
            
            <div 
                className={cn(
                    "flex items-center justify-center transition-all duration-150 opacity-0 group-hover:opacity-100",
                    isHorizontal ? "w-6 h-full -translate-x-1/2 absolute" : "h-6 w-full -translate-y-1/2 absolute",
                    isDragging && "opacity-100"
                )}
            >
                <div
                    className={cn(
                        "rounded-full",
                        isHorizontal ? "w-1 h-8" : "h-1 w-8",
                        isDragging
                            ? "bg-(--color-accent)"
                            : "bg-(--color-border)",
                    )}
                />
            </div>
        </div>
    );
}

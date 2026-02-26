
import React, { useRef, useState, useEffect } from "react";
import { cn } from "@/utils/util";

export interface ScrollAreaProps {
    children: React.ReactNode;
    className?: string;
    maxHeight?: string | number;
    orientation?: "vertical" | "horizontal" | "both";
}

export function ScrollArea({
    children,
    className,
    maxHeight,
    orientation = "vertical",
}: ScrollAreaProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);
    const [thumbHeight, setThumbHeight] = useState(0);
    const [thumbTop, setThumbTop] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const dragStartY = useRef(0);
    const dragStartScrollTop = useRef(0);
    const scrollTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    const showScrollbar = isScrolling || isHovering || isDragging;

    const updateThumb = () => {
        const el = scrollRef.current;
        if (!el) return;

        const { scrollHeight, clientHeight, scrollTop } = el;
        if (scrollHeight <= clientHeight) {
            setThumbHeight(0);
            return;
        }

        const ratio = clientHeight / scrollHeight;
        const height = Math.max(ratio * clientHeight, 24); 
        const top = (scrollTop / (scrollHeight - clientHeight)) * (clientHeight - height);

        setThumbHeight(height);
        setThumbTop(top);
    };

    const handleScroll = () => {
        updateThumb();
        setIsScrolling(true);
        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
        scrollTimeout.current = setTimeout(() => setIsScrolling(false), 1200);
    };

    useEffect(() => {
        updateThumb();
        const ro = new ResizeObserver(updateThumb);
        if (scrollRef.current) ro.observe(scrollRef.current);
        return () => ro.disconnect();
    }, []);

    const handleThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartY.current = e.clientY;
        dragStartScrollTop.current = scrollRef.current?.scrollTop || 0;
    };

    useEffect(() => {
        if (!isDragging) return;

        const handleMouseMove = (e: MouseEvent) => {
            const el = scrollRef.current;
            if (!el) return;

            const { scrollHeight, clientHeight } = el;
            const trackHeight = clientHeight;
            const deltaY = e.clientY - dragStartY.current;
            const scrollDelta = (deltaY / (trackHeight - thumbHeight)) * (scrollHeight - clientHeight);
            el.scrollTop = dragStartScrollTop.current + scrollDelta;
        };

        const handleMouseUp = () => setIsDragging(false);

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };
    }, [isDragging, thumbHeight]);

    const overflowClass = {
        vertical: "overflow-y-auto overflow-x-hidden",
        horizontal: "overflow-x-auto overflow-y-hidden",
        both: "overflow-auto",
    };

    return (
        <div
            className={cn("relative group", className)}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <div
                ref={scrollRef}
                onScroll={handleScroll}
                className={cn(
                    overflowClass[orientation],
                    "scrollbar-none overscroll-contain",
                )}
                style={{ maxHeight }}
            >
                {children}
            </div>

            {(orientation === "vertical" || orientation === "both") && thumbHeight > 0 && (
                <div
                    className={cn(
                        "absolute top-0 right-0 w-2 h-full transition-opacity duration-300 z-10",
                        showScrollbar ? "opacity-100" : "opacity-0",
                    )}
                >
                    <div
                        ref={thumbRef}
                        onMouseDown={handleThumbMouseDown}
                        className={cn(
                            "absolute right-0.5 w-1.5 rounded-full transition-all duration-150",
                            isDragging
                                ? "bg-(--color-text-disabled) w-2"
                                : "bg-(--color-text-disabled)/50 hover:bg-(--color-text-disabled) hover:w-2",
                        )}
                        style={{
                            height: thumbHeight,
                            top: thumbTop,
                        }}
                    />
                </div>
            )}
        </div>
    );
}

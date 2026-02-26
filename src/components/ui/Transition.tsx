
import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/utils/util";

export interface TransitionProps {
    show: boolean;
    children: React.ReactNode;
    className?: string;
    enter?: string;
    enterFrom?: string;
    enterTo?: string;
    leave?: string;
    leaveFrom?: string;
    leaveTo?: string;
    duration?: number;
    unmount?: boolean;
}

export function Transition({
    show,
    children,
    className,
    enter = "transition-all duration-200 ease-out",
    enterFrom = "opacity-0 scale-95 translate-y-1",
    enterTo = "opacity-100 scale-100 translate-y-0",
    leave = "transition-all duration-150 ease-in",
    leaveFrom = "opacity-100 scale-100 translate-y-0",
    leaveTo = "opacity-0 scale-95 translate-y-1",
    duration = 200,
    unmount = true,
}: TransitionProps) {
    const [mounted, setMounted] = useState(show);
    const [stage, setStage] = useState<"enter" | "entered" | "leave" | "left">(
        show ? "entered" : "left",
    );
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        if (show) {
            setMounted(true);
            setStage("enter");
            
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setStage("entered");
                });
            });
        } else {
            setStage("leave");
            timeoutRef.current = setTimeout(() => {
                setStage("left");
                if (unmount) setMounted(false);
            }, duration);
        }

        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [show, duration, unmount]);

    if (!mounted && unmount) return null;

    const transitionClass = (() => {
        switch (stage) {
            case "enter":
                return cn(enter, enterFrom);
            case "entered":
                return cn(enter, enterTo);
            case "leave":
                return cn(leave, leaveTo);
            case "left":
                return cn(leave, leaveTo);
            default:
                return "";
        }
    })();

    return (
        <div className={cn(transitionClass, className)}>
            {children}
        </div>
    );
}

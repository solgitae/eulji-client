"use client"

import { useSidebar } from "@/store/useSidebar";
import Sidebar from "./ui/Sidebar";
import Breadcrumb from "./ui/Breadcrumb";
import { useBreadcrumbStore } from "@/store/useBreadcrumb";
import { CommandBar, useDefaultCommands } from "./ui/CommandBar";
import { PanelLeft } from "lucide-react";
import KakaoTalkFab from "./ui/KakaoTalkFab";
import { LayoutHeaderProfile } from "./ui/LayoutHeaderProfile";

export function Layout({ children }: { children: React.ReactNode }) {
    const { toggle, width, setWidth, isResizing, setIsResizing } = useSidebar();
    const items = useBreadcrumbStore((state) => state.items);
    const commands = useDefaultCommands();

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsResizing(true);

        const handleMouseMove = (moveEvent: MouseEvent) => {
            setWidth(moveEvent.clientX - 0); 
        };

        const handleMouseUp = () => {
            setIsResizing(false);
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);
    };

    return (
        <div className="flex h-full bg-(--color-bg-primary) overflow-hidden">
            <div className="shrink-0 h-full"><Sidebar /></div>
            <CommandBar items={commands} />
            <div className="w-full h-full overflow-auto p-2 pl-0">
                <div className="relative bg-(--color-bg-secondary) border border-(--color-border) overflow-hidden rounded-md h-full flex flex-col">
                    
                    <header className="h-12 px-4 flex items-center justify-between border-b border-(--color-border) shrink-0 bg-(--color-bg-secondary)">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggle}
                                className="p-1 hover:bg-(--color-bg-hover) rounded-md transition-colors text-(--color-icon-secondary) hover:text-(--color-text-primary)"
                            >
                                <PanelLeft size={16} />
                            </button>
                            <Breadcrumb items={items} />
                        </div>
                        <LayoutHeaderProfile />
                    </header>

                    <div className="flex-1 relative overflow-auto">
                        {children}
                    </div>
                </div>
            </div>
            {/* Kakao 1:1 Chat FAB  */}
            <KakaoTalkFab />
        </div>
    );
}

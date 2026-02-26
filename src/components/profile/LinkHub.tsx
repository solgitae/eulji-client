import React from "react";
import { cn } from "@/utils/util";

export function LinkHubHeader({ name, slogan, avatarUrl }: { name: string; slogan?: string; avatarUrl?: string }) {
    return (
        <header className="flex flex-col items-center gap-4 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <div className="w-24 h-24 rounded-full bg-(--color-bg-tertiary) border border-(--color-border) flex items-center justify-center overflow-hidden shadow-inner">
                {avatarUrl ? (
                    <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full bg-linear-to-br from-(--color-bg-tertiary) to-(--color-bg-secondary) flex items-center justify-center font-bold text-2xl text-(--color-text-tertiary)">
                        {name.charAt(0)}
                    </div>
                )}
            </div>
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight text-(--color-text-primary)">
                    {name}
                </h1>
                {slogan && (
                    <p className="text-[14px] font-medium text-(--color-text-secondary) max-w-xs leading-relaxed">
                        {slogan}
                    </p>
                )}
            </div>
        </header>
    );
}

export function LinkHubButton({ label, href, icon: Icon }: { label: string; href: string; icon?: any }) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
                "group w-full max-w-md py-4 px-6 rounded-xl",
                "bg-(--color-bg-primary) border border-(--color-border)",
                "flex items-center justify-center relative",
                "hover:bg-(--color-bg-tertiary) hover:border-(--color-text-tertiary)",
                "active:scale-[0.98] transition-all duration-200",
                "shadow-sm hover:shadow-md"
            )}
        >
            {Icon && <Icon className="w-4 h-4 absolute left-6 text-(--color-text-tertiary) group-hover:text-(--color-text-primary) transition-colors" />}
            <span className="text-[14px] font-semibold text-(--color-text-primary) tracking-wide">
                {label}
            </span>
        </a>
    );
}

export function LinkHubFooter({ contactInfo, address, copyright }: { contactInfo: string; address: string; copyright: string }) {
    return (
        <footer className="mt-12 py-10 w-full max-w-md border-t border-(--color-border)/50 text-center space-y-4 animate-in fade-in duration-1000">
            <div className="space-y-1">
                <p className="text-[12px] font-medium text-(--color-text-tertiary)">{contactInfo}</p>
                <p className="text-[11px] text-(--color-text-disabled) leading-snug px-4">{address}</p>
            </div>
            <p className="text-[11px] font-bold text-(--color-text-disabled) uppercase tracking-tighter pt-4">
                {copyright}
            </p>
        </footer>
    );
}

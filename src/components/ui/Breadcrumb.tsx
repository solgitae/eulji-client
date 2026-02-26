import React from "react";
import { ChevronRight } from "lucide-react";
import { cn } from "@/utils/util";

export interface BreadcrumbItem {
    label: string;
    href?: string;
    active?: boolean;
}

export interface BreadcrumbProps {
    items: BreadcrumbItem[];
    className?: string;
    separator?: React.ReactNode;
}

const Breadcrumb = ({ items, className, separator }: BreadcrumbProps) => {
    return (
        <nav 
            aria-label="Breadcrumb" 
            className={cn("flex items-center text-sm", className)}
        >
            <ol className="flex items-center flex-wrap gap-1.5">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    const isActive = item.active || isLast;

                    return (
                        <li key={item.label} className="flex items-center gap-1.5">
                            {item.href && !isActive ? (
                                <a
                                    href={item.href}
                                    className="text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors duration-100"
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <span
                                    className={cn(
                                        "font-medium",
                                        isActive ? "text-(--color-text-primary)" : "text-(--color-text-tertiary)"
                                    )}
                                >
                                    {item.label}
                                </span>
                            )}
                            
                            {!isLast && (
                                <span className="text-(--color-text-disabled) flex items-center justify-center">
                                    {separator || <ChevronRight className="w-3.5 h-3.5" strokeWidth={2.5} />}
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumb;

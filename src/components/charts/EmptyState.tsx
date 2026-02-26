import { cn } from "@/utils/util";

interface EmptyStateProps {
    message?: string;
    icon?: React.ReactNode;
    className?: string;
}

export function EmptyState({ message = "아직 데이터가 없습니다", icon, className }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center h-full w-full gap-2", className)}>
            {icon && <div className="text-(--color-icon-secondary)">{icon}</div>}
            <span className="text-[13px] text-(--color-text-tertiary) text-center">
                {message}
            </span>
        </div>
    );
}

export function EmptyDonut({ message = "데이터 없음" }: { message?: string }) {
    return (
        <div className="relative shrink-0 w-[110px] h-[110px]">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="var(--color-bg-tertiary)"
                    strokeWidth="20"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[11px] font-medium text-(--color-text-tertiary) mt-0.5">
                    {message}
                </span>
            </div>
        </div>
    );
}


import { cn } from "@/utils/util";

interface CircularProgressProps {
    value: number; // 0 to 100
    size?: number;
    strokeWidth?: number;
    className?: string;
    showLabel?: boolean;
    segments?: { value: number; color: string; label: string }[];
}

export function CircularProgress({
    value,
    size = 40,
    strokeWidth = 4,
    className,
    showLabel = false,
    segments,
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (value / 100) * circumference;

    return (
        <div 
            className={cn("relative inline-flex items-center justify-center", className)}
            style={{ width: size, height: size }}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-(--color-border)"
                />
                
                {segments ? (
                    // Multi-segment progress (Linear style for cycles)
                    <>
                        {segments.reduce((acc, segment, i) => {
                            const segmentCircumference = (segment.value / 100) * circumference;
                            const segmentOffset = circumference - segmentCircumference - acc.totalOffset;
                            
                            const element = (
                                <circle
                                    key={i}
                                    cx={size / 2}
                                    cy={size / 2}
                                    r={radius}
                                    stroke={segment.color}
                                    strokeWidth={strokeWidth}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={segmentOffset}
                                    fill="transparent"
                                    strokeLinecap="round"
                                    className="transition-all duration-500 ease-out"
                                />
                            );
                            
                            acc.totalOffset += segmentCircumference;
                            acc.elements.push(element);
                            return acc;
                        }, { totalOffset: 0, elements: [] as React.ReactNode[] }).elements}
                    </>
                ) : (
                    // Simple single value progress
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="currentColor"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        fill="transparent"
                        strokeLinecap="round"
                        className="text-(--color-accent) transition-all duration-500 ease-out"
                    />
                )}
            </svg>
            {showLabel && !segments && (
                <span className="absolute text-[10px] font-bold text-(--color-text-primary)">
                    {Math.round(value)}%
                </span>
            )}
        </div>
    );
}

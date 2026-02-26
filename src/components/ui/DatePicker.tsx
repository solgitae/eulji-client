
import React, { useState, useMemo, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/util";

const DAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

const MONTHS_KO = [
    "1월", "2월", "3월", "4월", "5월", "6월",
    "7월", "8월", "9월", "10월", "11월", "12월",
];

function getDaysInMonth(year: number, month: number) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
    return new Date(year, month, 1).getDay();
}

function isSameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

function isToday(date: Date) {
    return isSameDay(date, new Date());
}

export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date) => void;
    className?: string;
}

export function DatePicker({ value, onChange, className }: DatePickerProps) {
    const today = new Date();
    const [viewYear, setViewYear] = useState(value?.getFullYear() || today.getFullYear());
    const [viewMonth, setViewMonth] = useState(value?.getMonth() ?? today.getMonth());

    const daysInMonth = useMemo(() => getDaysInMonth(viewYear, viewMonth), [viewYear, viewMonth]);
    const firstDay = useMemo(() => getFirstDayOfMonth(viewYear, viewMonth), [viewYear, viewMonth]);

    const prevMonth = useCallback(() => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    }, [viewMonth]);

    const nextMonth = useCallback(() => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    }, [viewMonth]);

    const handleSelect = (day: number) => {
        const selected = new Date(viewYear, viewMonth, day);
        onChange?.(selected);
    };

    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div className={cn("w-[280px] p-3 rounded-xl bg-(--color-bg-secondary) border border-(--color-border) shadow-(--shadow-card)", className)}>
            
            <div className="flex items-center justify-between mb-3">
                <button
                    onClick={prevMonth}
                    className="p-1 rounded-md hover:bg-(--color-bg-hover) text-(--color-text-tertiary) transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm font-semibold text-(--color-text-primary)">
                    {viewYear}년 {MONTHS_KO[viewMonth]}
                </span>
                <button
                    onClick={nextMonth}
                    className="p-1 rounded-md hover:bg-(--color-bg-hover) text-(--color-text-tertiary) transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="grid grid-cols-7 mb-1">
                {DAYS_KO.map((d) => (
                    <div key={d} className="text-center text-xs font-medium text-(--color-text-disabled) py-1">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7">
                {cells.map((day, i) => {
                    if (day === null) {
                        return <div key={`empty-${i}`} />;
                    }

                    const date = new Date(viewYear, viewMonth, day);
                    const selected = value ? isSameDay(date, value) : false;
                    const todayMark = isToday(date);

                    return (
                        <button
                            key={day}
                            onClick={() => handleSelect(day)}
                            className={cn(
                                "relative w-9 h-9 rounded-lg text-sm transition-colors duration-75",
                                "flex items-center justify-center mx-auto",
                                "hover:bg-(--color-bg-hover)",
                                selected
                                    ? "bg-(--color-accent) text-(--color-text-on-accent) hover:bg-(--color-accent-hover) font-semibold"
                                    : "text-(--color-text-secondary)",
                                todayMark && !selected && "font-semibold text-(--color-accent)",
                            )}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

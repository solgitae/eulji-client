
import React from "react";
import { cn } from "@/utils/util";

export function ClientsTableHeaderRow() {
    return (
        <div className="grid grid-cols-[36px,40px,minmax(0,2.5fr),minmax(0,1fr),140px,140px,120px,120px] items-center gap-4 px-4 py-2 bg-(--color-bg-tertiary) border-b border-(--color-border) text-[11px] font-bold uppercase tracking-wider text-(--color-text-tertiary) sticky top-0 z-10">
            <div className="flex justify-center">
                <input type="checkbox" className="accent-(--color-accent) w-3.5 h-3.5 rounded border-(--color-border)" />
            </div>
            <div /> {/* Icon column header */}
            <div>Name</div>
            <div>Company</div>
            <div className="text-right">Total Revenue</div>
            <div className="text-right">Unpaid</div>
            <div className="text-center">Evaluation</div>
            <div className="text-center">Tag</div>
        </div>
    );
}

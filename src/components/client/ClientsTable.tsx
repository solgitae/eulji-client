
import React from "react";
import { ClientsTableHeaderRow } from "./ClientsTableHeaderRow";
import { ClientRow } from "./ClientRow";
import { Skeleton } from "@/components/ui/Skeleton";
import { Inbox } from "lucide-react";

interface ClientsTableProps {
    clients: any[];
    isLoading: boolean;
    selectedIds: string[];
    onToggleSelect: (id: string) => void;
    onRowClick: (client: any) => void;
    emptyDescription?: string;
}

const ClientsTableSkeleton = () => (
    <div className="divide-y divide-(--color-border)">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="grid grid-cols-[36px,40px,minmax(0,2.5fr),minmax(0,1fr),140px,140px,120px,120px] items-center gap-4 px-4 py-3">
                <div className="flex justify-center"><Skeleton className="w-3.5 h-3.5 rounded" /></div>
                <div className="flex justify-center"><Skeleton className="w-8 h-8 rounded-lg" /></div>
                <div className="space-y-1.5"><Skeleton className="w-3/4 h-3.5" /><Skeleton className="w-1/2 h-2.5 opacity-50" /></div>
                <div><Skeleton className="w-20 h-3" /></div>
                <div><Skeleton className="w-24 h-4 ml-auto" /></div>
                <div><Skeleton className="w-20 h-4 ml-auto" /></div>
                <div><Skeleton className="w-16 h-5 mx-auto rounded-md" /></div>
                <div><Skeleton className="w-12 h-4 mx-auto rounded" /></div>
            </div>
        ))}
    </div>
);

export function ClientsTable({ 
    clients, 
    isLoading, 
    selectedIds, 
    onToggleSelect, 
    onRowClick,
    emptyDescription 
}: ClientsTableProps) {
    return (
        <div className="flex flex-col h-full bg-(--color-bg-primary) border border-(--color-border) rounded-xl overflow-hidden shadow-sm mx-4 mb-4 mt-2">
            <ClientsTableHeaderRow />
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {isLoading ? (
                    <ClientsTableSkeleton />
                ) : clients.length > 0 ? (
                    <div className="divide-y divide-(--color-border)">
                        {clients.map((client) => (
                            <ClientRow
                                key={client.id}
                                client={client}
                                isSelected={selectedIds.includes(client.id)}
                                onToggleSelect={() => onToggleSelect(client.id)}
                                onClick={() => onRowClick(client)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="h-[400px] flex flex-col items-center justify-center text-center p-10 animate-in fade-in duration-500">
                        <div className="w-16 h-16 rounded-full bg-(--color-bg-secondary) flex items-center justify-center mb-6 opacity-40">
                            <Inbox className="w-8 h-8 text-(--color-text-tertiary)" />
                        </div>
                        <h3 className="text-[18px] font-bold text-(--color-text-primary) tracking-tight mb-2">클라이언트가 없습니다</h3>
                        <p className="text-[13px] text-(--color-text-tertiary) max-w-[280px] leading-relaxed">
                            {emptyDescription || "새로운 클라이언트를 추가하여 시작해 보세요."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

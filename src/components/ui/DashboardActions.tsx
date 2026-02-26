
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/util";
import { useToast } from "@/components/ui/Toast";
import { CheckCircle, XCircle } from "lucide-react";

interface DashboardInvoice {
    id: string;
    title: string;
    amount: number;
    status: string;
    due_date: string | null;
    projects?: {
        name?: string;
        clients?: { name?: string };
    };
}

interface DashboardActionsProps {
    initialInvoices: DashboardInvoice[];
    today: string;
}

export function DashboardActions({ initialInvoices, today }: DashboardActionsProps) {
    const { toast, error: toastError } = useToast();
    const [invoices, setInvoices] = useState<DashboardInvoice[]>(initialInvoices);

    const handleMarkPaid = async (inv: DashboardInvoice, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // Optimistic
        setInvoices(prev => prev.filter(i => i.id !== inv.id));
        try {
            const res = await fetch(`/api/invoices/${inv.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "PAID" }),
            });
            if (!res.ok) throw new Error("Failed");
            toast(`"${inv.title}" 입금 처리 완료`);
        } catch (err) {
            console.error(err);
            toastError("입금 처리에 실패했습니다.");
            setInvoices(prev => [...prev, inv]);
        }
    };

    const handleMarkLoss = async (inv: DashboardInvoice, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!confirm(`"${inv.title}" 건을 손실 처리하시겠습니까?`)) return;
        // Optimistic
        setInvoices(prev => prev.filter(i => i.id !== inv.id));
        try {
            const res = await fetch(`/api/invoices/${inv.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: "LOSS" }),
            });
            if (!res.ok) throw new Error("Failed");
            toast(`"${inv.title}" 손실 처리 완료`);
        } catch (err) {
            console.error(err);
            toastError("손실 처리에 실패했습니다.");
            setInvoices(prev => [...prev, inv]);
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PAID': return <span className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">PAID</span>;
            case 'ISSUED': return <span className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">ISSUED</span>;
            case 'PARTIAL': return <span className="text-[11px] font-bold text-blue-500 uppercase tracking-wider">PARTIAL</span>;
            case 'DRAFT': return <span className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wider">DRAFT</span>;
            case 'LOSS': return <span className="text-[11px] font-bold text-red-500 uppercase tracking-wider">LOSS</span>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col border border-(--color-border) rounded-lg overflow-hidden bg-(--color-bg-primary)">
            {invoices.length > 0 ? (
                <div className="divide-y divide-(--color-border)">
                    {invoices.slice(0, 10).map((inv) => {
                        const isOverdue = inv.due_date && inv.due_date < today;
                        return (
                            <Link
                                to="/dashboard/invoices"
                                key={inv.id}
                                className="flex flex-row items-center p-4 hover:bg-(--color-bg-hover) transition-colors group"
                            >
                                <div className="flex-1 flex flex-col gap-0.5">
                                    <span className="text-[13px] font-bold text-(--color-text-primary) leading-snug">{inv.title}</span>
                                    <span className="text-[11px] text-(--color-text-tertiary) font-medium">
                                        {inv.projects?.clients?.name} · {inv.projects?.name}
                                    </span>
                                </div>

                                <div className="w-[100px] flex flex-col gap-0.5">
                                    <span className="text-[11px] text-(--color-text-tertiary) font-bold uppercase tracking-wider">Due</span>
                                    <span className={cn(
                                        "text-[13px] font-medium",
                                        isOverdue ? "text-(--color-danger)" : "text-(--color-text-secondary)"
                                    )}>
                                        {inv.due_date || "—"}
                                    </span>
                                </div>

                                <div className="w-[100px] flex items-center">
                                    {getStatusText(inv.status)}
                                </div>

                                <div className="w-[100px] text-right">
                                    <span className="text-[13px] font-bold text-(--color-text-primary) font-mono">
                                        ₩{inv.amount.toLocaleString()}
                                    </span>
                                </div>

                                {/* Quick Action Buttons */}
                                <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleMarkPaid(inv, e)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors cursor-pointer"
                                        title="입금 처리"
                                    >
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        입금
                                    </button>
                                    <button
                                        onClick={(e) => handleMarkLoss(inv, e)}
                                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 transition-colors cursor-pointer"
                                        title="손실 처리"
                                    >
                                        <XCircle className="w-3.5 h-3.5" />
                                        손실
                                    </button>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            ) : (
                <div className="p-8 flex flex-col items-center justify-center text-center">
                    <h3 className="text-[13px] font-bold text-(--color-text-primary) mb-1">No outstanding invoices</h3>
                    <p className="text-[11px] text-(--color-text-tertiary) font-medium">All payments are up to date.</p>
                </div>
            )}
        </div>
    );
}

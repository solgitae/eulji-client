import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Link } from "react-router-dom";
import { DashboardActions } from "@/components/ui/DashboardActions";

export default function DashboardPage() {
    console.log("[DashboardPage] Rendering");
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<{
        totalOverdue: number;
        totalOutstanding: number;
        totalPaid: number;
        overdueInvoices: any[];
        outstandingInvoices: any[];
        today: string;
    } | null>(null);

    const supabase = createClient();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const todayStr = new Date().toISOString().split('T')[0];

            const [invoicesRes] = await Promise.all([
                supabase.from("invoices")
                    .select("id, title, amount, status, due_date, projects(name, clients(name))")
                    .order('due_date', { ascending: true }),
            ]);
            
            const allInvoices = (invoicesRes.data ?? []) as any[];

            // Calculate metrics
            const outstandingItems = allInvoices.filter(i => i.status !== 'PAID' && i.status !== 'LOSS');
            const totalOutstanding = outstandingItems.reduce((acc, curr) => acc + (curr.amount || 0), 0);
            
            const overdueItems = outstandingItems.filter(i => i.due_date && i.due_date < todayStr);
            const totalOverdue = overdueItems.reduce((acc, curr) => acc + (curr.amount || 0), 0);

            const paidItems = allInvoices.filter(i => i.status === 'PAID');
            const totalPaid = paidItems.reduce((acc, curr) => acc + (curr.amount || 0), 0);

            setData({
                totalOverdue,
                totalOutstanding,
                totalPaid,
                overdueInvoices: overdueItems,
                outstandingInvoices: outstandingItems,
                today: todayStr
            });
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center w-full h-full bg-(--color-bg-primary)">
                <div className="animate-pulse text-sm text-(--color-text-tertiary)">대시보드 데이터를 불러오는 중...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col w-full h-full bg-(--color-bg-primary) overflow-auto">
            {/* Header Area */}
            <div className="flex flex-col px-8 py-10 gap-1 border-b border-(--color-border)">
                <h1 className="text-[20px] leading-tight font-bold text-(--color-text-primary) tracking-tight">Overview</h1>
                <p className="text-[13px] text-(--color-text-tertiary)">Financial status and outstanding invoices.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 border-b border-(--color-border) bg-(--color-bg-secondary)">
                <div className="flex flex-col justify-center p-8 border-r border-(--color-border) bg-(--color-bg-primary)">
                    <span className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wider mb-3">Overdue</span>
                    <div className="text-[24px] font-bold text-(--color-danger) tracking-tight font-mono">
                        ₩{data.totalOverdue.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-(--color-text-tertiary) mt-2 font-medium">{data.overdueInvoices.length} invoices</span>
                </div>

                <div className="flex flex-col justify-center p-8 border-r border-(--color-border) bg-(--color-bg-primary)">
                    <span className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wider mb-3">Outstanding</span>
                    <div className="text-[24px] font-bold text-(--color-text-primary) tracking-tight font-mono">
                        ₩{data.totalOutstanding.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-(--color-text-tertiary) mt-2 font-medium">Awaiting payment</span>
                </div>

                <div className="flex flex-col justify-center p-8 bg-(--color-bg-primary)">
                    <span className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wider mb-3">Paid</span>
                    <div className="text-[24px] font-bold text-(--color-text-primary) tracking-tight font-mono">
                        ₩{data.totalPaid.toLocaleString()}
                    </div>
                    <span className="text-[11px] text-(--color-text-tertiary) mt-2 font-medium">Total collected</span>
                </div>
            </div>

            {/* Outstanding List */}
            <div className="flex flex-col px-8 py-10 w-full max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-[13px] font-bold text-(--color-text-primary)">Outstanding Invoices</h2>
                    <Link to="/dashboard/invoices" className="text-[13px] text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors">
                        View all
                    </Link>
                </div>

                <DashboardActions initialInvoices={data.outstandingInvoices} today={data.today} />
            </div>
        </div>
    );
}


import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/utils/util";
import Input from "./Input";
import { DropdownSelect } from "./Dropdown";
import { Combobox, ComboboxOption } from "./Combobox";
import { DatePickerInput } from "./DatePickerInput";
import { ProjectCreateDialog } from "./ProjectCreateDialog";
import type { Project } from "./ProjectCreateDialog";
import type { Client } from "./ClientCreateDialog";
import { Link } from "react-router-dom";
import { Printer } from "lucide-react";

export interface Invoice {
    id: string;
    user_id: string;
    project_id: string;
    title: string;
    amount: number;
    billing_date: string | null;
    due_date: string | null;
    status: "DRAFT" | "ISSUED" | "PARTIAL" | "PAID" | "LOSS";
    paid_amount?: number; // computed from payments
    created_at: string;
    updated_at: string;
    projects?: Project; // joined
}

interface InvoiceCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (data: Invoice) => void;
    invoice?: Invoice | null;
}

const STATUS_OPTIONS = [
    { value: "DRAFT", label: "청구 전" },
    { value: "ISSUED", label: "청구됨" },
    { value: "PARTIAL", label: "부분 지급" },
    { value: "PAID", label: "완납" },
    { value: "LOSS", label: "손실 처리" },
];

export function InvoiceCreateDialog({
    isOpen,
    onClose,
    onCreate,
    invoice,
}: InvoiceCreateDialogProps) {
    const [isViewMode, setIsViewMode] = useState(!!invoice);
    
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState(invoice?.project_id || "");
    const [title, setTitle] = useState(invoice?.title || "");
    const [amount, setAmount] = useState(invoice?.amount ? Number(invoice.amount).toLocaleString() : "");
    const [billingDate, setBillingDate] = useState(invoice?.billing_date || "");
    const [dueDate, setDueDate] = useState(invoice?.due_date || "");
    const [status, setStatus] = useState(invoice?.status || "DRAFT");
    const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false);

    // Client cascade state
    const [clients, setClients] = useState<Client[]>([]);
    const [selectedClientId, setSelectedClientId] = useState<string>("");
    const [showAllProjects, setShowAllProjects] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetch("/api/projects")
                .then(res => res.json())
                .then(data => setProjects(data || []))
                .catch(err => console.error("Failed to fetch projects", err));
            fetch("/api/clients")
                .then(res => res.json())
                .then(data => setClients(data || []))
                .catch(err => console.error("Failed to fetch clients", err));
        }
    }, [isOpen]);

    const clientOptions: ComboboxOption[] = clients.map(c => ({
        value: c.id,
        label: c.name,
        description: c.company || undefined,
    }));

    // Cascade: filter projects by selected client
    const filteredProjects = selectedClientId && !showAllProjects
        ? projects.filter(p => p.client_id === selectedClientId)
        : projects;

    const projectOptions: ComboboxOption[] = filteredProjects.map(p => ({
        value: p.id,
        label: p.name,
        description: p.clients?.name || undefined,
    }));

    useEffect(() => {
        if (isOpen) {
            setIsViewMode(!!invoice);
            setProjectId(invoice?.project_id || "");
            setTitle(invoice?.title || "");
            setAmount(invoice?.amount ? Number(invoice.amount).toLocaleString() : "");
            setBillingDate(invoice?.billing_date || "");
            setDueDate(invoice?.due_date || "");
            setStatus(invoice?.status || "DRAFT");
            // Set client from invoice's project
            setSelectedClientId(invoice?.projects?.client_id || "");
            setShowAllProjects(false);
        }
    }, [isOpen, invoice]);

    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!title.trim() || !projectId || !amount) {
            alert("프로젝트, 청구명, 금액을 모두 입력해주세요.");
            return;
        }

        const payload = {
            project_id: projectId,
            title,
            amount: Number(amount.replace(/[^0-9]/g, "")),
            billing_date: billingDate || null,
            due_date: dueDate || null,
            status,
        };

        try {
            const url = invoice ? `/api/invoices/${invoice.id}` : "/api/invoices";
            const method = invoice ? "PUT" : "POST"; 
            const res = await fetch(url, {
                method: method, 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save invoice");
            
            const savedInvoice = await res.json();
            onCreate?.(savedInvoice);
        } catch (error) {
            console.error("Error saving invoice:", error);
            alert("인보이스 저장에 실패했습니다.");
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (!value) {
            setAmount("");
            return;
        }
        setAmount(Number(value).toLocaleString());
    };

    return (
        <>
        <div className="fixed inset-0 z-100 flex items-center justify-center animate-in fade-in duration-200">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-(--color-bg-primary) border border-(--color-border) shadow-(--shadow-elevated) rounded-xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                
                <div className="flex items-center justify-between px-4 h-12 border-b border-(--color-border)">
                    <div className="flex items-center gap-2 text-[13px] text-(--color-text-tertiary)">
                        <span className="text-(--color-text-primary) font-medium">
                            {invoice ? (isViewMode ? "인보이스 상세" : "인보이스 편집") : "새 청구 생성"}
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 -mr-1 hover:bg-(--color-bg-hover) rounded transition-colors text-(--color-text-tertiary) hover:text-(--color-text-primary)"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-4">
                    <div className="space-y-1">
                        {isViewMode ? (
                            <div className="text-xl font-bold text-(--color-text-primary)">
                                {title}
                            </div>
                        ) : (
                            <input
                                autoFocus
                                placeholder="청구명 (예: 1차 중도금)"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full bg-transparent text-xl font-bold text-(--color-text-primary) placeholder-(--color-text-disabled) outline-none border-none p-0 focus:ring-0"
                            />
                        )}
                    </div>

                    <div className="space-y-3 pt-2">
                        {/* Client Combobox (cascade filter) */}
                        {!isViewMode && (
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                    클라이언트 (필터)
                                </label>
                                <Combobox
                                    options={clientOptions}
                                    value={selectedClientId}
                                    onChange={(val) => {
                                        setSelectedClientId(val);
                                        setProjectId(""); // Reset project when client changes
                                        setShowAllProjects(false);
                                    }}
                                    placeholder="클라이언트로 필터..."
                                    searchPlaceholder="이름 또는 회사명 검색"
                                    emptyMessage="일치하는 클라이언트가 없습니다."
                                />
                                {selectedClientId && (
                                    <button
                                        type="button"
                                        onClick={() => setShowAllProjects(!showAllProjects)}
                                        className="text-[11px] text-(--color-text-tertiary) hover:text-(--color-accent) transition-colors"
                                    >
                                        {showAllProjects ? "← 선택한 클라의 프로젝트만" : "모든 프로젝트 보기"}
                                    </button>
                                )}
                            </div>
                        )}
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                대상 프로젝트
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">
                                    {invoice?.projects?.name || "—"}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    <Combobox
                                        options={projectOptions}
                                        value={projectId}
                                        onChange={setProjectId}
                                        placeholder="프로젝트 검색..."
                                        searchPlaceholder="프로젝트명 또는 클라이언트 검색"
                                        emptyMessage="일치하는 프로젝트가 없습니다."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsProjectDialogOpen(true)}
                                        className="flex items-center gap-1 text-[12px] text-(--color-accent) hover:text-(--color-accent-hover) transition-colors self-start"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        새 프로젝트
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                상태
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{STATUS_OPTIONS.find(o => o.value === status)?.label || status}</div>
                            ) : (
                                <DropdownSelect
                                    value={status}
                                    onChange={(val) => setStatus(val as any)}
                                    options={STATUS_OPTIONS}
                                />
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                청구 금액
                            </label>
                            {isViewMode ? (
                                <div className="text-[15px] font-bold text-(--color-accent) h-8 flex items-center">
                                    {invoice?.amount ? `₩ ${Number(invoice.amount).toLocaleString()}` : "—"}
                                </div>
                            ) : (
                                <Input
                                    variant="currency"
                                    placeholder="0"
                                    value={amount}
                                    onChange={handleAmountChange}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                    청구일
                                </label>
                                {isViewMode ? (
                                    <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{billingDate || "—"}</div>
                                ) : (
                                    <DatePickerInput
                                        value={billingDate}
                                        onChange={setBillingDate}
                                        placeholder="YYYY-MM-DD"
                                    />
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                    지급 기한
                                </label>
                                {isViewMode ? (
                                    <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{dueDate || "—"}</div>
                                ) : (
                                    <DatePickerInput
                                        value={dueDate}
                                        onChange={setDueDate}
                                        placeholder="YYYY-MM-DD"
                                    />
                                )}
                            </div>
                        </div>

                    </div>
                </div>

                <div className="px-4 h-14 border-t border-(--color-border) flex items-center justify-end gap-2 bg-(--color-bg-secondary)/20">
                    {isViewMode ? (
                        <div className="flex w-full justify-between items-center">
                            {invoice && (
                                <Link to={`/dashboard/invoices/${invoice.id}/print`} target="_blank">
                                    <button
                                        type="button"
                                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) bg-(--color-bg-secondary) hover:bg-(--color-bg-hover) rounded transition-all border border-(--color-border)"
                                    >
                                        <Printer className="w-3.5 h-3.5" />
                                        인쇄 / PDF 발급
                                    </button>
                                </Link>
                            )}
                            <div className="flex gap-2">
                                <button
                                    onClick={onClose}
                                    className="px-3 py-1.5 text-[12px] font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) transition-all"
                                >
                                    닫기
                                </button>
                                <button
                                    onClick={() => setIsViewMode(false)}
                                    className="px-4 h-8 text-[12px] font-bold text-(--color-text-primary) hover:text-(--color-text-primary) border border-(--color-border) bg-(--color-bg-primary) hover:bg-(--color-bg-hover) rounded-md shadow-sm transition-all"
                                >
                                    편집
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    if (invoice) setIsViewMode(true);
                                    else onClose();
                                }}
                                className="px-3 py-1.5 text-[12px] font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) transition-all"
                            >
                                취소
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 h-8 text-[12px] font-bold text-(--color-text-primary) hover:text-(--color-text-primary) border border-(--color-border) bg-(--color-bg-primary) hover:bg-(--color-bg-hover) rounded-md shadow-sm transition-all"
                            >
                                {invoice ? "저장" : "청구 생성"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>

            <ProjectCreateDialog
                isOpen={isProjectDialogOpen}
                onClose={() => setIsProjectDialogOpen(false)}
                onCreate={(newProject) => {
                    setProjects(prev => [newProject, ...prev]);
                    setProjectId(newProject.id);
                    setIsProjectDialogOpen(false);
                }}
            />
        </>
    );
}

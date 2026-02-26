
import React, { useState, useEffect } from "react";
import { X, Plus } from "lucide-react";
import { cn, formatKoreanCurrency } from "@/utils/util";
import Input from "./Input";
import { DropdownSelect } from "./Dropdown";
import { Combobox, ComboboxOption } from "./Combobox";
import { DatePickerInput } from "./DatePickerInput";
import { ClientCreateDialog } from "./ClientCreateDialog";
import type { Client } from "./ClientCreateDialog";

export interface Project {
    id: string;
    user_id: string;
    client_id: string;
    name: string;
    type: string | null;
    start_date: string | null;
    end_date: string | null;
    total_amount: number | null;
    status: string; // 'PLANNED', 'IN_PROGRESS', 'COMPLETED', 'ON_HOLD', 'CANCELLED'
    created_at: string;
    updated_at: string;
    clients?: Client; // joined
}

interface ProjectCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (data: Project) => void;
    project?: Project | null;
}

const TYPE_OPTIONS = [
    { value: "신규 개발", label: "신규 개발" },
    { value: "유지 보수", label: "유지 보수" },
    { value: "긴급 수정", label: "긴급 수정" },
    { value: "디자인", label: "디자인" },
    { value: "기타", label: "기타" },
];

export function ProjectCreateDialog({
    isOpen,
    onClose,
    onCreate,
    project,
}: ProjectCreateDialogProps) {
    const [isViewMode, setIsViewMode] = useState(!!project);
    
    const [clients, setClients] = useState<Client[]>([]);
    const [clientId, setClientId] = useState(project?.client_id || "");
    const [name, setName] = useState(project?.name || "");
    const [type, setType] = useState(project?.type || "");
    const [startDate, setStartDate] = useState(project?.start_date || "");
    const [endDate, setEndDate] = useState(project?.end_date || "");
    const [totalAmount, setTotalAmount] = useState(
        project?.total_amount ? Number(project.total_amount).toLocaleString() : ""
    );
    const [status, setStatus] = useState(project?.status || "PLANNED");
    const [isClientDialogOpen, setIsClientDialogOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
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

    useEffect(() => {
        if (isOpen) {
            setIsViewMode(!!project);
            setClientId(project?.client_id || "");
            setName(project?.name || "");
            setType(project?.type || "");
            setStartDate(project?.start_date || "");
            setEndDate(project?.end_date || "");
            setTotalAmount(project?.total_amount ? Number(project.total_amount).toLocaleString() : "");
            setStatus(project?.status || "PLANNED");
        }
    }, [isOpen, project]);

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
        if (!name.trim() || !clientId) {
            alert("클라이언트와 프로젝트 이름을 모두 입력해주세요.");
            return;
        }

        const payload = {
            client_id: clientId,
            name,
            type: type || null,
            start_date: startDate || null,
            end_date: endDate || null,
            total_amount: totalAmount ? Number(totalAmount.replace(/[^0-9]/g, "")) : null,
            status,
        };

        try {
            const url = project ? `/api/projects/${project.id}` : "/api/projects";
            const method = project ? "PUT" : "POST"; 
            const res = await fetch(url, {
                method: method, 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save project");
            
            const savedProject = await res.json();
            onCreate?.(savedProject);
        } catch (error) {
            console.error("Error saving project:", error);
            alert("프로젝트 저장에 실패했습니다.");
        }
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, "");
        if (!value) {
            setTotalAmount("");
            return;
        }
        setTotalAmount(Number(value).toLocaleString());
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
                            {project ? (isViewMode ? "프로젝트 상세" : "프로젝트 편집") : "신규 프로젝트"}
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
                                {name}
                            </div>
                        ) : (
                            <input
                                autoFocus
                                placeholder="프로젝트 이름 (예: 통합 백엔드 구축)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent text-xl font-bold text-(--color-text-primary) placeholder-(--color-text-disabled) outline-none border-none p-0 focus:ring-0"
                            />
                        )}
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                클라이언트
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">
                                    {project?.clients?.name || "—"}
                                </div>
                            ) : (
                                <div className="flex flex-col gap-1.5">
                                    <Combobox
                                        options={clientOptions}
                                        value={clientId}
                                        onChange={setClientId}
                                        placeholder="클라이언트 검색..."
                                        searchPlaceholder="이름 또는 회사명 검색"
                                        emptyMessage="일치하는 클라이언트가 없습니다."
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setIsClientDialogOpen(true)}
                                        className="flex items-center gap-1 text-[12px] text-(--color-accent) hover:text-(--color-accent-hover) transition-colors self-start"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        새 클라이언트
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                진행 타입
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{type || "—"}</div>
                            ) : (
                                <DropdownSelect
                                    value={type}
                                    onChange={setType}
                                    options={[{ value: "", label: "(선택 안함)" }, ...TYPE_OPTIONS]}
                                />
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                    시작 시기
                                </label>
                                {isViewMode ? (
                                    <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{startDate || "—"}</div>
                                ) : (
                                    <DatePickerInput
                                        value={startDate}
                                        onChange={setStartDate}
                                        placeholder="YYYY-MM-DD"
                                    />
                                )}
                            </div>
                            <div className="space-y-1.5">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                    종료 시기
                                </label>
                                {isViewMode ? (
                                    <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{endDate || "—"}</div>
                                ) : (
                                    <DatePickerInput
                                        value={endDate}
                                        onChange={setEndDate}
                                        placeholder="YYYY-MM-DD"
                                    />
                                )}
                            </div>
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                전체 견적 (선택)
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] font-semibold text-(--color-accent) h-8 flex items-center">
                                    {project?.total_amount ? `₩ ${Number(project.total_amount).toLocaleString()}` : "미정"}
                                </div>
                            ) : (
                                <Input
                                    variant="currency"
                                    placeholder="0"
                                    value={totalAmount}
                                    onChange={handleAmountChange}
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="px-4 h-14 border-t border-(--color-border) flex items-center justify-end gap-2 bg-(--color-bg-secondary)/20">
                    {isViewMode ? (
                        <>
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
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {
                                    if (project) setIsViewMode(true);
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
                                {project ? "저장" : "생성"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>

            <ClientCreateDialog
                isOpen={isClientDialogOpen}
                onClose={() => setIsClientDialogOpen(false)}
                onCreate={(newClient) => {
                    setClients(prev => [newClient, ...prev]);
                    setClientId(newClient.id);
                    setIsClientDialogOpen(false);
                }}
            />
        </>
    );
}

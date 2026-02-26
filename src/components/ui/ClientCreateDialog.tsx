
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/utils/util";
import Input from "./Input";
import { DropdownSelect } from "./Dropdown";
import PhoneInput from "./PhoneInput";

export interface Client {
    id: string;
    user_id: string;
    name: string;
    company: string | null;
    contact: string | null;
    tag: string | null;
    status: string; // 'ACTIVE', 'PENDING', 'ENDING', 'CLOSED'
    risk_level: string; // 'NORMAL', 'DELAYED', 'STRICT'
    evaluation: string; // 'GOOD', 'NORMAL', 'BAD'
    total_revenue?: number;
    unpaid_amount?: number;
    avg_delay_days?: number;
    created_at: string;
    updated_at: string;
}

interface ClientCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: (data: Client) => void;
    client?: Client | null;
}

const TAG_OPTIONS = [
    { value: "지인/에이전시", label: "지인/에이전시" },
    { value: "직거래", label: "직거래" },
    { value: "위시켓", label: "위시켓" },
    { value: "크몽", label: "크몽" },
    { value: "기타", label: "기타" },
];

export function ClientCreateDialog({
    isOpen,
    onClose,
    onCreate,
    client,
}: ClientCreateDialogProps) {
    const [isViewMode, setIsViewMode] = useState(!!client);
    
    const [name, setName] = useState(client?.name || "");
    const [company, setCompany] = useState(client?.company || "");
    const [contact, setContact] = useState(client?.contact || "");
    const [tag, setTag] = useState(client?.tag || "");
    const [status, setStatus] = useState(client?.status || "ACTIVE");
    const [riskLevel, setRiskLevel] = useState(client?.risk_level || "NORMAL");
    const [evaluation, setEvaluation] = useState(client?.evaluation || "NORMAL");

    useEffect(() => {
        if (isOpen) {
            setIsViewMode(!!client);
            setName(client?.name || "");
            setCompany(client?.company || "");
            setContact(client?.contact || "");
            setTag(client?.tag || "");
            setStatus(client?.status || "ACTIVE");
            setRiskLevel(client?.risk_level || "NORMAL");
            setEvaluation(client?.evaluation || "NORMAL");
        }
    }, [isOpen, client]);

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
        if (!name.trim()) {
            alert("클라이언트 이름을 입력해주세요.");
            return;
        }

        const payload = {
            name,
            company: company || null,
            contact: contact || null,
            tag: tag || null,
            status,
            risk_level: riskLevel,
            evaluation,
        };

        try {
            const url = client ? `/api/clients/${client.id}` : "/api/clients";
            const method = client ? "PUT" : "POST"; 
            const res = await fetch(url, {
                method: method, 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save client");
            
            const savedClient = await res.json();
            onCreate?.(savedClient);
        } catch (error) {
            console.error("Error saving client:", error);
            alert("클라이언트 저장에 실패했습니다.");
        }
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center animate-in fade-in duration-200">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-(--color-bg-primary) border border-(--color-border) shadow-(--shadow-elevated) rounded-xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                
                <div className="flex items-center justify-between px-4 h-12 border-b border-(--color-border)">
                    <div className="flex items-center gap-2 text-[13px] text-(--color-text-tertiary)">
                        <span className="text-(--color-text-primary) font-medium">
                            {client ? (isViewMode ? "클라이언트 상세" : "클라이언트 편집") : "신규 클라이언트"}
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
                                placeholder="김민수 대표"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-transparent text-xl font-bold text-(--color-text-primary) placeholder-(--color-text-disabled) outline-none border-none p-0 focus:ring-0"
                            />
                        )}
                    </div>

                    <div className="space-y-3 pt-2">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                소속/회사
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{company || "—"}</div>
                            ) : (
                                <Input
                                    placeholder="회사명"
                                    value={company}
                                    onChange={(e) => setCompany(e.target.value)}
                                />
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                연락처
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{contact || "—"}</div>
                            ) : (
                                <PhoneInput
                                    placeholder="010-0000-0000"
                                    value={contact}
                                    onChange={setContact}
                                />
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                구분태그
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">{tag || "—"}</div>
                            ) : (
                                <DropdownSelect
                                    value={tag}
                                    onChange={setTag}
                                    options={[{ value: "", label: "(선택 안함)" }, ...TAG_OPTIONS]}
                                />
                            )}
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                내 평가
                            </label>
                            {isViewMode ? (
                                <div className="text-[13px] text-(--color-text-primary) h-8 flex items-center">
                                    {evaluation === "GOOD" ? "좋음" : evaluation === "BAD" ? "별로임" : "보통"}
                                </div>
                            ) : (
                                <DropdownSelect
                                    value={evaluation}
                                    onChange={setEvaluation}
                                    options={[
                                        { value: "GOOD", label: "좋음" },
                                        { value: "NORMAL", label: "보통" },
                                        { value: "BAD", label: "별로임" },
                                    ]}
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
                                    if (client) setIsViewMode(true);
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
                                {client ? "저장" : "생성"}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

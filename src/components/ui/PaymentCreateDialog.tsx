
import React, { useState, useEffect } from "react";
import { X, DollarSign, Calendar, FileText } from "lucide-react";
import { cn } from "@/utils/util";
import Input from "./Input";
import { DatePickerInput } from "./DatePickerInput";
import type { Invoice } from "./InvoiceCreateDialog";

export interface Payment {
    id: string;
    invoice_id: string;
    amount: number;
    payment_date: string;
    memo: string | null;
}

interface PaymentCreateDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate?: () => void;
    invoice: Invoice | null;
}

export function PaymentCreateDialog({
    isOpen,
    onClose,
    onCreate,
    invoice,
}: PaymentCreateDialogProps) {
    const [amount, setAmount] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [memo, setMemo] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Set default amount to remaining balance ideally, but for now just the full amount
    useEffect(() => {
        if (isOpen && invoice) {
            setAmount(invoice.amount ? invoice.amount.toString() : "");
            setPaymentDate(new Date().toISOString().split('T')[0]);
            setMemo("");
            setIsSubmitting(false);
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

    if (!isOpen || !invoice) return null;

    const handleSave = async () => {
        if (!amount || !paymentDate) {
            alert("입금액과 입금일을 모두 입력해주세요.");
            return;
        }

        setIsSubmitting(true);
        const numericAmount = Number(amount.replace(/[^0-9]/g, ""));
        
        const payload = {
            invoice_id: invoice.id,
            amount: numericAmount,
            payment_date: paymentDate,
            memo: memo || null,
        };

        try {
            // 1. Create Payment
            const res = await fetch("/api/payments", {
                method: "POST", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Failed to save payment");
            
            // 2. Proactively update invoice status if it matches or exceeds the invoice amount
            // Currently, this is simplified. A more robust way is to calc sum of all payments on server.
            let newStatus = invoice.status;
            if (numericAmount >= invoice.amount) {
                newStatus = "PAID";
            } else if (numericAmount > 0 && invoice.status === "ISSUED" || invoice.status === "DRAFT") {
                newStatus = "PARTIAL";
            }

            if (newStatus !== invoice.status) {
                await fetch(`/api/invoices/${invoice.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: newStatus }),
                });
            }

            onCreate?.();
        } catch (error) {
            console.error("Error saving payment:", error);
            alert("입금 내역 저장에 실패했습니다.");
        } finally {
            setIsSubmitting(false);
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
        <div className="fixed inset-0 z-100 flex items-center justify-center animate-in fade-in duration-200">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
                onClick={onClose}
            />

            <div className="relative w-full max-w-sm bg-(--color-bg-primary) border border-(--color-border) shadow-(--shadow-elevated) rounded-xl flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                
                <div className="flex items-center justify-between px-4 h-12 border-b border-(--color-border)">
                    <div className="flex items-center gap-2 text-[13px] text-(--color-text-tertiary)">
                        <span className="text-(--color-text-primary) font-medium">
                            입금 처리
                        </span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 -mr-1 hover:bg-(--color-bg-hover) rounded transition-colors text-(--color-text-tertiary) hover:text-(--color-text-primary)"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-5 space-y-5">
                    
                    {/* Invoice Context */}
                    <div className="p-3 bg-(--color-bg-secondary) border border-(--color-border) rounded-md flex flex-col gap-1">
                        <span className="text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                            대상 청구서
                        </span>
                        <div className="text-[13px] font-medium text-(--color-text-primary) truncate">
                            {invoice.title}
                        </div>
                        <div className="text-[12px] text-(--color-text-secondary) mt-1">
                            총 청구액: ₩ {Number(invoice.amount).toLocaleString()}
                        </div>
                    </div>

                    <div className="space-y-4 pt-1">
                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                실제 입금액
                            </label>
                            <Input
                                autoFocus
                                variant="currency"
                                placeholder="0"
                                value={amount}
                                onChange={handleAmountChange}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                입금일
                            </label>
                            <DatePickerInput
                                value={paymentDate}
                                onChange={setPaymentDate}
                                placeholder="YYYY-MM-DD"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="flex items-center gap-1.5 text-[11px] font-bold text-(--color-text-tertiary) uppercase tracking-wide">
                                메모
                            </label>
                            <Input
                                placeholder="예: 국민은행 이체 완료"
                                value={memo}
                                onChange={(e) => setMemo(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-4 h-14 border-t border-(--color-border) flex items-center justify-end gap-2 bg-(--color-bg-secondary)/20">
                    <button
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="px-3 py-1.5 text-[12px] font-medium text-(--color-text-secondary) hover:text-(--color-text-primary) transition-all"
                    >
                        취소
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSubmitting}
                        className="px-4 h-8 text-[12px] font-bold text-(--color-text-primary) hover:text-(--color-text-primary) border border-(--color-border) bg-(--color-bg-primary) hover:bg-(--color-bg-hover) rounded-md shadow-sm transition-all disabled:opacity-50"
                    >
                        {isSubmitting ? "저장 중..." : "입금 처리 완료"}
                    </button>
                </div>
            </div>
        </div>
    );
}

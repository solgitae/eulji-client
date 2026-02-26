
import React, { useState } from "react";
import { X, Send, MessageSquare } from "lucide-react";
import { cn } from "@/utils/util";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { DropdownSelect } from "@/components/ui/Dropdown";
import type { LeadTransactionType, LeadPropertyType } from "@/types/lead";

const PURPOSES: { value: LeadTransactionType; label: string }[] = [
    { value: "SALE", label: "매매 문의" },
    { value: "JEONSE", label: "전세 문의" },
    { value: "WOLSE", label: "월세 문의" },
];

const PROPERTY_TYPES: { value: LeadPropertyType; label: string }[] = [
    { value: "APARTMENT", label: "아파트" },
    { value: "OFFICETEL", label: "오피스텔" },
    { value: "VILLA", label: "빌라" },
    { value: "COMMERCIAL", label: "상가" },
    { value: "BUILDING", label: "빌딩" },
    { value: "LAND", label: "토지" },
    { value: "OTHER", label: "기타" },
];

export default function InquiryFab({ 
    showListings = true,
}: { 
    showListings?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [transactionType, setTransactionType] = useState<LeadTransactionType | "">("");
    const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<LeadPropertyType[]>([]);

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        deposit: "",
        rent: "",
        note: ""
    });
    const [regionInput, setRegionInput] = useState("");
    const [regions, setRegions] = useState<string[]>([]);


    const toggle = () => {
        setIsOpen(!isOpen);
        if (isSubmitted) setIsSubmitted(false);
        if (!isOpen) {
            setTransactionType("");
            setSelectedPropertyTypes([]);
            setFormData({
                name: "",
                phone: "",
                deposit: "",
                rent: "",
                note: ""
            });
            setRegionInput("");
            setRegions([]);
        }
    };

    const togglePropertyType = (type: LeadPropertyType) => {
        setSelectedPropertyTypes(prev => 
            prev.includes(type) 
                ? prev.filter(t => t !== type) 
                : [...prev, type]
        );
    };

    const formatPhone = (val: string) => {
        const num = val.replace(/[^0-9]/g, "");
        if (num.length <= 3) return num;
        if (num.length <= 7) return `${num.slice(0, 3)}-${num.slice(3)}`;
        return `${num.slice(0, 3)}-${num.slice(3, 7)}-${num.slice(7, 11)}`;
    };

    const formatAmount = (val: string) => {
        const num = val.replace(/[^0-9]/g, "");
        if (!num) return "";
        return Number(num).toLocaleString();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let formattedValue = value;

        if (name === "phone") {
            formattedValue = formatPhone(value);
        } else if (name === "deposit" || name === "rent") {
            formattedValue = formatAmount(value);
        }

        setFormData(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleRegionKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.nativeEvent.isComposing && regionInput.trim()) {
            e.preventDefault();
            const newRegion = regionInput.trim();
            if (regions.length >= 5) {
                return;
            }
            if (!regions.includes(newRegion)) {
                setRegions(prev => [...prev, newRegion]);
            }
            setRegionInput("");
        }
    };

    const removeRegion = (region: string) => {
        setRegions(prev => prev.filter(r => r !== region));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const rawPhone = formData.phone.replace(/-/g, "");
        if (!rawPhone || rawPhone.length < 10) {
            alert("유효한 휴대폰 번호를 입력해주세요.");
            return;
        }

        const amount = formData.deposit ? Number(formData.deposit.replace(/,/g, "")) * 10000 : null;
        const rent = formData.rent ? Number(formData.rent.replace(/,/g, "")) * 10000 : null;

        const isSale = transactionType === "SALE";
        const isJeonse = transactionType === "JEONSE";
        const isWolse = transactionType === "WOLSE";

        const submitData = {
            name: formData.name,
            phone: formData.phone.replace(/-/g, ""),
            role: isSale ? "BUYER" : "TENANT",
            transaction_type: transactionType,
            preferred_regions: regions,
            // 매매: price_sale_max (필요시 min도 동일하게 설정 가능)
            price_sale_max: isSale ? amount : null,
            price_deposit_max: (isJeonse || isWolse) ? amount : null,
            price_rent_max: isWolse ? rent : null,
            note: formData.note,
        };

        try {
            const res = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(submitData),
            });

            if (!res.ok) throw new Error("Failed to submit inquiry");

            console.log("Submitting Raw Data:", submitData);
            setIsSubmitted(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSubmitted(false);
            }, 2000);
        } catch (error) {
            console.error("Error submitting inquiry:", error);
            alert("문의 접수에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        }
    };

    const getPriceLabel = () => {
        if (transactionType === "JEONSE" || transactionType === "WOLSE") return "보증금";
        if (transactionType === "SALE") return "희망 금액";
        return "금액";
    };

    return (
        <div className="fixed bottom-6 right-6 z-100 flex flex-col items-end gap-4">
            
            {isOpen && (
                <div 
                    className={cn(
                        "w-[calc(100vw-48px)] sm:w-[380px] max-h-[85vh] overflow-y-auto rounded-2xl shadow-(--shadow-elevated)",
                        "bg-(--color-bg-primary) border border-(--color-border)",
                        "animate-in fade-in slide-in-from-bottom-4 duration-200"
                    )}
                >
                    
                    <div className="p-4 border-b border-(--color-border) flex items-center justify-between bg-(--color-bg-secondary) sticky top-0 z-10">
                        <div>
                            <h3 className="text-sm font-semibold text-(--color-text-primary) tracking-tight">문의하기</h3>
                            <p className="text-xs text-(--color-text-tertiary) tracking-tight">궁금하신 내용을 남겨주시면 곧 연락드리겠습니다.</p>
                        </div>
                        <button 
                            onClick={toggle}
                            className="p-1.5 rounded-md hover:bg-(--color-bg-hover) text-(--color-text-tertiary) transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="p-5">
                        {isSubmitted ? (
                            <div className="py-12 flex flex-col items-center justify-center text-center gap-3 animate-in zoom-in-95 duration-200">
                                <div className="w-12 h-12 rounded-full bg-(--color-status-done-bg) text-(--color-status-done) flex items-center justify-center">
                                    <Send className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-(--color-text-primary) tracking-tight">문의가 접수되었습니다!</p>
                                    <p className="text-xs text-(--color-text-tertiary) mt-1 tracking-tight">확인 후 빠르게 답변 드릴게요.</p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                                <div className="grid grid-cols-2 gap-3">
                                    <Input 
                                        name="name"
                                        label="이름" 
                                        placeholder="성함" 
                                        value={formData.name}
                                        onChange={handleChange}
                                        required 
                                    />
                                    <Input 
                                        name="phone"
                                        label="연락처" 
                                        placeholder="010-0000-0000" 
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        maxLength={13}
                                        required 
                                    />
                                </div>

                                <DropdownSelect 
                                    label="문의 유형" 
                                    options={PURPOSES} 
                                    placeholder="거래 유형을 선택해 주세요"
                                    value={transactionType}
                                    onChange={(val) => setTransactionType(val as LeadTransactionType)}
                                />


                                {transactionType && (
                                    <div className="animate-in fade-in slide-in-from-top-2 duration-200 flex flex-col gap-4">
                                        
                                            <div className="flex items-end gap-2">
                                                <Input 
                                                    name="deposit"
                                                    className="flex-1 text-right font-mono"
                                                    label={getPriceLabel()}
                                                    placeholder="0"
                                                    value={formData.deposit}
                                                    onChange={handleChange}
                                                    leftIcon={<span className="text-xs font-medium text-(--color-text-tertiary) pl-1">₩</span>}
                                                    rightIcon={<span className="text-[11px] font-bold text-(--color-text-tertiary) pr-1">만원</span>}
                                                    required
                                                />
                                            </div>

                                            {transactionType === "WOLSE" && (
                                                <div className="flex items-end gap-2">
                                                    <Input
                                                        name="rent"
                                                        className="flex-1 text-right pr-9 font-mono"
                                                        label="월세"
                                                        placeholder="0"
                                                        value={formData.rent}
                                                        onChange={handleChange}
                                                        leftIcon={<span className="text-xs font-medium text-(--color-text-tertiary) pl-1">₩</span>}
                                                        rightIcon={<span className="text-[11px] font-bold text-(--color-text-tertiary) pr-1">만원</span>}
                                                    />
                                                </div>
                                            )}

                                        <div className="flex flex-col gap-2">
                                            <Input 
                                                label="희망 지역" 
                                                placeholder={regions.length >= 5 ? "최대 5개까지 등록 가능합니다" : "강남구"} 
                                                value={regionInput}
                                                onChange={(e) => setRegionInput(e.target.value)}
                                                onKeyDown={handleRegionKeyDown}
                                                disabled={regions.length >= 5}
                                                rightIcon={
                                                    <kbd className="inline-flex items-center gap-1 rounded border border-(--color-border) bg-(--color-bg-tertiary) px-1.5 font-sans text-[10px] font-medium text-(--color-text-tertiary) shadow-(--shadow-sm)">
                                                        <span>Enter</span>
                                                    </kbd>
                                                }
                                            />
                                            {regions.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                                                    {regions.map(region => (
                                                        <div 
                                                            key={region}
                                                            className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-(--color-bg-tertiary) border border-(--color-border) text-xs font-medium text-(--color-text-primary)"
                                                        >
                                                            <span>{region}</span>
                                                            <button 
                                                                type="button" 
                                                                onClick={() => removeRegion(region)}
                                                                className="text-(--color-text-tertiary) hover:text-(--color-danger) transition-colors"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-medium text-(--color-text-primary) tracking-tight">
                                                매물 형태
                                            </label>
                                            <div className="flex flex-wrap gap-1.5">
                                                {PROPERTY_TYPES.map(type => (
                                                    <button
                                                        key={type.value}
                                                        type="button"
                                                        onClick={() => togglePropertyType(type.value)}
                                                        className={cn(
                                                            "px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-100",
                                                            "border",
                                                            selectedPropertyTypes.includes(type.value)
                                                                ? "bg-(--color-accent) border-transparent text-white"
                                                                : "bg-(--color-bg-secondary) border-(--color-border) text-(--color-text-secondary) hover:border-(--color-border-strong)"
                                                        )}
                                                    >
                                                        {type.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-(--color-text-primary) tracking-tight">
                                        문의 내용 (선택)
                                    </label>
                                    <textarea 
                                        name="note"
                                        className={cn(
                                            "w-full min-h-[80px] p-3 rounded-md text-sm transition-colors duration-100",
                                            "bg-(--color-bg-secondary) text-(--color-text-primary)",
                                            "border border-(--color-border)",
                                            "placeholder:text-(--color-text-disabled)",
                                            "hover:border-(--color-border-strong)",
                                            "focus:outline-none focus:border-(--color-border-focus) focus:ring-1 focus:ring-(--color-border-focus)",
                                            "resize-none"
                                        )}
                                        placeholder="매니저에게 전달할 내용을 자유롭게 적어주세요."
                                        value={formData.note}
                                        onChange={handleChange}
                                    />
                                </div>
                                <Button 
                                    type="submit" 
                                    variant="primary" 
                                    className="w-full mt-1"
                                    size="default"
                                >
                                    문의 보내기
                                </Button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <button
                onClick={toggle}
                className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shadow-(--shadow-elevated) transition-all duration-200",
                    "bg-(--color-inquiry) hover:bg-(--color-inquiry-hover) text-(--color-inquiry-stroke) hover:scale-105 active:scale-95",
                    isOpen && "rotate-90 bg-(--color-bg-tertiary) text-(--color-text-primary)"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 fill-current" />}
            </button>
        </div>
    );
}
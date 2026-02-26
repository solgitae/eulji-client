import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKoreanCurrency(value: number | string | null | undefined): string {
    if (value === null || value === undefined || value === "") return "";

    const cleanStr = String(value).replace(/,/g, "").replace(/\s/g, "");

    const isValidNumber = /^-?\d{1,16}$/.test(cleanStr);
    if (!isValidNumber) {
        return ""; 
    }
    
    const num = parseInt(cleanStr, 10);
    if (isNaN(num)) return "";
    if (num === 0) return "0";

    const isNegative = num < 0;
    const absVal = Math.abs(num);

    const units = [
        { unit: '조', value: 1000000000000 },
        { unit: '억', value: 100000000 },
        { unit: '만', value: 10000 },
        { unit: '', value: 1 },
    ];

    let remainder = absVal;
    const resultParts: string[] = [];

    for (const { unit, value: unitValue } of units) {
        if (remainder >= unitValue) {
            const quotient = Math.floor(remainder / unitValue);
            if (quotient > 0) {
                
                resultParts.push(`${quotient.toLocaleString()}${unit}`);
            }
            remainder %= unitValue;
        }
    }

    if (resultParts.length === 0) {
        return "0";
    }

    const result = resultParts.join(' ').trim();
    return isNegative ? `-${result}` : result;
}

export function formatKoreanPhone(value: string | null | undefined): string {
    if (!value) return "";
    const cleaned = value.replace(/[^0-9]/g, "");
    
    if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
    } else if (cleaned.length === 10) {
        if (cleaned.startsWith("02")) {
            return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
        }
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
    } else if (cleaned.length === 9) {
        if (cleaned.startsWith("02")) {
            return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
        }
    } else if (cleaned.length === 8) {
        return cleaned.replace(/(\d{4})(\d{4})/, "$1-$2");
    }
    
    return cleaned;
}


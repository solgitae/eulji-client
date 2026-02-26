import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 금액을 한국 단위(억, 만)로 변환합니다.
 */
export function convertPriceWithComma(price: number): string {
  if (!price) return "0";
  if (price >= 10000) {
    const eok = Math.floor(price / 10000);
    const man = price % 10000;
    return `${eok}억${man > 0 ? ` ${man.toLocaleString()}` : ""}`;
  }
  return price.toLocaleString();
}

/**
 * 매물 가격을 거래 유형에 맞춰 포맷팅합니다.
 * SALE: 10억 5,000
 * LEASE: 5억 2,000
 * RENT: 3,000 / 120
 */
export function formatPropertyPrice(price: number, dealType: string, rentFee?: number): string {
  if (dealType === "RENT") {
    return `${(price || 0).toLocaleString()} / ${(rentFee || 0).toLocaleString()}`;
  }
  return convertPriceWithComma(price);
}

/**
 * 전화번호에 하이픈을 추가합니다.
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return "-";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 11) {
    return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
  } else if (cleaned.length === 10) {
    if (cleaned.startsWith("02")) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    }
    return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }
  return phone;
}

/**
 * 날짜 객체를 'YYYY-MM-DD' 형식의 문자열로 변환합니다 (로컬 시간 기준).
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

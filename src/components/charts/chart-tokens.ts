
export function getChartToken(name: string): string {
    if (typeof window === 'undefined') return '#888';
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export const LEAD_STAGE_CONFIG = {
    NEW:         { label: '신규',   colorVar: '--color-status-pending',     bgVar: '--color-status-pending-bg' },
    IN_PROGRESS: { label: '진행중', colorVar: '--color-status-in-progress', bgVar: '--color-status-in-progress-bg' },
    COMPLETED:   { label: '완료',   colorVar: '--color-status-done',        bgVar: '--color-status-done-bg' },
} as const;

export const LISTING_STATUS_CONFIG = {
    ACTIVE:     { label: '진행중',   colorVar: '--color-status-active',  bgVar: '--color-status-active-bg' },
    PENDING:    { label: '검토중',   colorVar: '--color-status-pending',  bgVar: '--color-status-pending-bg' },
    CONTRACTED: { label: '계약완료', colorVar: '--color-status-done',    bgVar: '--color-status-done-bg' },
} as const;

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
    APARTMENT: '아파트', OFFICETEL: '오피스텔', VILLA: '빌라',
    COMMERCIAL: '상가', LAND: '토지', OTHER: '기타',
};

export const TRADE_TYPE_LABELS: Record<string, string> = {
    SALE: '매매', JEONSE: '전세', WOLSE: '월세',
};

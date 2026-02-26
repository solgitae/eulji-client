/**
 * lib/validators.ts
 * 공통 유효성 검증 함수 — 서버(API route)와 클라이언트(ProfileModal 등) 공유
 */

// ── 사용자 프로필 ──────────────────────────────────────────────────
/** 닉네임: 한글·영문·숫자·공백 2~30자 */
export const NAME_REGEX = /^[가-힣a-zA-Z0-9\s]{2,30}$/;

/** 휴대폰: 010-xxxx-xxxx 또는 하이픈 없는 형식 */
export const PHONE_REGEX = /^01[016789]-?\d{3,4}-?\d{4}$/;

export function validateUserName(name: string): string | null {
    if (!name || !name.trim()) return "닉네임을 입력해 주세요.";
    if (!NAME_REGEX.test(name.trim())) return "닉네임은 한글·영문·숫자 2~30자로 입력해 주세요.";
    return null;
}

export function validatePhone(phone: string): string | null {
    if (!phone || phone === "") return null; // 선택 항목
    const normalized = phone.replace(/-/g, "");
    if (!PHONE_REGEX.test(phone) && !/^01[016789]\d{7,8}$/.test(normalized)) {
        return "유효한 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)";
    }
    return null;
}

// ── 워크스페이스 ───────────────────────────────────────────────────
const SLUG_REGEX = /^[a-z0-9][a-z0-9-]{1,46}[a-z0-9]$/;
const SLUG_CONSECUTIVE_HYPHENS = /--/;
const RESERVED_SLUGS = [
    "admin", "api", "app", "auth", "dashboard",
    "login", "logout", "settings", "workspaces",
    "www", "mail", "support", "help",
];

export function validateSlug(slug: string): string | null {
    if (!slug) return "슬러그는 필수입니다.";
    if (slug.length < 3) return "슬러그는 최소 3자 이상이어야 합니다.";
    if (slug.length > 48) return "슬러그는 최대 48자 이하여야 합니다.";
    if (!SLUG_REGEX.test(slug)) return "슬러그는 소문자·숫자·하이픈(-)만 사용 가능하며 시작/끝에 하이픈은 불가합니다.";
    if (SLUG_CONSECUTIVE_HYPHENS.test(slug)) return "연속된 하이픈(--)은 사용할 수 없습니다.";
    if (RESERVED_SLUGS.includes(slug)) return `'${slug}'는 예약된 슬러그입니다.`;
    return null;
}

export function validateWorkspaceName(name: string): string | null {
    if (!name || !name.trim()) return "워크스페이스 이름은 필수입니다.";
    if (name.trim().length < 2) return "이름은 최소 2자 이상이어야 합니다.";
    if (name.trim().length > 48) return "이름은 최대 48자 이하여야 합니다.";
    return null;
}

// ── 공통 ──────────────────────────────────────────────────────────
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function isValidUUID(value: string): boolean {
    return UUID_REGEX.test(value);
}

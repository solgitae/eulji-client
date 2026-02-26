import React, { useCallback, useEffect, useRef, useState } from "react";
import { AlertCircle, Camera, CheckCircle2, Loader2, X } from "lucide-react";
import { cn } from "@/utils/util";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { validateUserName, validatePhone } from "@/lib/validators";
import { Image } from "@/components/ui/Image";

/** phone 입력 시 자동 하이픈 삽입 (클라이언트 전용) */
function formatPhone(val: string): string {
    const digits = val.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}


/** Canvas API로 이미지를 WebP(quality 0.7)로 변환 */
async function convertToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new window.Image();
        const url = URL.createObjectURL(file);
        img.onload = () => {
            // 최대 512×512로 축소
            const MAX = 512;
            let { width, height } = img;
            if (width > MAX || height > MAX) {
                const ratio = Math.min(MAX / width, MAX / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) => {
                    URL.revokeObjectURL(url);
                    if (blob) resolve(blob);
                    else reject(new Error("WebP 변환 실패"));
                },
                "image/webp",
                0.7,
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error("이미지 로드 실패"));
        };
        img.src = url;
    });
}

export interface ProfileModalProps {
    open: boolean;
    onClose: () => void;
}

interface ProfileData {
    name: string;
    email: string;
    avatar_url: string | null;
    phone_snapshot: string | null;
    provider: string;
}

export default function ProfileModal({
    open,
    onClose,
}: ProfileModalProps) {
    const { user, setUser } = useAuthStore();
    const { setProfile: setStoreProfile } = useProfileStore();
    const overlayRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // ── 폼 상태 ──────────────────────────────────────────────────
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [nameError, setNameError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);
    const [avatarError, setAvatarError] = useState<string | null>(null);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // ── 프로필 데이터 로드 ────────────────────────────────────────
    useEffect(() => {
        if (!open) return;
        const fetchProfile = async () => {
            setIsFetching(true);
            setFetchError(null);
            try {
                const url = "/api/users/profile";
                const res = await fetch(url);
                if (!res.ok) {
                    const json = await res.json();
                    setFetchError(json.error || "프로필을 불러올 수 없습니다.");
                    return;
                }
                const data: ProfileData = await res.json();
                setProfile(data);
                setName(data.name || "");
                setPhone(data.phone_snapshot || "");
                setAvatarPreview(data.avatar_url || null);
            } catch {
                setFetchError("네트워크 오류가 발생했습니다.");
            } finally {
                setIsFetching(false);
            }
        };
        fetchProfile();
    }, [open]);

    // ── 모달 닫기 ─────────────────────────────────────────────────
    const handleClose = useCallback(() => {
        if (isSubmitting) return;
        // 상태 초기화
        setProfile(null);
        setName("");
        setPhone("");
        // blob URL 해제 후 상태 완전 클리어 (3-B)
        if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
        setAvatarPreview(null);
        setAvatarFile(null);
        setNameError(null);
        setPhoneError(null);
        setAvatarError(null);
        setServerError(null);
        setSaveSuccess(false);
        setFetchError(null);
        onClose();
    }, [isSubmitting, onClose]);

    // ESC 키 처리
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") handleClose();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [open, handleClose]);

    const handleOverlayClick = useCallback(
        (e: React.MouseEvent) => {
            if (e.target === overlayRef.current) handleClose();
        },
        [handleClose],
    );

    // ── 이미지 선택 ───────────────────────────────────────────────
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarError(null);

        if (!file.type.startsWith("image/")) {
            setAvatarError("이미지 파일만 선택 가능합니다.");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setAvatarError("이미지는 5MB 이하만 업로드 가능합니다.");
            return;
        }

        try {
            const webpBlob = await convertToWebP(file);
            const webpFile = new File([webpBlob], `avatar_${Date.now()}.webp`, {
                type: "image/webp",
            });
            // 기존 blob URL 해제 후 새 blob 생성 (메모리 누수 방지 3-B)
            if (avatarPreview?.startsWith("blob:")) URL.revokeObjectURL(avatarPreview);
            setAvatarFile(webpFile);
            setAvatarPreview(URL.createObjectURL(webpBlob));
        } catch {
            setAvatarError("이미지 변환에 실패했습니다. 다른 이미지를 선택해 주세요.");
        }
    };

    // ── 저장 ──────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;  // 이중 제출 방지 (3-C)

        const ne = validateUserName(name);
        const pe = validatePhone(phone);
        setNameError(ne);
        setPhoneError(pe);
        if (ne || pe) return;

        setIsSubmitting(true);
        setServerError(null);
        setSaveSuccess(false);

        try {
            const formData = new FormData();
            formData.append("name", name.trim());
            formData.append("phone", phone);
            if (avatarFile) formData.append("avatar", avatarFile);

            const res = await fetch("/api/users/profile", {
                method: "PATCH",
                body: formData,
            });
            const json = await res.json();

            if (!res.ok) {
                if (json.field === "name") setNameError(json.error);
                else if (json.field === "phone") setPhoneError(json.error);
                else if (json.field === "avatar") setAvatarError(json.error);
                else setServerError(json.error || "저장에 실패했습니다.");
                return;
            }

            setSaveSuccess(true);

            // ProfileStore 갱신: avatar_url이 없으면 현재 미리보기 유지 (3-A — null 덮어쓰기 방지)
            setStoreProfile(
                json.avatar_url ?? avatarPreview ?? null,
                json.user?.name ?? null,
            );

            // user_metadata도 동기화 (fallback 용)
            if (user && json.user) {
                setUser(
                    {
                        ...user,
                        user_metadata: {
                            ...user.user_metadata,
                            full_name: json.user.name,
                            name: json.user.name,
                            ...(json.avatar_url
                                ? { avatar_url: json.avatar_url }
                                : {}),
                        },
                    },
                    undefined,
                );
            }

            // 1초 후 모달 닫기
            setTimeout(() => handleClose(), 1200);
        } catch {
            setServerError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!open) return null;

    const currentAvatar =
        avatarPreview ||
        profile?.avatar_url ||
        user?.user_metadata?.avatar_url ||
        null;

    const initials = (
        name ||
        profile?.name ||
        user?.user_metadata?.full_name ||
        user?.email ||
        "?"
    )
        .charAt(0)
        .toUpperCase();

    return (
        <div
            ref={overlayRef}
            onClick={handleOverlayClick}
            className="fixed inset-0 z-100 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="profile-modal-title"
                className={cn(
                    "relative w-full max-w-md",
                    "bg-(--color-bg-primary) border border-(--color-border) rounded-2xl shadow-2xl",
                    "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-200",
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── 헤더 ── */}
                <div className="flex items-center justify-between px-6 pt-6 pb-0">
                    <div>
                        <h2
                            id="profile-modal-title"
                            className="text-base font-semibold text-(--color-text-primary)"
                        >
                            프로필 설정
                        </h2>
                        <p className="text-xs text-(--color-text-tertiary) mt-0.5">
                            내 계정 정보를 확인하고 수정합니다
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={isSubmitting}
                        className="w-7 h-7 flex items-center justify-center rounded-lg text-(--color-text-tertiary) hover:text-(--color-text-primary) hover:bg-(--color-bg-hover) transition-colors duration-100 disabled:opacity-40"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* ── 바디 ── */}
                {isFetching ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-5 h-5 animate-spin text-(--color-text-tertiary)" />
                    </div>
                ) : fetchError ? (
                    <div className="px-6 py-8 text-center">
                        <p className="text-sm text-(--color-feedback-error) flex items-center justify-center gap-1.5">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            {fetchError}
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="px-6 py-5 space-y-5">
                            {/* ── 아바타 ── */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="relative group">
                                    <div
                                        className={cn(
                                            "w-20 h-20 rounded-2xl overflow-hidden",
                                            "border-2 border-(--color-border) bg-(--color-bg-tertiary)",
                                            "flex items-center justify-center",
                                            "transition-all duration-150",
                                            "group-hover:border-(--color-border-focus)",
                                        )}
                                    >
                                        {currentAvatar ? (
                                            <Image
                                                src={currentAvatar}
                                                alt="프로필 이미지"
                                                width={80}
                                                height={80}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-2xl font-semibold text-(--color-text-secondary)">
                                                {initials}
                                            </span>
                                        )}
                                    </div>
                                    {/* 호버 오버레이 */}
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={isSubmitting}
                                        className={cn(
                                            "absolute inset-0 rounded-2xl",
                                            "bg-black/0 group-hover:bg-black/40",
                                            "flex items-center justify-center",
                                            "transition-all duration-150",
                                            "text-white/0 group-hover:text-white/90",
                                            "cursor-pointer disabled:cursor-not-allowed",
                                        )}
                                        aria-label="프로필 이미지 변경"
                                    >
                                        <Camera className="w-5 h-5" />
                                    </button>
                                </div>

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                    disabled={isSubmitting}
                                    aria-label="프로필 이미지 파일 선택"
                                />

                                <p className="text-[11px] text-(--color-text-tertiary)">
                                    클릭하여 이미지 변경 · WebP 변환 · 최대 10MB
                                </p>

                                {avatarError && (
                                    <p className="text-xs text-(--color-feedback-error) flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        {avatarError}
                                    </p>
                                )}
                            </div>

                            {/* ── 닉네임 ── */}
                            <div>
                                <label
                                    htmlFor="profile-name"
                                    className="block text-xs font-medium text-(--color-text-secondary) mb-1.5"
                                >
                                    닉네임
                                    <span className="text-red-400 ml-0.5">*</span>
                                </label>
                                <input
                                    id="profile-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setNameError(null);
                                    }}
                                    onBlur={() => setNameError(validateUserName(name))}
                                    disabled={isSubmitting}
                                    placeholder="표시될 이름을 입력하세요"
                                    maxLength={30}
                                    autoComplete="name"
                                    className={cn(
                                        "w-full px-3 py-2 text-sm rounded-lg",
                                        "bg-(--color-bg-secondary) border",
                                        "text-(--color-text-primary) placeholder:text-(--color-text-tertiary)",
                                        "focus:outline-none transition-colors duration-100",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        nameError
                                            ? "border-red-500/60 focus:border-red-500"
                                            : "border-(--color-border) focus:border-(--color-border-focus)",
                                    )}
                                />
                                <div className="flex items-center justify-between mt-1 min-h-[16px]">
                                    {nameError ? (
                                        <span className="text-xs text-red-400 flex items-center gap-1">
                                            <AlertCircle className="w-3 h-3 shrink-0" />
                                            {nameError}
                                        </span>
                                    ) : (
                                        <span />
                                    )}
                                    <span
                                        className={cn(
                                            "text-xs ml-auto shrink-0",
                                            name.trim().length > 26
                                                ? "text-amber-400"
                                                : "text-(--color-text-tertiary)",
                                        )}
                                    >
                                        {name.trim().length}/30
                                    </span>
                                </div>
                            </div>

                            {/* ── 이메일 (읽기 전용) ── */}
                            <div>
                                <label
                                    htmlFor="profile-email"
                                    className="block text-xs font-medium text-(--color-text-secondary) mb-1.5"
                                >
                                    이메일
                                    <span className="ml-1.5 text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-(--color-bg-secondary) border border-(--color-border) text-(--color-text-tertiary)">
                                        읽기 전용
                                    </span>
                                </label>
                                <input
                                    id="profile-email"
                                    type="email"
                                    value={profile?.email || user?.email || ""}
                                    readOnly
                                    disabled
                                    className={cn(
                                        "w-full px-3 py-2 text-sm rounded-lg",
                                        "bg-(--color-bg-tertiary) border border-(--color-border)",
                                        "text-(--color-text-disabled)",
                                        "cursor-not-allowed select-none",
                                    )}
                                />
                                <p className="text-[11px] text-(--color-text-tertiary) mt-1">
                                    {profile?.provider === "google" ? "Google" : "OAuth"} 계정은 이메일 변경이 불가합니다.
                                </p>
                            </div>

                            {/* ── 휴대폰 번호 ── */}
                            <div>
                                <label
                                    htmlFor="profile-phone"
                                    className="block text-xs font-medium text-(--color-text-secondary) mb-1.5"
                                >
                                    휴대폰 번호
                                    <span className="ml-1.5 text-[10px] font-normal px-1.5 py-0.5 rounded-full bg-(--color-bg-secondary) border border-(--color-border) text-(--color-text-tertiary)">
                                        선택
                                    </span>
                                </label>
                                <input
                                    id="profile-phone"
                                    type="tel"
                                    value={phone}
                                    onChange={(e) => {
                                        const formatted = formatPhone(e.target.value);
                                        setPhone(formatted);
                                        setPhoneError(null);
                                    }}
                                    onBlur={() => setPhoneError(validatePhone(phone))}
                                    disabled={isSubmitting}
                                    placeholder="010-0000-0000"
                                    maxLength={13}
                                    autoComplete="tel"
                                    inputMode="numeric"
                                    className={cn(
                                        "w-full px-3 py-2 text-sm rounded-lg font-mono",
                                        "bg-(--color-bg-secondary) border",
                                        "text-(--color-text-primary) placeholder:text-(--color-text-tertiary) placeholder:font-sans",
                                        "focus:outline-none transition-colors duration-100",
                                        "disabled:opacity-50 disabled:cursor-not-allowed",
                                        phoneError
                                            ? "border-red-500/60 focus:border-red-500"
                                            : "border-(--color-border) focus:border-(--color-border-focus)",
                                    )}
                                />
                                {phoneError ? (
                                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        {phoneError}
                                    </p>
                                ) : (
                                    <p className="text-[11px] text-(--color-text-tertiary) mt-1">
                                        워크스페이스 내 업무용 연락처로 사용됩니다.
                                    </p>
                                )}
                            </div>

                            {/* ── 서버 에러 ── */}
                            {serverError && (
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-(--color-danger-bg) border border-(--color-danger-border)">
                                    <AlertCircle className="w-3.5 h-3.5 text-(--color-danger) shrink-0" />
                                    <p className="text-xs text-(--color-danger)">{serverError}</p>
                                </div>
                            )}

                            {/* ── 성공 메시지 ── */}
                            {saveSuccess && (
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-(--color-status-done-bg) border border-(--color-status-done)/20">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-(--color-status-done) shrink-0" />
                                    <p className="text-xs text-(--color-status-done)">
                                        프로필이 성공적으로 저장되었습니다.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* ── 푸터 ── */}
                        <div className="flex items-center justify-end gap-2 px-6 pb-6 pt-0">
                            <button
                                type="button"
                                onClick={handleClose}
                                disabled={isSubmitting}
                                className="px-3 py-1.5 text-sm rounded-lg border border-(--color-border) text-(--color-text-secondary) hover:bg-(--color-bg-hover) transition-colors duration-100 disabled:opacity-50"
                            >
                                취소
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || saveSuccess}
                                className={cn(
                                    "px-4 py-1.5 text-sm rounded-lg font-medium transition-colors duration-100 flex items-center gap-1.5",
                                    isSubmitting || saveSuccess
                                        ? "bg-(--color-bg-secondary) text-(--color-text-tertiary) border border-(--color-border) cursor-not-allowed"
                                        : "bg-(--color-accent) text-(--color-text-on-accent) hover:opacity-90",
                                )}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        저장 중...
                                    </>
                                ) : saveSuccess ? (
                                    <>
                                        <CheckCircle2 className="w-3.5 h-3.5" />
                                        저장 완료
                                    </>
                                ) : (
                                    "저장"
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

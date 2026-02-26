
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { type AuthChangeEvent, type Session } from "@supabase/supabase-js";
import { useAuthStore } from "@/store/useAuthStore";
import { useProfileStore } from "@/store/useProfileStore";
import { useNavigate } from "react-router-dom";

const isDev = import.meta.env.MODE === "development";

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const { setUser, setInitializing } = useAuthStore();
    const { setProfile, clearProfile } = useProfileStore();
    const navigate = useNavigate();

    const [supabase] = useState(() => createClient());

    useEffect(() => {
        let mounted = true;

        /**
         * public.users에서 name, avatar_url을 조회해 AuthStore + ProfileStore 갱신.
         * forceProfileSync: 계정 전환(SIGNED_IN) 시 localStorage 캐시 무시하고 강제 동기화
         */
        const fetchAndSetUser = async (sessionUser: any, forceProfileSync = false) => {
            if (!sessionUser) {
                if (mounted) {
                    setUser(null, null);
                    setInitializing(false);
                    clearProfile();
                    navigate("/login", { replace: true });
                }
                return;
            }

            try {
                if (sessionUser.email) {
                    const { data, error } = await supabase
                        .from("users")
                        .select("id, name, avatar_url")
                        .eq("email", sessionUser.email)
                        .single();

                    if (error && isDev) {
                        console.error("[AuthProvider] Supabase query error:", error);
                    }

                    if (mounted) {
                        setUser(sessionUser, data?.id ?? null);

                        const stored = useProfileStore.getState();
                        // 강제 동기화(계정 전환) 또는 localStorage가 비어있을 때만 갱신
                        if (forceProfileSync || (!stored.avatarUrl && !stored.displayName)) {
                            setProfile(data?.avatar_url ?? null, data?.name ?? null);
                        }
                    }
                } else {
                    if (mounted) setUser(sessionUser, null);
                }
            } catch (error) {
                if (isDev) console.error("[AuthProvider] Failed to fetch public user:", error);
                if (mounted) setUser(sessionUser, null);
            } finally {
                if (mounted) setInitializing(false);
            }
        };

        const initFlow = async () => {
            // getSession() 대신 getUser() — 서버 검증으로 만료된 토큰 캐시 신뢰 방지
            const { data: { user } } = await supabase.auth.getUser();
            await fetchAndSetUser(user);

            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event: AuthChangeEvent, session: Session | null) => {
                    if (event === "INITIAL_SESSION") return;

                    // 로그아웃 또는 토큰 만료 → 프로필 초기화 후 /login으로 이동
                    if (!session?.user) {
                        clearProfile();
                        navigate("/login", { replace: true });
                        return;
                    }

                    // SIGNED_IN: 계정 전환 시 A계정 프로필 오염 방지 — 항상 DB로 강제 동기화
                    const forceSync = event === "SIGNED_IN";
                    await fetchAndSetUser(session.user, forceSync);
                }
            );

            return subscription;
        };

        let sub: any = null;
        initFlow().then(s => sub = s);

        return () => {
            mounted = false;
            if (sub) sub.unsubscribe();
        };
    }, [supabase, setUser, setInitializing, setProfile, clearProfile, navigate]);

    return <>{children}</>;
}

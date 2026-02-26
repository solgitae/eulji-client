
import React, { useState, Suspense } from "react";
import { useSearchParams } from "react-router-dom";
import Button from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";

function LoginForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const errorParam = searchParams.get("error");
    
    const [supabase] = useState(() => createClient());

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: "google",
                options: {
                    redirectTo: `${window.location.origin}/api/auth/callback`,
                },
            });
            if (error) throw error;
        } catch (err: any) {
            console.error("Login failed:", err);
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full max-w-[360px] flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="w-12 h-12 bg-(--color-accent) rounded-xl flex items-center justify-center mb-8 shadow-sm">
                <span className="text-white font-bold text-xl tracking-tighter">
                    E
                </span>
            </div>

            <div className="w-full bg-(--color-bg-primary) border border-(--color-border) rounded-2xl p-8 shadow-sm flex flex-col gap-6 text-center">
                <div className="flex flex-col gap-2">
                    <h1 className="text-xl font-semibold text-(--color-text-primary) tracking-tight">
                        Log in to Eulji
                    </h1>
                    <p className="text-sm text-(--color-text-secondary)">
                        Sign in to manage your spaces and leads.
                    </p>
                </div>

                {errorParam === "withdrawn" && (
                    <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-left">
                        탈퇴한 계정입니다. 동일 계정으로 재가입을 원하시면 관리자에게 문의해 주세요.
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Button
                        variant="secondary"
                        size="default"
                        className="w-full h-10 flex items-center justify-center gap-3 text-[14px]"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="animate-spin w-4 h-4 rounded-full border-2 border-white/30 border-t-white" />
                        ) : (
                            <svg
                                className="w-[18px] h-[18px]"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                        )}
                        Continue with Google
                    </Button>
                </div>
            </div>

            <div className="mt-8 text-center text-[13px] text-(--color-text-tertiary)">
                By proceeding, you agree to our{" "}
                <a href="#" className="text-(--color-text-primary) hover:underline">
                    Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-(--color-text-primary) hover:underline">
                    Privacy Policy
                </a>
                .
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-(--color-app-bg) flex items-center justify-center p-4">
            <Suspense fallback={<div className="animate-pulse text-sm text-(--color-text-tertiary)">Loading...</div>}>
                <LoginForm />
            </Suspense>
        </div>
    );
}


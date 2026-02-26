
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/util";
import Button from "@/components/ui/Button";

export default function LandingHeader() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 h-14 flex items-center transition-all duration-200",
                scrolled
                    ? "bg-(--color-app-bg)/90 backdrop-blur-md border-b border-(--color-border)"
                    : "bg-transparent",
            )}
        >
            <div className="max-w-5xl mx-auto w-full px-6 flex items-center justify-between">
                {/* 로고 */}
                <Link to="/" className="flex items-center gap-2 group">
                    <span className="text-sm font-bold text-(--color-text-primary) tracking-tight uppercase">
                        Eulji
                    </span>
                </Link>

                {/* 네비게이션 */}
                <nav className="hidden md:flex items-center gap-8">
                    <a
                        href="#features"
                        className="text-sm text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors"
                    >
                        기능
                    </a>
                    <a
                        href="#pricing"
                        className="text-sm text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors"
                    >
                        요금제
                    </a>
                    <Link to="/login" className="text-sm text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors">
                        로그인
                    </Link>
                </nav>

                {/* CTA */}
                <div className="flex items-center">
                    <Link to="/login">
                        <Button variant="primary" size="sm" className="h-9 px-4 text-xs font-semibold rounded-full bg-white text-black hover:bg-white/90">
                            무료로 시작하기
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    );
}

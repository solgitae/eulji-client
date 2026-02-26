
import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-(--color-app-bg) border-t border-(--color-border) pt-20 pb-10">
            <div className="max-w-5xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12">
                <div className="flex flex-col gap-4">
                    <span className="text-sm font-bold text-(--color-text-primary) tracking-tight uppercase">Eulji</span>
                    <p className="text-xs text-(--color-text-tertiary) leading-relaxed max-w-xs">
                        프리랜서를 위한 현대적인 워크스페이스입니다. <br />
                        생산성과 협업의 가치를 최우선으로 생각할 수 있습니다.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-8">
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-(--color-text-primary)">Service</h4>
                        <nav className="flex flex-col gap-2">
                            <a href="#features" className="text-xs text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors">기능</a>
                            <a href="#pricing" className="text-xs text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors">요금제</a>
                        </nav>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h4 className="text-xs font-bold text-(--color-text-primary)">Legal</h4>
                        <nav className="flex flex-col gap-2">
                            <Link to="/privacy" className="text-xs text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors">개인정보처리방침</Link>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="mt-20 pt-8 border-t border-(--color-border) flex items-center justify-between">
                <p className="text-[10px] text-(--color-text-tertiary)">
                    © {new Date().getFullYear()} Eulji. All rights reserved.
                </p>
            </div>
            </div>
        </footer>
    );
}

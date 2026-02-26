
import React from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";

export default function Pricing() {
    return (
        <section id="pricing" className="py-24 max-w-5xl mx-auto px-6">
            <div className="text-left mb-20 flex flex-col items-start">
                <h2 className="text-3xl font-bold text-(--color-text-primary) mb-4">심플한 요금제</h2>
                <p className="text-sm text-(--color-text-tertiary)">팀의 규모에 맞는 최적의 플랜을 선택할 수 있습니다.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Free Plan */}
                <div className="p-8 rounded-2xl border border-(--color-border) bg-transparent flex flex-col items-start gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-(--color-text-primary) mb-2">Free</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-(--color-text-primary)">₩0</span>
                            <span className="text-xs text-(--color-text-tertiary)">/월</span>
                        </div>
                    </div>
                    <ul className="space-y-3 flex-1">
                        {["개인용 워크스페이스", "일일 활동 추적", "최대 3개 프로젝트"].map((item) => (
                            <li key={item} className="text-xs text-(--color-text-tertiary) flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-(--color-border)" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/login" className="w-full">
                        <Button variant="secondary" className="w-full text-xs h-9 rounded-full border-(--color-border)">시작하기</Button>
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="p-8 rounded-2xl border border-white/20 bg-white text-black flex flex-col items-start gap-6 relative overflow-hidden group">
                    <div className="absolute top-4 right-4">
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-black text-white rounded-full">POPULAR</span>
                    </div>
                    <div className="z-10">
                        <h3 className="text-sm font-semibold mb-2">Pro</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">₩19,000</span>
                            <span className="text-[10px] opacity-60">/월</span>
                        </div>
                    </div>
                    <ul className="space-y-3 flex-1 z-10">
                        {["무제한 프로젝트", "팀원 공유 기능", "고급 분석 대시보드", "우선 순위 지원"].map((item) => (
                            <li key={item} className="text-xs font-medium flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-black/40" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link href="/login" className="w-full z-10">
                        <Button className="w-full text-xs h-9 rounded-full bg-black text-white hover:bg-black/90 font-bold border-none transition-transform group-hover:scale-[1.02]">
                            Pro 시작하기
                        </Button>
                    </Link>
                </div>

                {/* Enterprise Plan */}
                <div className="p-8 rounded-2xl border border-(--color-border) bg-transparent flex flex-col items-start gap-6">
                    <div>
                        <h3 className="text-sm font-semibold text-(--color-text-primary) mb-2">Enterprise</h3>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold text-(--color-text-primary)">Custom</span>
                        </div>
                    </div>
                    <ul className="space-y-3 flex-1">
                        {["커스텀 보안 정책", "SAML SSO 로그인", "전담 매니저 배치", "무제한 히스토리"].map((item) => (
                            <li key={item} className="text-xs text-(--color-text-tertiary) flex items-center gap-2">
                                <span className="w-1 h-1 rounded-full bg-(--color-border)" /> {item}
                            </li>
                        ))}
                    </ul>
                    <Link to="/login" className="w-full">
                        <Button variant="secondary" className="w-full text-xs h-9 rounded-full border-(--color-border)">문의하기</Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}

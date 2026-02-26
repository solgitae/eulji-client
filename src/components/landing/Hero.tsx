
import { Link } from "react-router-dom";
import Button from "@/components/ui/Button";
import { Image } from "@/components/ui/Image";

export default function Hero() {
    return (
        <section className="relative pt-40 pb-32">
            <div className="max-w-5xl mx-auto px-6 flex flex-col items-center text-center">
                {/* 메인 타이틀 */}
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-(--color-text-primary) mb-8 max-w-2xl leading-[1.1] animate-in fade-in slide-in-from-bottom-3 duration-1000">
                    프리랜서 및 솔로프리너를 위한 <br />
                    선형적인 워크스페이스
                </h1>

                {/* 서브 설명 */}
                <p className="text-base md:text-lg text-(--color-text-tertiary) max-w-xl mb-12 leading-relaxed animate-in fade-in slide-in-from-bottom-3 duration-1000 delay-200">
                    효율적인 프로젝트 관리와 팀 협업을 한 곳에서 해결할 수 있습니다. <br className="hidden md:block" />
                    더 이상 중복 업무 없이 팀의 생산성을 최적화할 수 있습니다.
                </p>

                {/* CTA 버튼 그룹 */}
                <div className="flex items-center gap-6 animate-in fade-in slide-in-from-bottom-3 duration-1000 delay-400">
                    <Link to="/login">
                        <Button variant="primary" className="h-11 px-6 text-sm rounded-full bg-white text-black hover:bg-white/90 font-semibold transition-transform hover:scale-[1.02]">
                            무료로 시작하기
                        </Button>
                    </Link>
                    <Link to="#features" className="text-sm text-(--color-text-tertiary) hover:text-(--color-text-primary) transition-colors font-medium">
                        서비스 둘러보기 &rarr;
                    </Link>
                </div>

                {/* 제품 모형 (추후 실제 이미지로 대체 가능) */}
                <div className="mt-24 w-full aspect-video rounded-2xl bg-linear-to-b from-(--color-bg-secondary) to-transparent border border-(--color-border) overflow-hidden shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-600">
                    <div className="w-full h-full bg-(--color-bg-primary)/50 backdrop-blur-3xl flex items-center justify-center text-(--color-text-tertiary) text-xs">
                        <Image  src={"image1.png"} width={1024} height={864} alt="image1"/>
                    </div>
                </div>
            </div>
        </section>
    );
}

import React from "react";
import { cn } from "@/utils/util";

import { MapPin } from "lucide-react";

export function ProfileAvatar({
    name,
    avatarUrl,
}: {
    name: string;
    avatarUrl?: string;
}) {
    return (
        <div className="w-24 h-24 rounded-full bg-(--color-bg-tertiary) border border-(--color-border) flex items-center justify-center overflow-hidden shadow-inner mb-6 mx-auto transition-transform hover:scale-105">
            {avatarUrl ? (
                <img
                    src={avatarUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                />
            ) : (
                <div className="w-full h-full bg-linear-to-br from-(--color-bg-tertiary) to-(--color-bg-secondary) flex items-center justify-center font-bold text-3xl text-(--color-text-tertiary) tracking-tighter">
                    {name.charAt(0)}
                </div>
            )}
        </div>
    );
}

export function ProfileHeader({
    name,
    address,
    count = 0,
}: {
    name: string;
    address: string;
    count?: number;
}) {
    const searchAddress = address.split(",")[0].trim();
    const kakaoMapUrl = `https://map.kakao.com/link/search/${encodeURIComponent(searchAddress)}`;

    return (
        <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-(--color-text-primary)">
                {name}
            </h1>

            <div className="flex flex-col items-center gap-2">
                <a
                    href={kakaoMapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-(--color-text-tertiary) hover:text-(--color-text-secondary) transition-colors group cursor-pointer mb-4"
                >
                    <MapPin className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
                    <p className="text-[13px] md:text-[14px] font-medium max-w-[280px] leading-relaxed underline-offset-4 group-hover:underline">
                        {address}
                    </p>
                </a>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/10 shadow-sm animate-in fade-in slide-in-from-top-1 duration-500">
                    <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-[12px] font-bold ">
                        <span>매물</span>{" "}
                        <span className="text-emerald-500">
                            {count > 999 ? "999+" : count.toLocaleString()}건
                        </span>{" "}
                        <span>보유 중</span>
                    </span>
                </div>
            </div>
        </div>
    );
}

export function ProfileBio({ text }: { text: string }) {
    const [displayedText, setDisplayedText] = React.useState("");

    React.useEffect(() => {
        let i = 0;
        setDisplayedText("");
        const timer = setInterval(() => {
            setDisplayedText(text.slice(0, i));
            i++;
            if (i > text.length) clearInterval(timer);
        }, 30);
        return () => clearInterval(timer);
    }, [text]);

    return (
        <div className="w-full max-w-sm mb-12 relative flex flex-col items-center">
            <p className="text-[14px] md:text-[15px] leading-relaxed text-center font-medium opacity-0 select-none pointer-events-none">
                {text}
            </p>

            <p className="text-[14px] md:text-[15px] text-(--color-text-secondary) leading-relaxed text-center font-medium absolute inset-0">
                {displayedText}
                <span className="inline-block w-1.5 h-4 ml-1 bg-(--color-accent) animate-pulse align-middle" />
            </p>
        </div>
    );
}

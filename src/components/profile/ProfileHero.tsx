
import React from "react";
import { Image } from "@/components/ui/Image";

interface ProfileHeroProps {
    name: string;
    description: string;
    imageUrl: string;
}

export function ProfileHero({ name, description, imageUrl }: ProfileHeroProps) {
    return (
        <section className="relative min-h-[50vh] md:h-[500px] w-full flex items-center justify-center">
            
            <div className="absolute inset-0 z-0">
                <Image
                    src={imageUrl}
                    alt="Agency Hero"
                    className="object-cover grayscale-[0.2] opacity-60 w-full h-full"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-(--color-bg-secondary)" />
            </div>

            <div className="container mx-auto px-6 relative z-10 text-center">
                <div className="max-w-3xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-7xl font-bold text-white tracking-tight drop-shadow-md">
                        {name}
                    </h1>
                    <div className="h-1.5 w-12 bg-(--color-accent) mx-auto rounded-full" />
                    <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed max-w-xl mx-auto drop-shadow-sm">
                        {description}
                    </p>
                </div>
            </div>
        </section>
    );
}

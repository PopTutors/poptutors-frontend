// components/SectionCard.tsx
import type { PropsWithChildren } from "react";

type SectionCardProps = PropsWithChildren<{
    title: string;
    subtitle?: string;
    className?: string;
}>;

export function SectionCard({ title, subtitle, className, children }: SectionCardProps) {
    return (
        <section
            className={`bg-card text-card-foreground shadow-xs p-8 md:p-10 ${className || ""}`}
        >
            <header className="mb-8">
                <h2 className="text-[24px] text-poppins font-semibold text-balance">{title}</h2>
                {subtitle ? <p className="text-base text-muted-foreground mt-2">{subtitle}</p> : null}
            </header>
            <div>{children}</div>
        </section>
    );
}

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
            className={`bg-card text-card-foreground border border-border rounded-xl p-6 md:p-8 ${className || ""}`}
        >
            <header className="mb-6">
                <h2 className="text-lg font-medium text-balance">{title}</h2>
                {subtitle ? <p className="text-sm text-muted-foreground mt-1">{subtitle}</p> : null}
            </header>
            <div>{children}</div>
        </section>
    );
}

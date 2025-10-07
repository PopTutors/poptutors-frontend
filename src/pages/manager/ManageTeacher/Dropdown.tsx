// src/pages/manager/ManageTeacher/components/Dropdown.tsx
import React, { useEffect, useRef, useState } from 'react';

export default function Dropdown({
    items,
    align = 'right',
}: {
    items: { key: string; label: React.ReactNode; danger?: boolean; onClick?: () => void }[];
    align?: 'left' | 'right';
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef < HTMLDivElement | null > (null);

    useEffect(() => {
        const listener = (event: MouseEvent) => {
            const el = ref.current;
            if (!el || el.contains(event.target as Node)) return;
            setOpen(false);
        };
        document.addEventListener('click', listener);
        return () => document.removeEventListener('click', listener);
    }, []);

    return (
        <div ref={ref} className="relative inline-block">
            <button type="button" aria-label="Open actions" onClick={() => setOpen((s) => !s)} className="p-1 w-8 h-8">
                {/* three dots */}
                <svg width="16" height="16" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>
            </button>

            {open ? (
                <div role="menu" className={`absolute z-50 mt-2 w-44 shadow-lg bg-card bg-white ${align === 'right' ? 'right-0' : 'left-0'}`}>
                    <div className="py-1">
                        {items.map((it) => (
                            <button
                                key={it.key}
                                type="button"
                                onClick={() => { it.onClick?.(); setOpen(false); }}
                                className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-muted ${it.danger ? 'text-destructive' : 'text-foreground'}`}
                            >
                                {it.label}
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
}

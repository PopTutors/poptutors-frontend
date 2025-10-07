// src/pages/manager/ManageTeacher/components/ImageWithFallback.tsx
import React, { useState } from 'react';

export default function ImageWithFallback({
    src,
    alt,
    className,
}: {
    src?: string | null;
    alt: string;
    className?: string;
}) {
    const [err, setErr] = useState(false);
    const showPlaceholder = !src || err;
    const placeholder =
        'https://plus.unsplash.com/premium_photo-1689977968861-9c91dbb16049?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cHJvZmlsZSUyMHBpY3R1cmV8ZW58MHx8MHx8fDA%3D';

    return (
        <div className={`w-full h-48 md:h-52 lg:h-56 overflow-hidden bg-muted ${className ?? ''} relative`} aria-hidden>
            <img
                src={showPlaceholder ? placeholder : src!}
                alt={alt}
                onError={() => setErr(true)}
                className="w-full h-full object-cover transition-transform duration-300 transform hover:scale-105"
            />
        </div>
    );
}

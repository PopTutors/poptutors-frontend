// src/components/SocialLinks.tsx
import React from "react";
import { Mail, Phone, Globe, Twitter, Instagram, Linkedin } from "lucide-react";
import { InstagramIcon, LinkedInIcon, MailIcon, PhoneIcon } from "../../../assets/managers";

export type SocialType = "email" | "phone" | "instagram" | "twitter" | "website" | "custom" | "linkedin";

export type SocialLink = {
    id: string;
    type: SocialType;
    label?: string;
    value: string; // visible text or raw value (url, username, email, phone)
    href?: string; // optional explicit href
};

function normalizeHref(type: SocialType, value: string | undefined): string | undefined {
    if (!value) return undefined;
    const v = value.trim();
    if (!v) return undefined;

    if (type === "email") {
        return v.startsWith("mailto:") ? v : `mailto:${v}`;
    }
    if (type === "phone") {
        // remove spaces, keep + if present
        const cleaned = v.replace(/\s+/g, "");
        return cleaned.startsWith("tel:") ? cleaned : `tel:${cleaned}`;
    }

    // website / social
    if (/^https?:\/\//i.test(v)) return v;
    // if looks like a domain or path, add https
    if (v.includes(".") || v.startsWith("/")) return `https://${v.replace(/^\/+/, "")}`;

    // For common usernames for IG/Twitter, convert to full URL
    if (type === "instagram") return `https://instagram.com/${v.replace(/^@/, "")}`;
    if (type === "linkedin") return `https://linkedin.com/${v.replace(/^@/, "")}`;
    if (type === "twitter") return `https://twitter.com/${v.replace(/^@/, "")}`;
    if (type === "website") return `https://${v.replace(/^\/+/, "")}`;

    // fallback
    return `https://${v}`;
}

function iconFor(type: SocialType) {
    switch (type) {
        case "email":
            return <img src={MailIcon} />;
        case "phone":
            return <img src={PhoneIcon} />;
        case "instagram":
            return <img src={InstagramIcon} />;
        case "twitter":
            return <Twitter className="w-[24px] h-[24px]" aria-hidden />;
        case "website":
            return <Globe className="w-[24px] h-[24px]" aria-hidden />;
        case "linkedin":
            return <img src={LinkedInIcon} />;
        case "custom":
        default:
            return <Globe className="w-[24px] h-[24px]" aria-hidden />;
    }
}

export const SocialLinks: React.FC<{ links: SocialLink[]; className?: string }> = ({ links, className = "" }) => {
    if (!Array.isArray(links) || links.length === 0) {
        return (
            <div className={`bg-white p-6 mb-6 shadow-sm ${className}`}>
                <h3 className="text-[20px] font-bold text-[#141414] mb-3">Social Links</h3>
                <p className="text-sm text-gray-500">No social links available.</p>
            </div>
        );
    }

    const items = links
        .map((l) => {
            if (!l?.value || !String(l.value).trim()) return null;
            const type = (l.type || "custom") as SocialType;
            const href = l.href || normalizeHref(type, l.value);
            return { id: l.id, type, label: l.label || (type.charAt(0).toUpperCase() + type.slice(1)), value: l.value, href };
        })
        .filter(Boolean) as { id: string; type: SocialType; label?: string; value: string; href?: string }[];

    return (
        <div className={`bg-white p-6 mb-6 shadow-sm space-y-4 ${className}`}>
            <h3 className="text-[20px] font-bold text-[#141414] mb-3">Social Links</h3>
            <div className="space-y-3">
                {items.map((it) => (
                    <div key={it.id} className="flex items-start gap-3">
                        {iconFor(it.type)}
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-700 font-medium">{it.label}</span>
                            {it.href ? (
                                <a
                                    href={it.href}
                                    target={it.type === "email" || it.type === "phone" ? undefined : "_blank"}
                                    rel={it.type === "email" || it.type === "phone" ? undefined : "noopener noreferrer"}
                                    className="text-blue-600 hover:underline text-sm break-all"
                                    aria-label={`${it.label}: ${it.value}`}
                                >
                                    {it.value}
                                </a>
                            ) : (
                                <span className="text-sm break-all" aria-label={`${it.label}: ${it.value}`}>{it.value}</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SocialLinks;

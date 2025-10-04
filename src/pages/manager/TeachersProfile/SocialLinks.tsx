import React from "react";
import { Mail, Phone, Globe, Twitter, Instagram } from "lucide-react";

export type SocialType =
    | "email"
    | "phone"
    | "instagram"
    | "twitter"
    | "website"
    | "custom";

export type SocialLink = {
    id: string;
    type: SocialType;
    label: string;
    value: string; // visible text
    href?: string; // optional, will be derived when missing
};

const iconFor = (type: SocialType) => {
    switch (type) {
        case "email":
            return <Mail className="w-5 h-5 text-gray-600" />;
        case "phone":
            return <Phone className="w-5 h-5 text-gray-600" />;
        case "instagram":
            return <Instagram className="w-5 h-5 text-gray-600" />;
        case "twitter":
            return <Twitter className="w-5 h-5 text-gray-600" />;
        case "website":
        case "custom":
        default:
            return <Globe className="w-5 h-5 text-gray-600" />;
    }
};

const normalizeHref = (link: SocialLink): string | undefined => {
    if (link.href && link.href.trim().length) return link.href;

    const v = link?.value?.trim();

    if (link.type === "email") {
        return `mailto:${v}`;
    }
    if (link.type === "phone") {
        const cleaned = v.replace(/\s+/g, ""); // remove spaces
        return `tel:${cleaned}`;
    }
    if (
        link.type === "website" ||
        link.type === "instagram" ||
        link.type === "twitter" ||
        link.type === "custom"
    ) {
        if (/^https?:\/\//i.test(v)) return v;
        return `https://${v}`;
    }

    return undefined;
};

interface SocialLinksProps {
    links: SocialLink[];
    className?: string;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
    links,
    className = "",
}) => {
    return (
        <div
            className={`bg-white p-6 mb-6 shadow-sm  space-y-4 ${className}`}
        >
            <h3 className="text-[20px] font-bold text-[#141414] mb-5">Social Links</h3>

            <div className="space-y-3">
                {links.map((link) => {
                    const href = normalizeHref(link);
                    return (
                        <div key={link.id} className="flex items-start gap-3">
                            {iconFor(link.type)}
                            <div className="flex flex-col">
                                <span className="text-sm text-gray-700">{link.label}</span>

                                {href ? (
                                    <a
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline text-sm break-all"
                                    >
                                        {link.value}
                                    </a>
                                ) : (
                                    <span className="text-sm">{link.value}</span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SocialLinks;

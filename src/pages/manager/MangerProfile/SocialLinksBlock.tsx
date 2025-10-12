import React from "react";
import {
    ManagerEditIcon,
    InstagramIcon,
    LinkedInIcon,
    FacebookIcon,
    MailIcon,
    LanguageIcon,
    LocationIcon,
    PhoneIcon,
    FileIcon, // fallback
} from "../../../assets/managers";

interface SocialLink {
    platform: string;
    url: string;
}

interface SocialLinksBlockProps {
    socialLinks: SocialLink[];
    onEdit: () => void;
}

export const SocialLinksBlock: React.FC<SocialLinksBlockProps> = ({
    socialLinks,
    onEdit,
}) => {
    // Map known platform names to their respective imported SVGs
    const iconMap: Record<string, string> = {
        instagram: InstagramIcon,
        linkedin: LinkedInIcon,
        facebook: FacebookIcon,
        website: LanguageIcon,
        email: MailIcon,
        phone: PhoneIcon,
        location: LocationIcon,
    };

    return (
        <div className="bg-white  shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-[20px] font-inter font-semibold text-gray-900">
                    Social Links
                </h2>
                <button
                    onClick={onEdit}
                    className="p-2 hover:bg-gray-100 rounded-full transition"
                    aria-label="Edit social links"
                >
                    <img
                        src={ManagerEditIcon}
                        alt="Edit"
                        className="w-5 h-5 object-contain"
                    />
                </button>
            </div>

            <div className="space-y-4">
                {socialLinks && socialLinks.length > 0 ? (
                    socialLinks.map((link, idx) => {
                        const iconSrc =
                            iconMap[link.platform.toLowerCase()] || FileIcon;
                        return (
                            <div
                                key={idx}
                                className="flex items-start gap-3 border-b pb-3 last:border-none"
                            >
                                {/* Icon */}
                                <div className="w-5 h-5 flex-shrink-0 mt-0.5">
                                    <img
                                        src={iconSrc}
                                        alt={link.platform}
                                        className="w-5 h-5 object-contain opacity-80"
                                    />
                                </div>

                                {/* Text + Link */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-gray-500 mb-1 capitalize">
                                        {link.platform}
                                    </p>
                                    <a
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[16px] font-inter text-[#0088ff] underline break-all"
                                    >
                                        {link.url}
                                    </a>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p className="text-sm text-gray-500">No social links added yet.</p>
                )}
            </div>
        </div>
    );
};

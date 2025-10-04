// components/SocialProfileForm.tsx
import { useState, useCallback } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useGenericMutation } from "../../../api/useGenericMutation";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "../../../assets/managers";
import { TwitterLogoIcon } from "@radix-ui/react-icons";
import { Globe, Plus, Trash2, ExternalLink } from "lucide-react";

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
}

interface RowProps {
    id: string;
    label: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemove?: () => void;
    showRemove?: boolean;
}

function Row({ id, label, placeholder, value, onChange, onRemove, showRemove = false }: RowProps) {
    // Map id to icon src
    const iconMap: Record<string, any> = {
        linkedin: LinkedInIcon,
        instagram: InstagramIcon,
        facebook: FacebookIcon,
        twitter: TwitterLogoIcon,
        dribbble: FacebookIcon,
        website: Globe,
    };

    const IconComponent = iconMap[id];

    const validateUrl = (url: string): boolean => {
        if (!url) return true; // Allow empty URLs
        try {
            new URL(url);
            return true;
        } catch {
            // If URL constructor fails, check if it's a valid domain
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
            return domainRegex.test(url);
        }
    };

    const isValidUrl = validateUrl(value);

    return (
        <div className="grid grid-cols-[40px_1fr] gap-3 lg:gap-4 items-start">
            <div className="flex items-center justify-center h-10 lg:h-12 w-10 bg-gray-50 rounded-lg mt-1">
                {id === 'website' ? (
                    <Globe className="h-5 w-5 text-gray-600" />
                ) : id === 'twitter' ? (
                    <TwitterLogoIcon className="h-5 w-5 text-gray-600" />
                ) : (
                    <img src={IconComponent} alt={label + ' icon'} className="h-5 w-5 object-contain" />
                )}
            </div>
            <div className="grid gap-2 flex-1">
                <Label htmlFor={id} className="text-sm lg:text-base text-muted-foreground">
                    {label}
                </Label>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Input
                            id={id}
                            type="url"
                            placeholder={placeholder}
                            value={value}
                            onChange={onChange}
                            className={`h-10 lg:h-12 pr-10 ${!isValidUrl ? 'border-red-300 focus:border-red-500' : ''}`}
                        />
                        {value && isValidUrl && (
                            <button
                                type="button"
                                onClick={() => window.open(value.startsWith('http') ? value : `https://${value}`, '_blank')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                    {showRemove && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onRemove}
                            className="h-10 lg:h-12 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
                {!isValidUrl && value && (
                    <p className="text-xs text-red-600">Please enter a valid URL</p>
                )}
                {isValidUrl && value && (
                    <p className="text-xs text-gray-500">
                        Preview: {value.length > 50 ? `${value.substring(0, 50)}...` : value}
                    </p>
                )}
            </div>
        </div>
    );
}

export function SocialProfileForm({ profile }) {
    // Initialize from profile socialLinks array or use defaults
    const initializeSocialLinks = (): Record<string, string> => {
        const defaultLinks = {
            linkedin: "",
            instagram: "",
            facebook: "",
            twitter: "",
            dribbble: "",
            website: "",
        };

        if (profile?.socialLinks && Array.isArray(profile.socialLinks)) {
            profile.socialLinks.forEach((link: any) => {
                if (link.platform && defaultLinks.hasOwnProperty(link.platform.toLowerCase())) {
                    defaultLinks[link.platform.toLowerCase() as keyof typeof defaultLinks] = link.url || "";
                }
            });
        }

        return defaultLinks;
    };

    const [socialLinks, setSocialLinks] = useState(initializeSocialLinks);
    const [customLinks, setCustomLinks] = useState < Array < { platform: string; url: string } >> ([]);

    const updateMutation = useGenericMutation();

    const handleInputChange = useCallback((platform: string, value: string) => {
        setSocialLinks(prev => ({ ...prev, [platform]: value }));
    }, []);

    const handleCustomLinkChange = useCallback((index: number, field: 'platform' | 'url', value: string) => {
        setCustomLinks(prev => prev.map((link, i) =>
            i === index ? { ...link, [field]: value } : link
        ));
    }, []);

    const addCustomLink = useCallback(() => {
        setCustomLinks(prev => [...prev, { platform: "", url: "" }]);
    }, []);

    const removeCustomLink = useCallback((index: number) => {
        setCustomLinks(prev => prev.filter((_, i) => i !== index));
    }, []);

    const validateForm = (): boolean => {
        // Validate main social links
        for (const [platform, url] of Object.entries(socialLinks)) {
            if (url && !validateUrl(url)) {
                alert(`Please enter a valid URL for ${platform}`);
                return false;
            }
        }

        // Validate custom links
        for (const link of customLinks) {
            if (link.platform && !link.url) {
                alert("Please provide URL for all custom platforms");
                return false;
            }
            if (link.url && !validateUrl(link.url)) {
                alert(`Please enter a valid URL for ${link.platform}`);
                return false;
            }
        }

        return true;
    };

    const validateUrl = (url: string): boolean => {
        if (!url) return true;
        try {
            new URL(url);
            return true;
        } catch {
            const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/;
            return domainRegex.test(url);
        }
    };

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        // Prepare socialLinks array
        const allLinks: Array<{ platform: string; url: string }> = [];

        // Add main social links (only non-empty ones)
        Object.entries(socialLinks).forEach(([platform, url]) => {
            if (url.trim()) {
                allLinks.push({
                    platform: platform.charAt(0).toUpperCase() + platform.slice(1),
                    url: url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`
                });
            }
        });

        // Add custom links (only complete ones)
        customLinks.forEach(link => {
            if (link.platform.trim() && link.url.trim()) {
                allLinks.push({
                    platform: link.platform.trim(),
                    url: link.url.trim().startsWith('http') ? link.url.trim() : `https://${link.url.trim()}`
                });
            }
        });

        updateMutation.mutate({
            endpoint: `/profile`,
            method: "PUT",
            data: { socialLinks: allLinks },
            successMessage: "Social links updated successfully",
            errorMessage: "Failed to update social links",
            invalidateKeys: [["profile"]],
        });
    }, [socialLinks, customLinks, updateMutation, validateForm]);

    const isLoading = updateMutation.isLoading;

    return (
        <div className="bg-white relative">
            <form className="grid gap-6 lg:gap-8" onSubmit={onSubmit}>
                {/* Main Social Links */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                    <Row
                        id="linkedin"
                        label="LinkedIn profile URL"
                        placeholder="Enter LinkedIn URL"
                        value={socialLinks.linkedin}
                        onChange={(e) => handleInputChange("linkedin", e.target.value)}
                    />
                    <Row
                        id="instagram"
                        label="Instagram profile URL"
                        placeholder="Enter Instagram URL"
                        value={socialLinks.instagram}
                        onChange={(e) => handleInputChange("instagram", e.target.value)}
                    />
                    <Row
                        id="facebook"
                        label="Facebook profile URL"
                        placeholder="Enter Facebook URL"
                        value={socialLinks.facebook}
                        onChange={(e) => handleInputChange("facebook", e.target.value)}
                    />
                    <Row
                        id="twitter"
                        label="Twitter profile URL"
                        placeholder="Enter Twitter URL"
                        value={socialLinks.twitter}
                        onChange={(e) => handleInputChange("twitter", e.target.value)}
                    />
                    <Row
                        id="dribbble"
                        label="Dribbble profile URL"
                        placeholder="Enter Dribbble URL"
                        value={socialLinks.dribbble}
                        onChange={(e) => handleInputChange("dribbble", e.target.value)}
                    />
                    <Row
                        id="website"
                        label="Personal Website"
                        placeholder="Enter website URL"
                        value={socialLinks.website}
                        onChange={(e) => handleInputChange("website", e.target.value)}
                    />
                </div>

                {/* Custom Links Section */}
                {customLinks.length > 0 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900">Custom Links</h3>
                        <div className="space-y-4">
                            {customLinks.map((link, index) => (
                                <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                                    <div className="grid gap-2">
                                        <Label className="text-sm lg:text-base text-muted-foreground">
                                            Platform Name
                                        </Label>
                                        <Input
                                            placeholder="e.g., YouTube, TikTok, Medium"
                                            className="h-10 lg:h-12"
                                            value={link.platform}
                                            onChange={(e) => handleCustomLinkChange(index, "platform", e.target.value)}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-sm lg:text-base text-muted-foreground">
                                            URL
                                        </Label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="url"
                                                placeholder="https://..."
                                                className="flex-1 h-10 lg:h-12"
                                                value={link.url}
                                                onChange={(e) => handleCustomLinkChange(index, "url", e.target.value)}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => removeCustomLink(index)}
                                                className="h-10 lg:h-12 px-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add Custom Link Button */}
                <div className="flex justify-start">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addCustomLink}
                        className="h-10 lg:h-12 px-4 text-sm lg:text-base"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Custom Link
                    </Button>
                </div>

                <hr className="my-4 lg:my-6 border-gray-200" />

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto min-w-24 h-10 lg:h-12 px-6 text-sm lg:text-base font-medium"
                        disabled={isLoading}
                        onClick={() => {
                            setSocialLinks(initializeSocialLinks());
                            setCustomLinks([]);
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-[#019ACB] hover:bg-[#019ACB]/90 text-white min-w-32 h-10 lg:h-12 px-6 text-sm lg:text-base font-medium shadow-none font-inter"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10">
                        <div className="flex items-center gap-2 text-[#019ACB]">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#019ACB] border-t-transparent"></div>
                            <span className="text-sm font-medium">Saving social links...</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

// components/SocialProfileForm.tsx
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "../../../assets/managers";
import { TwitterLogoIcon } from "@radix-ui/react-icons";

function Row({
    id,
    label,
    placeholder,
}: {
    id: string;
    label: string;
    placeholder: string;
}) {
    // Map id to icon src
    const iconMap: Record<string, string> = {
        linkedin: LinkedInIcon,
        instagram: InstagramIcon,
        facebook: FacebookIcon,
        twitter: FacebookIcon,
        dribbble: FacebookIcon,
        website: FacebookIcon,
    };
    return (
        <div className="grid grid-cols-[40px_1fr] gap-4 items-center">
            <div className="flex items-center justify-center h-10 w-10">
                <img src={iconMap[id]} alt={label + ' icon'} className="h-6 w-6 object-contain" />
            </div>
            <div className="grid gap-2">
                <Input id={id} placeholder={placeholder} />
            </div>
        </div>
    );
}

export function SocialProfileForm({ profile }) {
    const [linkedin, setLinkedin] = useState(profile?.linkedin || "");
    const [instagram, setInstagram] = useState(profile?.instagram || "");
    const [facebook, setFacebook] = useState(profile?.facebook || "");
    const [twitter, setTwitter] = useState(profile?.twitter || "");
    const [dribbble, setDribbble] = useState(profile?.dribbble || "");
    const [website, setWebsite] = useState(profile?.website || "");
    const onSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ linkedin, instagram, facebook, twitter, dribbble, website }),
        });
    };
    return (
        <div className="bg-white">
            <form className="grid gap-8" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Row id="linkedin" label="LinkedIn profile url" placeholder="Enter profile url" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                    <Row id="instagram" label="Instagram profile url" placeholder="Enter profile url" value={instagram} onChange={e => setInstagram(e.target.value)} />
                    <Row id="facebook" label="Facebook profile url" placeholder="Enter profile url" value={facebook} onChange={e => setFacebook(e.target.value)} />
                    <Row id="twitter" label="Twitter profile url" placeholder="Enter profile url" value={twitter} onChange={e => setTwitter(e.target.value)} />
                    <Row id="dribbble" label="Dribbble profile url" placeholder="Enter profile url" value={dribbble} onChange={e => setDribbble(e.target.value)} />
                    <Row id="website" label="Personal Website" placeholder="Add your personal website link" value={website} onChange={e => setWebsite(e.target.value)} />
                </div>
                <hr className="my-6 border-gray-200" />
                <div>
                    <Button type="submit" className="bg-[#019ACB] hover:bg-[#019ACB] text-white min-w-32 h-10 px-6 text-base font-medium shadow-none text-[16px] font-inter">Save &amp; Change</Button>
                </div>
            </form>
        </div>
    );
}

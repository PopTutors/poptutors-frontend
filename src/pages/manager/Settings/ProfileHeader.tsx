// components/ProfileHeader.tsx
import { MapPin } from "lucide-react";
import { FlagIcon, Person, ProfileEdit } from "../../../assets/managers";
import { Button } from "../../../components/ui/button";
interface Profile {
    name: string;
    title: string;
    location: string;
    openForOpportunities: boolean;
    about: string;
    email: string;
    phone: string;
    languages: string;
}

const initialProfile: Profile = {
    name: 'Jake Gyll',
    title: 'Product Designer at Twitter',
    location: 'Manchester, UK',
    openForOpportunities: true,
    about:
        "I'm a product designer + filmmaker currently working remotely at Twitter from beautiful Manchester, United Kingdom. I'm passionate about designing digital products that have a positive impact on the world.\n\nFor 10 years, I've specialised in interface, experience & interaction design as well as working in user research and product strategy for product agencies, big tech companies & start-ups.",
    email: 'jakegyll@email.com',
    phone: '+44 1245 572 135',
    languages: 'English, French',
};
export function ProfileHeader({ profile }) {
    const user = profile?.userId || {};
    return (
        <div className="p-6 mb-6">
            <div className="flex items-start gap-4">
                <div className="relative">
                    <div className="relative">
                        <img
                            src={profile?.profileImage || Person}
                            alt={user.name || "Profile"}
                            className="w-[160px] h-[160px] rounded-full object-cover"
                        />
                        <img
                            src={ProfileEdit}
                            alt="Edit"
                            className="w-10 h-10 absolute bottom-2 right-2 bg-white border border-gray-200 rounded-full"
                        />
                    </div>
                </div>
                <div className="flex-1 items-center self-center">
                    <h1 className="text-[24px] font-semibold text-gray-900">{user.name}</h1>
                    <p className="text-[18px] text-gray-600 mb-2">{profile?.experience || ""}</p>
                    <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                        <MapPin className="w-[18px] h-[18px]" />
                        <span className="text-[18px] text-[#595959]">{profile?.country || ""}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">{user.email}</div>
                    <div className="text-sm text-muted-foreground mb-2">Mobile: {profile?.mobile || ""}</div>
                    <div className="text-sm text-muted-foreground mb-2">Language: {profile?.preferredLanguage || ""}</div>
                </div>
            </div>
        </div>
    );
}

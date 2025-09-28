// pages/ProfileSettingsPage.tsx
import React from "react";
import { useFetch } from "../../api";
import { ProfileHeader } from "./Settings/ProfileHeader";
import { SectionCard } from "./Settings/SectionCard";
import { AccountSettingsForm } from "./Settings/AccountSettingsForm";
import { SocialProfileForm } from "./Settings/SocialProfileForm";
import { TwoFAForm } from "./Settings/TwoFAForm";

export default function Settings() {
    const { data: profile, isLoading } = useFetch(
        ["profile"],
        `/profile`,
        true,
        { requiresAuth: true }
    );

    return (
        <div className="min-h-screen">
            <div className="mx-auto space-y-6">
                <ProfileHeader profile={profile} loading={isLoading} />

                <SectionCard title="Account Settings" className="mt-2 shadow-sm bg-white rounded-[8px]">
                    <AccountSettingsForm profile={profile} />
                </SectionCard>

                <SectionCard title="Social Profile" className="mt-2 shadow-sm bg-white rounded-[8px]">
                    <SocialProfileForm profile={profile} />
                </SectionCard>

                <SectionCard title="2FA Verification" className="mt-2 shadow-sm bg-white rounded-[8px]">
                    <TwoFAForm profile={profile} />
                </SectionCard>
            </div>
        </div>
    );
}

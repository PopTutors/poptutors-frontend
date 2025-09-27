// pages/ProfileSettingsPage.tsx
import React from "react";
import { ProfileHeader } from "./Settings/ProfileHeader";
import { SectionCard } from "./Settings/SectionCard";
import { AccountSettingsForm } from "./Settings/AccountSettingsForm";
import { SocialProfileForm } from "./Settings/SocialProfileForm";
import { TwoFAForm } from "./Settings/TwoFAForm";

export default function Settings() {
    return (
        <div className="min-h-screen bg-background py-10 px-6 md:px-12">
            <div className="max-w-5xl mx-auto space-y-6">
                <ProfileHeader />

                <SectionCard title="Account Settings">
                    <AccountSettingsForm />
                </SectionCard>

                <SectionCard title="Social Profile">
                    <SocialProfileForm />
                </SectionCard>

                <SectionCard title="2FA Verification">
                    <TwoFAForm />
                </SectionCard>
            </div>
        </div>
    );
}

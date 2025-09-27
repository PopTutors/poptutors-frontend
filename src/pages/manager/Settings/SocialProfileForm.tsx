// components/SocialProfileForm.tsx
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { Checkbox } from "../../../components/ui/checkbox";

function Row({
    id,
    label,
    placeholder,
}: {
    id: string;
    label: string;
    placeholder: string;
}) {
    return (
        <div className="grid grid-cols-[1fr_auto] gap-3">
            <div className="grid gap-2">
                <Label htmlFor={id} className="text-muted-foreground">
                    {label}
                </Label>
                <Input id={id} placeholder={placeholder} />
            </div>
            <div className="flex items-end pb-2">
                <Checkbox aria-label={`${label} visible`} />
            </div>
        </div>
    );
}

export function SocialProfileForm() {
    // If you want controlled values, add them similarly to AccountSettingsForm
    return (
        <form className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Row id="linkedin" label="LinkedIn profile url" placeholder="Enter profile url" />
                <Row id="instagram" label="Instagram profile url" placeholder="Enter profile url" />
                <Row id="facebook" label="Facebook profile url" placeholder="Enter profile url" />
                <Row id="twitter" label="Twitter profile url" placeholder="Enter profile url" />
                <Row id="dribbble" label="Dribbble profile url" placeholder="Enter profile url" />
                <Row id="website" label="Personal Website" placeholder="Add your personal website link" />
            </div>
            <div>
                <Button className="min-w-32">Save &amp; Change</Button>
            </div>
        </form>
    );
}

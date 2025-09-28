// components/TwoFAForm.tsx
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export function TwoFAForm({ profile }) {
    const [email, setEmail] = useState(profile?.userId?.email || "");
    const [phone, setPhone] = useState(profile?.mobile || "");

    const requestEmailOtp = async () => {
        await fetch(`/profile/request-email-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
    };
    const requestPhoneOtp = async () => {
        await fetch(`/profile/request-phone-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        await fetch(`/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, mobile: phone }),
        });
    };

    return (
        <div className="bg-white">
            <form className="grid gap-8" onSubmit={onSubmit}>
                <div className="grid gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-muted-foreground">
                            Email Verification
                        </Label>
                        <div className="flex gap-2">
                            <Input id="email" placeholder="Enter your email" className="flex-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                            <Button className="bg-[#019ACB] hover:bg-[#019ACB] text-white min-w-24 h-10 px-4 text-base font-medium shadow-none text-[16px] font-inter" onClick={requestEmailOtp}>Get OTP</Button>
                        </div>
                    </div>

                    {/* <div className="grid gap-2">
                        <Label htmlFor="phone2" className="text-muted-foreground">
                            Phone Verification
                        </Label>
                        <div className="flex gap-2">
                            <Input id="phone2" placeholder="Enter your phone number" className="flex-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                            <Button className="bg-[#019ACB] hover:bg-[#019ACB] text-white min-w-24 h-10 rounded px-4 text-base font-medium shadow-none text-[16px] font-inter" onClick={requestPhoneOtp}>Get OTP</Button>
                        </div>
                    </div> */}
                </div>
                <hr className="my-6 border-gray-200" />
                <div>
                    <Button type="submit" className="bg-[#019ACB] hover:bg-[#019ACB] text-white min-w-32 h-10  px-6 text-base font-medium shadow-none text-[16px] font-inter">Send</Button>
                </div>
            </form>
        </div>
    );
}

// components/TwoFAForm.tsx
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export function TwoFAForm() {
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const requestEmailOtp = () => {
        // hook OTP flow
        console.log("request email OTP for", email);
    };
    const requestPhoneOtp = () => {
        console.log("request phone OTP for", phone);
    };
    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("2FA submit");
    };

    return (
        <form className="grid gap-6" onSubmit={onSubmit}>
            <div className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email" className="text-muted-foreground">
                        Email Verification
                    </Label>
                    <div className="flex gap-2">
                        <Input id="email" placeholder="Enter your email" className="flex-1" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <Button variant="secondary" onClick={requestEmailOtp}>Get OTP</Button>
                    </div>
                </div>

                <div className="grid gap-2">
                    <Label htmlFor="phone2" className="text-muted-foreground">
                        Phone Verification
                    </Label>
                    <div className="flex gap-2">
                        <Input id="phone2" placeholder="Enter your phone number" className="flex-1" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        <Button variant="secondary" onClick={requestPhoneOtp}>Get OTP</Button>
                    </div>
                </div>
            </div>

            <div>
                <Button className="min-w-24" type="submit">Send</Button>
            </div>
        </form>
    );
}

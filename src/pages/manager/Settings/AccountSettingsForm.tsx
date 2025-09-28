// components/AccountSettingsForm.tsx
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export function AccountSettingsForm({ profile }) {
    const user = profile?.userId || {};
    const [firstName, setFirstName] = useState(user.name || "");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState(user.email || "");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState(profile?.mobile || "");

    const onSubmit = async (e) => {
        e.preventDefault();
        // API call to update profile
        await fetch(`/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: firstName, email: username, password, mobile: phone }),
        });
    };

    return (
        <div className="bg-white">
            <form className="grid gap-8" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="grid gap-2">
                        <Label htmlFor="firstName" className="text-muted-foreground">
                            Full name
                        </Label>
                        <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Enter your name" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="lastName" className="text-muted-foreground">
                            Last name
                        </Label>
                        <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Enter your last name" />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-muted-foreground">
                            Username
                        </Label>
                        <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your username" />
                    </div>

                    <div className="grid gap-2 w-full">
                        <Label htmlFor="password" className="text-muted-foreground">
                            Password
                        </Label>
                        <div className="flex items-center justify-between gap-2 ">
                            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-[500px]" />
                            <a href="#" className="w-[150px] text-[14px] text-[#019ACB] flex-nowrap">
                                Change password
                            </a>
                        </div>

                    </div>

                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="phone" className="text-muted-foreground">
                            Phone Number
                        </Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 **********" />
                    </div>
                </div>
                <hr className="my-6 border-gray-200" />
                <div>
                    <Button type="submit" className="bg-[#019ACB] hover:bg-[#019ACB] text-white min-w-32 h-10 px-6 text-base font-medium shadow-none text-[16px] font-inter">Save &amp; Change</Button>
                </div>
            </form>
        </div>
    );
}

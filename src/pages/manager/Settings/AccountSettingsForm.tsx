// components/AccountSettingsForm.tsx
import { useState } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";

export function AccountSettingsForm() {
    // basic local state so it's ready to hook to API
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // hook up API call here
        console.log({ firstName, lastName, username, password, phone });
    };

    return (
        <form className="grid gap-6" onSubmit={onSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-muted-foreground">
                            Password
                        </Label>
                        <a href="#" className="text-xs text-muted-foreground underline-offset-4 hover:underline">
                            Change password
                        </a>
                    </div>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" />
                </div>

                <div className="grid gap-2 md:col-span-2">
                    <Label htmlFor="phone" className="text-muted-foreground">
                        Phone Number
                    </Label>
                    <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 **********" />
                </div>
            </div>

            <div>
                <Button type="submit" className="min-w-32">Save &amp; Change</Button>
            </div>
        </form>
    );
}

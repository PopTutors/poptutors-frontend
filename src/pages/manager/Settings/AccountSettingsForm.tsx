// components/AccountSettingsForm.tsx
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom"; // or "next/router" for pages router
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useGenericMutation } from "../../../api/useGenericMutation";
import { ExternalLink } from "lucide-react";

export function AccountSettingsForm({ profile }) {
    const user = profile?.userId || {};
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        firstName: user.name || "",
        lastName: "",
        username: user.email || "",
        phone: profile?.mobile || "",
    });

    const updateMutation = useGenericMutation();

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleResetPasswordClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        // Navigate to reset password page
        navigate('/reset-password');
    }, [navigate]);

    const onSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare payload
        const payload = {
            name: formData.firstName.trim(),
            email: formData.username.trim(),
            mobile: formData.phone.trim(),
        };

        // Validate required fields
        if (!payload.name || !payload.email) {
            alert("Please fill in all required fields");
            return;
        }

        updateMutation.mutate({
            endpoint: `/profile`,
            method: "PUT",
            data: payload,
            successMessage: "Profile updated successfully",
            errorMessage: "Failed to update profile",
            invalidateKeys: [["profile"]],
        });
    }, [formData, updateMutation]);

    const isLoading = updateMutation.isLoading;

    return (
        <div className="bg-white relative">
            <form className="grid gap-6 lg:gap-8" onSubmit={onSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
                    {/* First Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="firstName" className="text-sm lg:text-base text-muted-foreground">
                            Full name *
                        </Label>
                        <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            placeholder="Enter your name"
                            className="h-10 lg:h-12"
                            required
                        />
                    </div>

                    {/* Last Name */}
                    <div className="grid gap-2">
                        <Label htmlFor="lastName" className="text-sm lg:text-base text-muted-foreground">
                            Last name
                        </Label>
                        <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            placeholder="Enter your last name"
                            className="h-10 lg:h-12"
                        />
                    </div>

                    {/* Username/Email */}
                    <div className="grid gap-2">
                        <Label htmlFor="username" className="text-sm lg:text-base text-muted-foreground">
                            Username (Email) *
                        </Label>
                        <Input
                            id="username"
                            type="email"
                            value={formData.username}
                            onChange={(e) => handleInputChange("username", e.target.value)}
                            placeholder="Enter your email"
                            className="h-10 lg:h-12"
                            required
                        />
                    </div>

                    {/* Password Section - Now shows reset link */}
                    <div className="grid gap-2">
                        <Label className="text-sm lg:text-base text-muted-foreground">
                            Password
                        </Label>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                            <div className="flex-1">
                                <Input
                                    type="password"
                                    value="••••••••••••"
                                    className="h-10 lg:h-12"
                                    disabled
                                    readOnly
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleResetPasswordClick}
                                className="inline-flex items-center gap-2 text-sm lg:text-[14px] text-[#019ACB] hover:text-[#017ba3] underline whitespace-nowrap sm:w-auto w-full justify-start sm:justify-center transition-colors"
                            >
                                <span>Reset Password</span>
                                <ExternalLink className="h-3 w-3" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500">
                            Click "Reset Password" to change your password securely
                        </p>
                    </div>

                    {/* Phone Number - Full width on mobile, spans 2 columns on desktop */}
                    <div className="grid gap-2 md:col-span-2">
                        <Label htmlFor="phone" className="text-sm lg:text-base text-muted-foreground">
                            Phone Number
                        </Label>
                        <div className="max-w-md">
                            <Input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                placeholder="+91 **********"
                                className="h-10 lg:h-12"
                            />
                        </div>
                    </div>
                </div>

                <hr className="my-4 lg:my-6 border-gray-200" />

                {/* Submit Button */}
                <div className="flex flex-col justify-start sm:flex-row gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full sm:w-auto min-w-24 h-10 lg:h-12 px-6 text-sm lg:text-base font-medium"
                        disabled={isLoading}
                        onClick={() => {
                            // Reset form to original values
                            setFormData({
                                firstName: user.name || "",
                                lastName: "",
                                username: user.email || "",
                                phone: profile?.mobile || "",
                            });
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full sm:w-auto bg-[#019ACB] hover:bg-[#019ACB]/90 text-white min-w-32 h-10 lg:h-12 px-6 text-sm lg:text-base font-medium shadow-none font-inter"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </div>

                {/* Loading overlay for better UX */}
                {isLoading && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10">
                        <div className="flex items-center gap-2 text-[#019ACB]">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#019ACB] border-t-transparent"></div>
                            <span className="text-sm font-medium">Updating profile...</span>
                        </div>
                    </div>
                )}
            </form>
        </div>
    );
}

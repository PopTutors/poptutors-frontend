// components/TwoFAForm.tsx
import { useState, useCallback } from "react";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useGenericMutation } from "../../../api/useGenericMutation";
import { Mail, Shield, CheckCircle, AlertCircle } from "lucide-react";

export function TwoFAForm({ profile }) {
    const [formData, setFormData] = useState({
        email: profile?.userId?.email || "",
        otp: "",
    });

    const [verificationState, setVerificationState] = useState < "initial" | "otp-sent" | "verified" > ("initial");
    const [isEmailVerified, setIsEmailVerified] = useState(profile?.isEmailVerified || false);

    // Mutations
    const sendOtpMutation = useGenericMutation();
    const verifyOtpMutation = useGenericMutation();

    const handleInputChange = useCallback((field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    const handleSendOtp = useCallback(async (e?: React.MouseEvent) => {
        if (e) e.preventDefault();

        if (!formData.email) {
            alert("Please enter your email address");
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert("Please enter a valid email address");
            return;
        }

        sendOtpMutation.mutate({
            endpoint: `/auth/verify-email`,
            method: "POST",
            data: { email: formData.email },
            successMessage: "OTP sent to your email successfully",
            errorMessage: "Failed to send OTP. Please try again",
            onSuccessCallback: () => {
                setVerificationState("otp-sent");
                setFormData(prev => ({ ...prev, otp: "" }));
            },
        });
    }, [formData.email, sendOtpMutation]);

    const handleVerifyOtp = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.otp) {
            alert("Please enter the OTP");
            return;
        }

        if (formData.otp.length !== 6) {
            alert("OTP must be 6 digits");
            return;
        }

        verifyOtpMutation.mutate({
            endpoint: `/auth/verify-otp`,
            method: "POST",
            data: {
                email: formData.email,
                otp: formData.otp
            },
            successMessage: "Email verified successfully!",
            errorMessage: "Invalid OTP. Please try again",
            invalidateKeys: [["profile"]], // Invalidate profile cache
            onSuccessCallback: () => {
                setVerificationState("verified");
                setIsEmailVerified(true);
                setFormData(prev => ({ ...prev, otp: "" }));
            },
        });
    }, [formData, verifyOtpMutation]);

    const handleResendOtp = useCallback(() => {
        handleSendOtp();
    }, [handleSendOtp]);

    const resetVerification = useCallback(() => {
        setVerificationState("initial");
        setFormData(prev => ({ ...prev, otp: "" }));
    }, []);

    const isSendingOtp = sendOtpMutation.isLoading;
    const isVerifyingOtp = verifyOtpMutation.isLoading;

    return (
        <div className="bg-white">
            <div className="grid gap-6 lg:gap-8">
                {/* Email Verification Status */}
                {isEmailVerified && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">Email Verified</p>
                            <p className="text-xs text-green-600">Your email address has been successfully verified</p>
                        </div>
                    </div>
                )}

                {/* Email Input Section */}
                <div className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email" className="text-sm lg:text-base text-muted-foreground flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            Email Verification
                        </Label>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <div className="relative flex-1">
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="Enter your email"
                                    className="h-10 lg:h-12 pr-10"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    disabled={verificationState === "otp-sent" || isEmailVerified}
                                />
                                {isEmailVerified && (
                                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-600" />
                                )}
                            </div>
                            <Button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp || !formData.email || isEmailVerified}
                                className="w-full sm:w-auto bg-[#019ACB] hover:bg-[#019ACB]/90 text-white min-w-24 h-10 lg:h-12 px-4 text-sm lg:text-base font-medium shadow-none font-inter"
                            >
                                {isSendingOtp ? "Sending..." : "Get OTP"}
                            </Button>
                        </div>
                    </div>

                    {/* OTP Sent Notification */}
                    {verificationState === "otp-sent" && (
                        <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-800">OTP Sent</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    We've sent a 6-digit verification code to <strong>{formData.email}</strong>.
                                    Please check your inbox and spam folder.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* OTP Input Section */}
                {verificationState === "otp-sent" && (
                    <form onSubmit={handleVerifyOtp} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="otp" className="text-sm lg:text-base text-muted-foreground flex items-center gap-2">
                                <Shield className="h-4 w-4" />
                                Enter Verification Code
                            </Label>
                            <div className="flex flex-col sm:flex-row gap-2">
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="Enter 6-digit OTP"
                                    className="h-10 lg:h-12 text-center text-lg tracking-wider"
                                    value={formData.otp}
                                    onChange={(e) => {
                                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                        handleInputChange("otp", value);
                                    }}
                                    maxLength={6}
                                    required
                                />
                                <div className="flex gap-2">
                                    <Button
                                        type="submit"
                                        disabled={isVerifyingOtp || formData.otp.length !== 6}
                                        className="flex-1 sm:flex-initial bg-[#019ACB] hover:bg-[#019ACB]/90 text-white min-w-24 h-10 lg:h-12 px-4 text-sm lg:text-base font-medium shadow-none font-inter"
                                    >
                                        {isVerifyingOtp ? "Verifying..." : "Verify"}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleResendOtp}
                                        disabled={isSendingOtp}
                                        className="flex-1 sm:flex-initial min-w-24 h-10 lg:h-12 px-4 text-sm lg:text-base font-medium"
                                    >
                                        {isSendingOtp ? "Sending..." : "Resend"}
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-gray-500">
                                Enter the 6-digit code sent to your email address
                            </p>
                        </div>
                    </form>
                )}

                {/* Success State */}
                {verificationState === "verified" && (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-green-800">Verification Complete!</p>
                            <p className="text-xs text-green-600">Your email has been successfully verified</p>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={resetVerification}
                            className="text-xs"
                        >
                            Verify Another
                        </Button>
                    </div>
                )}

                <hr className="my-4 lg:my-6 border-gray-200" />

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
                    {verificationState === "otp-sent" && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={resetVerification}
                            className="w-full sm:w-auto min-w-24 h-10 lg:h-12 px-6 text-sm lg:text-base font-medium"
                        >
                            Change Email
                        </Button>
                    )}

                    {!isEmailVerified && verificationState === "initial" && (
                        <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp || !formData.email}
                            className="w-full sm:w-auto bg-[#019ACB] hover:bg-[#019ACB]/90 text-white min-w-32 h-10 lg:h-12 px-6 text-sm lg:text-base font-medium shadow-none font-inter"
                        >
                            {isSendingOtp ? "Sending OTP..." : "Start Verification"}
                        </Button>
                    )}
                </div>

                {/* Loading overlay */}
                {(isSendingOtp || isVerifyingOtp) && (
                    <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg z-10">
                        <div className="flex items-center gap-2 text-[#019ACB]">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#019ACB] border-t-transparent"></div>
                            <span className="text-sm font-medium">
                                {isSendingOtp ? "Sending OTP..." : "Verifying..."}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

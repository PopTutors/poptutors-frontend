import { useState, useEffect } from "react";
import { Camera, Facebook, YoutubeIcon, Flag } from "lucide-react";
import OTPModal from "./OTPModal";
import { InstagramLogoIcon, LinkedInLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import api from "../../lib/api";

export default function Settings() {
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpCooldown, setOtpCooldown] = useState(0);
    const [resendCooldown, setResendCooldown] = useState(0);

    // Form values
    const [accountForm, setAccountForm] = useState({
        firstName: "",
        lastName: "",
        username: "",
        password: "",
        phone: ""
    });

    const [socialForm, setSocialForm] = useState({
        linkedin: "",
        instagram: "",
        facebook: "",
        twitter: "",
        youtube: "",
        website: ""
    });

    const [verificationForm, setVerificationForm] = useState({
        email: "",
        phone: ""
    });

    const [profileData, setProfileData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        phone: "",
        email: "",
        socialProfiles: {
            linkedin: "",
            instagram: "",
            facebook: "",
            twitter: "",
            youtube: "",
            website: ""
        }
    });

    // Helper function to get input border color based on validation
    const getInputClassName = (isValid: boolean | null, baseClass: string) => {
        if (isValid === null) return baseClass;
        if (isValid) return `${baseClass} border-green-500 focus:ring-green-500`;
        return `${baseClass} border-red-500 focus:ring-red-500`;
    };

    // Format cooldown time as MM:SS
    const formatCooldownTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle input validation state
    const handleInputValidation = (e: React.FormEvent<HTMLInputElement>) => {
        const input = e.currentTarget;
        const parent = input.closest('.border');

        // Force revalidation
        input.checkValidity();

        if (input.value === "") {
            // Empty state - reset to default
            input.classList.remove("border-green-500", "border-red-500", "focus:ring-green-500", "focus:ring-red-500");
            input.classList.add("border-gray-300");
            parent?.classList.remove("border-green-500", "border-red-500");
            parent?.classList.add("border-gray-300");
        } else if (input.validity.valid) {
            // Valid state - green border
            input.classList.remove("border-red-500", "focus:ring-red-500", "border-gray-300");
            input.classList.add("border-green-500", "focus:ring-green-500");
            parent?.classList.remove("border-red-500", "border-gray-300");
            parent?.classList.add("border-green-500");
        } else {
            // Invalid state - red border
            input.classList.remove("border-green-500", "focus:ring-green-500", "border-gray-300");
            input.classList.add("border-red-500", "focus:ring-red-500");
            parent?.classList.remove("border-green-500", "border-gray-300");
            parent?.classList.add("border-red-500");
        }
    };

    // Fetch user profile data on component mount
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                // API Call to fetch user profile
                // const response = await api.get('/teacher/profile');
                // 
                // Expected API Response Format:
                // {
                //     success: true,
                //     data: {
                //         firstName: "Jake",
                //         lastName: "Gyll",
                //         username: "jakegyll",
                //         phone: "+91 1234567890",
                //         email: "jake@example.com",
                //         profilePicture: "https://...",
                //         jobTitle: "Product Designer at Twitter",
                //         location: "Manchester, UK",
                //         socialProfiles: {
                //             linkedin: "https://linkedin.com/in/jakegyll",
                //             instagram: "https://instagram.com/jakegyll",
                //             facebook: "https://facebook.com/jakegyll",
                //             twitter: "https://twitter.com/jakegyll",
                //             youtube: "https://youtube.com/@jakegyll",
                //             website: "https://jakegyll.com"
                //         }
                //     }
                // }
                //
                // if (response.success) {
                //     setProfileData(response.data);
                // }

                // Using dummy data for now
                console.log("Fetching profile data...");
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    // OTP Cooldown Timer
    useEffect(() => {
        if (otpCooldown > 0) {
            const timer = setTimeout(() => {
                setOtpCooldown(otpCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [otpCooldown]);

    // Resend OTP Cooldown Timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => {
                setResendCooldown(resendCooldown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendCooldown]);

    // Check if account form has any values
    const isAccountFormEmpty = () => {
        return !accountForm.firstName && !accountForm.lastName &&
            !accountForm.username && !accountForm.password && !accountForm.phone;
    };

    // Check if social form has any values
    const isSocialFormEmpty = () => {
        return !socialForm.linkedin && !socialForm.instagram &&
            !socialForm.facebook && !socialForm.twitter &&
            !socialForm.youtube && !socialForm.website;
    };

    const handleSaveAccountSettings = async () => {
        try {
            // API Call to update account settings
            // const response = await api.put('/teacher/profile/account', {
            //     firstName: profileData.firstName,
            //     lastName: profileData.lastName,
            //     username: profileData.username,
            //     phone: profileData.phone
            // });
            //
            // if (response.success) {
            //     alert("Account settings saved successfully!");
            // }

            console.log("Saving account settings...");
        } catch (error) {
            console.error("Error saving account settings:", error);
        }
    };

    const handleSaveSocialProfiles = async () => {
        try {
            // API Call to update social profiles
            // const response = await api.put('/teacher/profile/social', {
            //     socialProfiles: profileData.socialProfiles
            // });
            //
            // if (response.success) {
            //     alert("Social profiles saved successfully!");
            // }

            console.log("Saving social profiles...");
        } catch (error) {
            console.error("Error saving social profiles:", error);
        }
    };

    const handleGetOTP = async () => {
        if (otpCooldown > 0) {
            return; // Don't send OTP if cooldown is active
        }

        try {
            // API Call to send OTP
            // const response = await api.post('/teacher/auth/send-otp', {
            //     email: verificationForm.email,
            //     phone: verificationForm.phone
            // });
            //
            // if (response.success) {
            //     setShowOTPModal(true);
            //     setOtpCooldown(120); // 2 minutes = 120 seconds
            //     setResendCooldown(120); // Start resend cooldown
            // }

            console.log("Sending OTP...");
            setShowOTPModal(true);
            setOtpCooldown(120); // Start 2-minute cooldown for Get OTP button
            setResendCooldown(120); // Start 2-minute cooldown for Resend button
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    const handleResendOTP = async () => {
        if (resendCooldown > 0) {
            return; // Don't resend if cooldown is active
        }

        try {
            // API Call to resend OTP
            // const response = await api.post('/teacher/auth/send-otp', {
            //     email: verificationForm.email,
            //     phone: verificationForm.phone
            // });
            //
            // if (response.success) {
            //     setResendCooldown(120); // Restart 2-minute cooldown
            // }

            console.log("Resending OTP...");
            setResendCooldown(120); // Restart 2-minute cooldown
        } catch (error) {
            console.error("Error resending OTP:", error);
        }
    };

    const handleVerifyOTP = async (otp: string) => {
        try {
            // API Call to verify OTP
            // const response = await api.post('/teacher/auth/verify-otp', {
            //     otp: otp,
            //     email: profileData.email
            // });
            //
            // if (response.success) {
            //     alert("OTP verified successfully!");
            //     setShowOTPModal(false);
            // }

            console.log("Verifying OTP:", otp);
            setShowOTPModal(false);
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };

    return (
        <div className="w-full h-full bg-gray-50 overflow-y-auto">
            <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Setting</h1>
                </div>

                {/* Profile Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-start gap-x-6">
                        {/* Profile Picture */}
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-cyan-500 flex items-center justify-center overflow-hidden">
                                <img
                                    src="https://via.placeholder.com/96"
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center hover:bg-gray-50">
                                <Camera className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        {/* Profile Info */}
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">Jake Gyll</h2>
                            <p className="text-sm text-gray-600 mb-2">Product Designer at Twitter</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                                <span>📍</span>
                                <span>Manchester, UK</span>
                            </div>
                            <button className="flex items-center gap-2 px-4 py-1.5 bg-green-50 text-green-600 text-sm rounded hover:bg-green-100 transition-colors">
                                <Flag className="w-4 h-4" />
                                OPEN FOR OPPORTUNITIES
                            </button>
                        </div>
                    </div>
                </div>

                {/* Account Settings */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Full name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your name"
                                pattern="[A-Za-z\s]+"
                                title="Please enter a valid name (letters and spaces only)"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid name");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Last name
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your last name"
                                pattern="[A-Za-z\s]+"
                                title="Please enter a valid last name (letters and spaces only)"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid last name");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                pattern="[A-Za-z0-9_]{3,20}"
                                title="Username must be 3-20 characters (letters, numbers, underscore only)"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid username");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    placeholder="Enter your password"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                />
                                <button className="text-cyan-600 text-sm hover:underline whitespace-nowrap">
                                    Change password
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            placeholder="+1 *****"
                            pattern="[0-9+\-\s()]+"
                            title="Please enter a valid phone number"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            onKeyPress={(e) => {
                                if (!/[0-9+\-\s()]/.test(e.key)) {
                                    e.preventDefault();
                                }
                            }}
                            onInvalid={(e) => {
                                e.currentTarget.setCustomValidity("Please enter a valid phone number");
                            }}
                            onInput={(e) => {
                                e.currentTarget.setCustomValidity("");
                                handleInputValidation(e);
                            }}
                            onChange={handleInputValidation}
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <button
                            onClick={handleSaveAccountSettings}
                            className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
                        >
                            Save & Change
                        </button>
                    </div>
                </div>

                {/* Social Profile */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Profile</h3>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded">
                            <LinkedInLogoIcon className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Linkedin profile url"
                                pattern="^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
                                title="Please enter a valid URL (e.g., www.linkedin.com or https://linkedin.com)"
                                className="flex-1 outline-none text-sm border-0 focus:ring-0"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid LinkedIn URL");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded">
                            <InstagramLogoIcon className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Instagram profile url"
                                pattern="^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
                                title="Please enter a valid URL (e.g., www.instagram.com or https://instagram.com)"
                                className="flex-1 outline-none text-sm border-0 focus:ring-0"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid Instagram URL");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded">
                            <Facebook className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Facebook profile url"
                                pattern="^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
                                title="Please enter a valid URL (e.g., www.facebook.com or https://facebook.com)"
                                className="flex-1 outline-none text-sm border-0 focus:ring-0"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid Facebook URL");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded">
                            <TwitterLogoIcon className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Twitter profile url"
                                pattern="^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
                                title="Please enter a valid URL (e.g., www.twitter.com or https://twitter.com)"
                                className="flex-1 outline-none text-sm border-0 focus:ring-0"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid Twitter URL");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-3 px-4 py-3 border border-gray-300 rounded">
                            <YoutubeIcon className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Youtube profile url"
                                pattern="^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
                                title="Please enter a valid URL (e.g., www.youtube.com or https://youtube.com)"
                                className="flex-1 outline-none text-sm border-0 focus:ring-0"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid YouTube URL");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Personal Website
                        </label>
                        <input
                            type="text"
                            placeholder="Add your personal website link"
                            pattern="^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$"
                            title="Please enter a valid URL (e.g., www.example.com or https://example.com)"
                            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            onInvalid={(e) => {
                                e.currentTarget.setCustomValidity("Please enter a valid website URL");
                            }}
                            onInput={(e) => {
                                e.currentTarget.setCustomValidity("");
                                handleInputValidation(e);
                            }}
                            onChange={handleInputValidation}
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <button
                            onClick={handleSaveSocialProfiles}
                            className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors"
                        >
                            Save & Change
                        </button>
                    </div>
                </div>

                {/* 2FA Verification */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">2FA Verification</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Verification
                        </label>
                        <div className="flex gap-3 w-1/2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                                title="Please enter a valid email address"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid email address");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                            <button
                                onClick={handleGetOTP}
                                disabled={otpCooldown > 0}
                                className={`px-6 py-2 rounded transition-colors whitespace-nowrap ${otpCooldown > 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                                    }`}
                            >
                                {otpCooldown > 0 ? `Wait ${formatCooldownTime(otpCooldown)}` : 'Get OTP'}
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone Verification
                        </label>
                        <div className="flex gap-3 w-1/2">
                            <input
                                type="tel"
                                placeholder="Enter your phone number"
                                pattern="[0-9+\-\s()]+"
                                title="Please enter a valid phone number"
                                className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                onKeyPress={(e) => {
                                    // Allow only numbers, +, -, space, and parentheses
                                    if (!/[0-9+\-\s()]/.test(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onInvalid={(e) => {
                                    e.currentTarget.setCustomValidity("Please enter a valid phone number");
                                }}
                                onInput={(e) => {
                                    e.currentTarget.setCustomValidity("");
                                    handleInputValidation(e);
                                }}
                                onChange={handleInputValidation}
                            />
                            <button
                                onClick={handleGetOTP}
                                disabled={otpCooldown > 0}
                                className={`px-6 py-2 rounded transition-colors whitespace-nowrap ${otpCooldown > 0
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-cyan-500 text-white hover:bg-cyan-600'
                                    }`}
                            >
                                {otpCooldown > 0 ? `Wait ${formatCooldownTime(otpCooldown)}` : 'Get OTP'}
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <button className="px-6 py-2 bg-cyan-500 text-white rounded hover:bg-cyan-600 transition-colors">
                            Send
                        </button>
                    </div>
                </div>
            </div>

            {/* OTP Modal */}
            {showOTPModal && (
                <OTPModal
                    onClose={() => setShowOTPModal(false)}
                    onConfirm={handleVerifyOTP}
                    onResend={handleResendOTP}
                    resendCooldown={resendCooldown}
                />
            )}
        </div>
    );
}

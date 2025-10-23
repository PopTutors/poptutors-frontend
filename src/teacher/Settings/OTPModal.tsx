import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";

interface OTPModalProps {
    onClose: () => void;
    onConfirm: (otp: string) => void;
    onResend: () => void;
    resendCooldown: number;
}

export default function OTPModal({ onClose, onConfirm, onResend, resendCooldown }: OTPModalProps) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        // Focus first input on mount
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        const newOtp = [...otp];

        for (let i = 0; i < pastedData.length; i++) {
            if (/^\d$/.test(pastedData[i])) {
                newOtp[i] = pastedData[i];
            }
        }

        setOtp(newOtp);

        // Focus last filled input or next empty
        const lastFilledIndex = Math.min(pastedData.length, 5);
        inputRefs.current[lastFilledIndex]?.focus();
    };

    const handleConfirm = () => {
        const otpString = otp.join("");
        if (otpString.length === 6) {
            onConfirm(otpString);
        }
    };

    const handleResend = () => {
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
        onResend();
    };

    // Format cooldown time as MM:SS
    const formatCooldownTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-semibold text-gray-900">OTP</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-8">
                    <h3 className="text-xl font-medium text-gray-900 mb-6">
                        Enter 6-digit OTP
                    </h3>

                    {/* OTP Input Boxes */}
                    <div className="flex gap-4 mb-8">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    inputRefs.current[index] = el;
                                }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={handlePaste}
                                className="w-20 h-20 text-center text-2xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 transition-all"
                            />
                        ))}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleResend}
                            disabled={resendCooldown > 0}
                            className={`flex-1 px-6 py-3 border rounded-lg transition-colors font-medium ${resendCooldown > 0
                                ? 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {resendCooldown > 0 ? `Resend in ${formatCooldownTime(resendCooldown)}` : 'Re-send OTP'}
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={otp.join("").length !== 6}
                            className="flex-1 px-6 py-3 text-white bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

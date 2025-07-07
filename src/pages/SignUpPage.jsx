
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { signup, checkUsername, requestOtp } from "../lib/api.js";
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Loader2,
    Check,
    X,
    Shield,
    Sparkles,
    ArrowRight,
    KeyRound,
    UserPlus,
} from "lucide-react";

// --- Validation Functions ---
const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email);
};

const validateUsernameFormat = (username) => {
 
    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    return usernameRegex.test(username);
};

const validatePassword = (password) => {

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
};

const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6) return { strength: 1, label: "Too short", color: "text-red-500" };
    if (password.length < 8) return { strength: 2, label: "Weak", color: "text-orange-500" };

    let score = 0;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*?&#]/.test(password)) score++;

    if (score === 4 && password.length >= 12) return { strength: 5, label: "Strong", color: "text-green-500" };
    if (score >= 3 && password.length >= 8) return { strength: 4, label: "Good", color: "text-blue-500" };
    return { strength: 3, label: "Fair", color: "text-yellow-500" };
};

function SignUpPage() {
    const [signupData, setSignupData] = useState({
        fullName: "",
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({ strength: 0, label: "", color: "" });
    const [inputFocus, setInputFocus] = useState({ 
        fullName: false, 
        username: false, 
        email: false, 
        password: false, 
        confirmPassword: false 
    });

    const [usernameStatus, setUsernameStatus] = useState({
        isChecking: false,
        isAvailable: null,
        message: ""
    });

    // OTP Modal State
    const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [correctOtp, setCorrectOtp] = useState("");
    const [otpError, setOtpError] = useState("");
    
    const queryClient = useQueryClient();

    // The final mutation to create the account (called AFTER OTP verification)
    const { mutate: signupMutation, isPending: isCreatingAccount } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success("Account created successfully! Welcome to RelatieM!", {
                icon: '🎉',
                duration: 4000,
            });
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
        },
        onError: (error) => {
            const errorMessage = error.response?.data || "Failed to create account. Please try again.";
            toast.error(errorMessage, {
                icon: '❌',
                duration: 4000,
            });
        }
    });

    // Mutation to request the OTP
    const { mutate: requestOtpMutation, isPending: isRequestingOtp } = useMutation({
        mutationFn: requestOtp,
        onSuccess: (data) => {
            toast.success(`An OTP has been sent to ${signupData.email}.`, {
                icon: '📧',
                duration: 4000,
            });
            setCorrectOtp(data.otp); // Store the OTP from the backend response
            setIsOtpModalOpen(true); // Open the modal
            setOtpError(""); // Clear any previous errors
        },
        onError: (error) => {
            toast.error(error.message || "Could not send OTP. Please check the email and try again.", {
                icon: '❌',
                duration: 4000,
            });
        },
    });

    // Effect to handle username validation with debouncing for the API check
    useEffect(() => {
        const username = signupData.username.trim();
        let isEffectActive = true;

        // Immediate client-side validations
        if (!username) {
            setUsernameStatus({ isChecking: false, isAvailable: null, message: "" });
            return;
        }
        if (username.length < 5) {
            setUsernameStatus({ isChecking: false, isAvailable: false, message: "Username must be at least 5 characters long." });
            return;
        }
        if (!validateUsernameFormat(username)) {
            setUsernameStatus({ isChecking: false, isAvailable: false, message: "Use only letters, numbers, underscores, or hyphens." });
            return;
        }

        // Debounced API Call
        setUsernameStatus({ isChecking: true, isAvailable: null, message: "" });

        const handler = setTimeout(async () => {
            try {
                const response = await checkUsername(username);
                if (isEffectActive) {
                    setUsernameStatus({
                        isChecking: false,
                        isAvailable: response.available,
                        message: response.available ? "Username is available!" : "Username is already taken."
                    });
                }
            } catch {
                if (isEffectActive) {
                    setUsernameStatus({
                        isChecking: false,
                        isAvailable: false,
                        message: "Error checking username availability."
                    });
                }
            }
        }, 500);

        return () => {
            isEffectActive = false;
            clearTimeout(handler);
        };
    }, [signupData.username]);

    useEffect(() => {
        setPasswordStrength(getPasswordStrength(signupData.password));
    }, [signupData.password]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupData(prev => ({ ...prev, [name]: value }));

        if (validationErrors[name]) {
            setValidationErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFocus = (field) => {
        setInputFocus(prev => ({ ...prev, [field]: true }));
    };

    const handleBlur = (field) => {
        setInputFocus(prev => ({ ...prev, [field]: false }));
    };

    const validateForm = () => {
        const { fullName, username, email, password, confirmPassword } = signupData;
        const errors = {};

        if (!fullName.trim() || fullName.trim().length < 2) {
            errors.fullName = "Full name must be at least 2 characters.";
        }
        if (!username.trim()) {
            errors.username = "Username is required.";
        } else if (username.length < 5) {
            errors.username = "Username must be at least 5 characters long.";
        } else if (!validateUsernameFormat(username)) {
            errors.username = "Invalid username format.";
        } else if (usernameStatus.isAvailable === false) {
            errors.username = "This username is already taken.";
        }
        if (!email.trim() || !validateEmail(email)) {
            errors.email = "Please enter a valid email address.";
        }
        if (!password) {
            errors.password = "Password is required.";
        } else if (!validatePassword(password)) {
            errors.password = "Password must be 8+ chars with uppercase, lowercase, a number, and a special character.";
        }
        if (!confirmPassword) {
            errors.confirmPassword = "Please confirm your password.";
        } else if (password !== confirmPassword) {
            errors.confirmPassword = "Passwords do not match.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    const handleSignup = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            requestOtpMutation({ email: signupData.email });
        } 
    };

    const handleVerifyOtpAndSignup = (e) => {
        e.preventDefault();

        if (otpInput.trim() === String(correctOtp).trim()) {
            toast.success("Email verified!", {
                icon: '✅',
                duration: 3000,
            });
            setIsOtpModalOpen(false); // Close modal on success
            setOtpInput(""); // Clear OTP input

            const { fullName, username, email, password } = signupData;
            signupMutation({ fullName, username, email, password });
        } else {
            setOtpError("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
                <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-pulse"></div>
                <div className="absolute top-40 right-32 w-1 h-1 bg-secondary/40 rounded-full animate-pulse delay-300"></div>
                <div className="absolute bottom-32 left-1/3 w-1.5 h-1.5 bg-accent/30 rounded-full animate-pulse delay-700"></div>
            </div>

            <div className="w-full max-w-lg relative z-10">
                {/* Header with Enhanced Branding */}
                <div className="text-center mb-8">
                    {/* --- FIX START --- */}
                    {/* 1. Removed mb-6 from this container */}
                    <div className="relative mx-auto w-52 h-36">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-xl"></div>
                        {/* 2. Added h-full to this inner card to ensure it fills the container */}
                        <div className="relative bg-gradient-to-br from-primary/10 to-secondary/10 backdrop-blur-sm rounded-3xl p-6 border border-primary/20 shadow-2xl h-full">
                            <img 
                                src="/i.png" 
                                alt="RelatieM Logo" 
                                className="w-full h-full object-contain drop-shadow-lg"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div 
                                className="w-full h-full bg-gradient-to-br from-primary/40 to-secondary/40 rounded-2xl flex items-center justify-center shadow-lg"
                                style={{ display: 'none' }}
                            >
                                <div className="flex items-center space-x-2">
                                    <Sparkles className="text-primary text-3xl animate-pulse" />
                                    <Shield className="text-secondary text-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* 3. Added mt-8 to this text container to create space */}
                    <div className="mt-8 space-y-3">
                    {/* --- FIX END --- */}
                        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-2">
                            RelatieM
                        </h1>
                        <p className="text-base-content/80 text-lg font-medium">
                            Join our community! Create your account
                        </p>
                        <div className="flex items-center justify-center space-x-2 text-sm text-base-content/60">
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                            <span className="font-medium">Get started today</span>
                            <div className="w-8 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Signup Form */}
                <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-3xl blur-xl"></div>
                    <div className="relative card bg-base-100/80 backdrop-blur-xl shadow-2xl border border-primary/10 rounded-3xl">
                        <div className="card-body p-8">
                            <form onSubmit={handleSignup} className="space-y-5">
                                {/* Full Name Input */}
                                <div className="form-control">
                                    <label className="label pb-2">
                                        <span className="label-text font-bold text-base-content flex items-center space-x-2">
                                            <User className="w-4 h-4 text-primary" />
                                            <span>Full Name</span>
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                                            inputFocus.fullName ? 'text-primary scale-110' : 'text-primary/60'
                                        }`} />
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={signupData.fullName}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('fullName')}
                                            onBlur={() => handleBlur('fullName')}
                                            placeholder="Enter your full name"
                                            className={`input input-bordered w-full pl-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                                                inputFocus.fullName 
                                                    ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                                                    : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                                            } ${validationErrors.fullName ? 'border-red-500' : ''}`}
                                        />
                                        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                                            inputFocus.fullName ? 'ring-2 ring-primary/20' : ''
                                        }`}></div>
                                    </div>
                                    {validationErrors.fullName && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                                            <X className="w-3 h-3" />
                                            <span>{validationErrors.fullName}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Username Input */}
                                <div className="form-control">
                                    <label className="label pb-2">
                                        <span className="label-text font-bold text-base-content flex items-center space-x-2">
                                            <span className="text-primary">@</span>
                                            <span>Username</span>
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <span className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-lg font-bold transition-all duration-300 ${
                                            inputFocus.username ? 'text-primary scale-110' : 'text-primary/60'
                                        }`}>@</span>
                                        <input
                                            type="text"
                                            name="username"
                                            value={signupData.username}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('username')}
                                            onBlur={() => handleBlur('username')}
                                            placeholder="Choose a unique username"
                                            className={`input input-bordered w-full pl-12 pr-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                                                inputFocus.username 
                                                    ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                                                    : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                                            } ${validationErrors.username || (usernameStatus.isAvailable === false) ? 'border-red-500' : usernameStatus.isAvailable === true ? 'border-green-500' : ''}`}
                                        />
                                        
                                        {/* Username Status Indicator */}
                                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                            {usernameStatus.isChecking ? (
                                                <Loader2 className="w-5 h-5 animate-spin text-primary" />
                                            ) : usernameStatus.isAvailable === true ? (
                                                <Check className="w-5 h-5 text-green-500" />
                                            ) : usernameStatus.isAvailable === false && signupData.username.length > 0 ? (
                                                <X className="w-5 h-5 text-red-500" />
                                            ) : null}
                                        </div>
                                        
                                        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                                            inputFocus.username ? 'ring-2 ring-primary/20' : ''
                                        }`}></div>
                                    </div>
                                    {(validationErrors.username || usernameStatus.message) && (
                                        <p className={`text-xs mt-2 flex items-center space-x-1 ${
                                            usernameStatus.isAvailable ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                            {usernameStatus.isAvailable ? (
                                                <Check className="w-3 h-3" />
                                            ) : (
                                                <X className="w-3 h-3" />
                                            )}
                                            <span>{validationErrors.username || usernameStatus.message}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Email Input */}
                                <div className="form-control">
                                    <label className="label pb-2">
                                        <span className="label-text font-bold text-base-content flex items-center space-x-2">
                                            <Mail className="w-4 h-4 text-primary" />
                                            <span>Email Address</span>
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <Mail className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                                            inputFocus.email ? 'text-primary scale-110' : 'text-primary/60'
                                        }`} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={signupData.email}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('email')}
                                            onBlur={() => handleBlur('email')}
                                            placeholder="Enter your email address"
                                            className={`input input-bordered w-full pl-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                                                inputFocus.email 
                                                    ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                                                    : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                                            } ${validationErrors.email ? 'border-red-500' : ''}`}
                                        />
                                        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                                            inputFocus.email ? 'ring-2 ring-primary/20' : ''
                                        }`}></div>
                                    </div>
                                    {validationErrors.email && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                                            <X className="w-3 h-3" />
                                            <span>{validationErrors.email}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Password Input */}
                                <div className="form-control">
                                    <label className="label pb-2">
                                        <span className="label-text font-bold text-base-content flex items-center space-x-2">
                                            <Lock className="w-4 h-4 text-primary" />
                                            <span>Password</span>
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                                            inputFocus.password ? 'text-primary scale-110' : 'text-primary/60'
                                        }`} />
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={signupData.password}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('password')}
                                            onBlur={() => handleBlur('password')}
                                            placeholder="Create a strong password"
                                            className={`input input-bordered w-full pl-12 pr-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                                                inputFocus.password 
                                                    ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                                                    : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                                            } ${validationErrors.password ? 'border-red-500' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 transition-all duration-200 group"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                                            )}
                                        </button>
                                        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                                            inputFocus.password ? 'ring-2 ring-primary/20' : ''
                                        }`}></div>
                                    </div>
                                    
                                    {/* Password Strength Indicator */}
                                    {signupData.password && (
                                        <div className="mt-2 space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-1 bg-base-300 rounded-full h-1.5">
                                                    <div className={`h-1.5 rounded-full transition-all duration-300 ${
                                                        passwordStrength.strength === 1 ? 'bg-red-500 w-1/5' : 
                                                        passwordStrength.strength === 2 ? 'bg-orange-500 w-2/5' : 
                                                        passwordStrength.strength === 3 ? 'bg-yellow-500 w-3/5' : 
                                                        passwordStrength.strength === 4 ? 'bg-blue-500 w-4/5' : 
                                                        passwordStrength.strength === 5 ? 'bg-green-500 w-full' : 'w-0'
                                                    }`} />
                                                </div>
                                                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                                                    {passwordStrength.label}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    
                                    {validationErrors.password && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                                            <X className="w-3 h-3" />
                                            <span>{validationErrors.password}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Confirm Password Input */}
                                <div className="form-control">
                                    <label className="label pb-2">
                                        <span className="label-text font-bold text-base-content flex items-center space-x-2">
                                            <Lock className="w-4 h-4 text-primary" />
                                            <span>Confirm Password</span>
                                        </span>
                                    </label>
                                    <div className="relative group">
                                        <Lock className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-all duration-300 ${
                                            inputFocus.confirmPassword ? 'text-primary scale-110' : 'text-primary/60'
                                        }`} />
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            value={signupData.confirmPassword}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus('confirmPassword')}
                                            onBlur={() => handleBlur('confirmPassword')}
                                            placeholder="Confirm your password"
                                            className={`input input-bordered w-full pl-12 pr-12 text-base h-14 transition-all duration-300 rounded-2xl ${
                                                inputFocus.confirmPassword 
                                                    ? 'input-primary bg-primary/5 border-primary/50 shadow-lg' 
                                                    : 'bg-base-200/50 hover:bg-base-200 border-base-300 hover:border-primary/30'
                                            } ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-primary/10 transition-all duration-200 group"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                                            ) : (
                                                <Eye className="w-5 h-5 text-primary/70 group-hover:text-primary transition-colors" />
                                            )}
                                        </button>
                                        <div className={`absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 ${
                                            inputFocus.confirmPassword ? 'ring-2 ring-primary/20' : ''
                                        }`}></div>
                                    </div>
                                    {validationErrors.confirmPassword && (
                                        <p className="text-red-500 text-xs mt-2 flex items-center space-x-1">
                                            <X className="w-3 h-3" />
                                            <span>{validationErrors.confirmPassword}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Enhanced Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isRequestingOtp || isCreatingAccount || usernameStatus.isChecking}
                                    className="btn w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-0 hover:opacity-10 transition-opacity duration-300"></div>
                                    {isRequestingOtp ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Sending OTP...</span>
                                        </div>
                                    ) : isCreatingAccount ? (
                                        <div className="flex items-center justify-center space-x-2">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <span>Creating Account...</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-center space-x-2">
                                            <UserPlus className="w-5 h-5" />
                                            <span>Create Account</span>
                                            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                                        </div>
                                    )}
                                </button>
                            </form>

                            {/* Enhanced Sign In Link */}
                            <div className="text-center mt-8">
                                <div className="flex items-center justify-center space-x-2 text-sm text-base-content/60 mb-4">
                                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                                    <span className="font-medium">or</span>
                                    <div className="w-16 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent"></div>
                                </div>
                                <p className="text-base-content/70 text-sm">
                                    Already have an account?{' '}
                                    <Link 
                                        to="/login" 
                                        className="font-bold text-primary hover:text-primary/80 transition-colors duration-200 underline decoration-primary/30 hover:decoration-primary/60 underline-offset-2"
                                    >
                                        Sign In
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Enhanced OTP Verification Modal */}
            {isOtpModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-3xl blur-xl"></div>
                        <div className="relative bg-base-100/95 backdrop-blur-xl rounded-3xl shadow-2xl p-8 w-full max-w-md border border-primary/20 animate-in zoom-in-95 duration-300">
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <KeyRound className="w-8 h-8 text-primary" />
                                </div>
                                <h2 className="text-3xl font-bold text-base-content mb-2">Verify Email</h2>
                                <p className="text-base-content/70 text-sm leading-relaxed">
                                    Enter the 6-digit verification code sent to{' '}
                                    <span className="font-semibold text-primary">{signupData.email}</span>
                                </p>
                            </div>

                            <form onSubmit={handleVerifyOtpAndSignup} className="space-y-6">
                                {/* OTP Input */}
                                <div className="form-control">
                                    <div className="relative group">
                                        <KeyRound className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary/60 transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110" />
                                        <input
                                            type="text"
                                            value={otpInput}
                                            onChange={(e) => {
                                                setOtpInput(e.target.value.replace(/\D/g, '')); // Only allow digits
                                                if(otpError) setOtpError(""); // Clear error on new input
                                            }}
                                            placeholder="000000"
                                            maxLength={6}
                                            className={`input input-bordered w-full text-center text-2xl font-bold pl-12 pr-4 h-16 tracking-widest transition-all duration-300 rounded-2xl ${
                                                otpError 
                                                    ? 'border-red-500 bg-red-50/50' 
                                                    : 'bg-base-200/50 hover:bg-base-200 border-base-300 focus:border-primary focus:bg-primary/5 focus:shadow-lg'
                                            }`}
                                            autoFocus
                                        />
                                        <div className="absolute inset-0 rounded-2xl pointer-events-none transition-all duration-300 group-focus-within:ring-2 group-focus-within:ring-primary/20"></div>
                                    </div>
                                    {otpError && (
                                        <p className="text-red-500 text-xs mt-3 flex items-center justify-center space-x-1 animate-in slide-in-from-top-1 duration-200">
                                            <X className="w-3 h-3" />
                                            <span>{otpError}</span>
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        type="submit"
                                        disabled={isCreatingAccount || otpInput.length !== 6}
                                        className="btn w-full h-14 text-base font-bold rounded-2xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white border-none disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                    >
                                        {isCreatingAccount ? (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                <span>Creating Account...</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center space-x-2">
                                                <Check className="w-5 h-5" />
                                                <span>Verify & Create Account</span>
                                            </div>
                                        )}
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsOtpModalOpen(false);
                                            setOtpInput("");
                                            setOtpError("");
                                        }}
                                        className="btn btn-ghost w-full h-12 text-base font-medium rounded-2xl transition-all duration-300 hover:bg-base-200 text-base-content/70 hover:text-base-content"
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {/* Resend Option */}
                                <div className="text-center pt-4 border-t border-base-300">
                                    <p className="text-xs text-base-content/60">
                                        Didn't receive the code?{' '}
                                        <button
                                            type="button"
                                            onClick={() => requestOtpMutation({ email: signupData.email })}
                                            disabled={isRequestingOtp}
                                            className="font-semibold text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
                                        >
                                            {isRequestingOtp ? 'Sending...' : 'Resend'}
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SignUpPage;
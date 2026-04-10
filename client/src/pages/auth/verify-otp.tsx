import CustomInput from "@/components/ui-v2/CustomInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, EyeClosedIcon, Lock, Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { login, signup, verifyOtp } from "@/services/auth-service";
import { useStore } from "@/store";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useApiError } from "@/hooks/use-api-error";
import { formatTime } from "@/utils/common-utils";

const VerifyOtp = () => {
    const { name, email } = useParams();

    const decodedName = decodeURIComponent(name || "");
    const decodedEmail = decodeURIComponent(email || "");

    console.log(decodedName, decodedEmail);
    const navigate = useNavigate();
    const { handleError } = useApiError()
    const [form, setForm] = useState({
        otp: "",
        password: "",
        confirmPassword: "",
    });
    const [formError, setFormError] = useState({ otp: "", password: "", confirmPassword: "" })
    const [showPassword, setShowPassword] = useState({ password: false, confirmPassword: false });
    const [submitclicked, setSubmitClicked] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300);
    const [canResend, setCanResend] = useState(false);
    const { login: loginUser, isAuthenticated } = useStore((state) => state);



    const handleChange = (key, value) => {
        setForm((prev) => {
            const updatedForm = { ...prev, [key]: value };

            if (updatedForm.password && updatedForm.confirmPassword) {
                if (updatedForm.password !== updatedForm.confirmPassword) {
                    setFormError((prevErr) => ({
                        ...prevErr,
                        confirmPassword: "Password does not match",
                    }));
                } else {
                    setFormError((prevErr) => ({
                        ...prevErr,
                        confirmPassword: "",
                    }));
                }
            }


            if (key === "otp") {
                if (value.length !== 6) {
                    setFormError((prevErr) => ({
                        ...prevErr,
                        otp: "OTP must be 6 digits",
                    }));
                } else {
                    setFormError((prevErr) => ({
                        ...prevErr,
                        otp: "",
                    }));
                }
            }

            return updatedForm;
        });
    };

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setSubmitClicked(true)
        if (formError.otp || formError.password || formError.confirmPassword) {
            return
        }
        try {
            setLoading(true);
            const res = await verifyOtp({ name: decodedName, email: decodedEmail, otp: form.otp, password: form.confirmPassword });

            console.log("Verify otp success:", res);
            toast.success("Successfully registered!")

            navigate("/login");
        } catch (err) {
            handleError(err, "Failed to verify otp!")
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        try {
            setLoading(true);
            const res = await signup({ name: decodedName, email: decodedEmail });

            console.log("signup success:", res);
            toast.success("Email sent successfully!")
            setTimeLeft(300);
            setCanResend(false);

        } catch (err) {
            handleError(err, "Signup failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true);
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);
    return (
        <div className="flex h-full justify-center items-center">
            <div className="w-full max-w-[1000px] max-w-360 flex">
                <div className="flex-1 px-6 md:px-12 lg:px-20 py-8">
                    <h3 className="text-green-primary mb-[10vh]">BlogSpot</h3>
                    <div className="space-y-8">
                        <div>
                            <h4>Welcome Back!</h4>
                            <p>Sign In to write about your interests.</p>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="text-gray-800 mb-1">Enter your otp</div>
                                <InputOTP className="w-full" value={form.otp} onChange={(val) => { handleChange("otp", val) }} maxLength={6}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                    </InputOTPGroup>
                                    <InputOTPSeparator />
                                    <InputOTPGroup>
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                <div className={`flex justify-end mt-2 ${canResend ? "-mr-2" : ""}`}>
                                    {canResend ? (
                                        <Button
                                            onClick={resendOtp}
                                            variant="ghost"
                                            className="text-green-secondary"
                                        >
                                            Resend OTP
                                        </Button>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Resend OTP in {formatTime(timeLeft)}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <Separator />

                            <div className="relative">
                                <CustomInput

                                    label="Password"
                                    title="Password"
                                    placeholder="Enter your password"
                                    iconLeft={<Lock size={16} />}
                                    bordered={true}
                                    type={showPassword.password ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => handleChange("password", e.target.value)}
                                    error={formError.password}
                                />
                                <button
                                    onClick={() => setShowPassword((prev) => ({ ...prev, password: !prev.password }))}
                                    className="absolute top-10 right-4 text-gray-400"
                                    type="button"
                                >
                                    {!showPassword.password ? (
                                        <EyeClosedIcon size={16} />
                                    ) : (
                                        <Eye size={16} />
                                    )}
                                </button>
                            </div>

                            <div>
                                <div className="relative">

                                    <CustomInput
                                        disabled={!form.password}
                                        label="Confirm Password"
                                        title="Confirm Password"
                                        placeholder="Enter your confirm password"
                                        iconLeft={<Lock size={16} />}
                                        bordered={true}
                                        type={showPassword ? "text" : "password"}
                                        value={form.confirmPassword}
                                        onChange={(e) => handleChange("confirmPassword", e.target.value)}
                                        error={formError.confirmPassword}
                                    />
                                    <button
                                        onClick={() => setShowPassword((prev) => ({ ...prev, confirmPassword: !prev.confirmPassword }))}
                                        className="absolute top-10 right-4 text-gray-400"
                                        type="button"
                                    >
                                        {!showPassword.confirmPassword ? (
                                            <EyeClosedIcon size={16} />
                                        ) : (
                                            <Eye size={16} />
                                        )}
                                    </button>
                                </div>

                            </div>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="w-full px-2 py-1 h-10 hover:bg-green-tertiary bg-green-primary text-white"
                            >
                                {loading ? "Verifying..." : "Save"}
                            </Button>
                        </div>
                        <div className="flex justify-center gap-2">
                            Already have an account?{" "}
                            <Link
                                className="text-green-secondary font-medium hover:text-green-tertiary"
                                to={"/login"}
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex-1 hidden sm:flex  bg-gradient-to-t from-green-primary to-green-tertiary text-white px-6 md:px-12 lg:px-20 py-8 mr-6 sm:mr-8 md:mr-20 lg:mr-0 relative">
                    <div className="flex flex-1 flex-col gap-6 justify-center items-center">
                        <h1 className="text-6xl font-normal">Think</h1>
                        <h1 className="ml-16 text-6xl font-normal">Write</h1>
                        <h1 className="-ml-6 text-6xl font-normal">Share</h1>
                    </div>
                    <img
                        className="absolute -right-64 -bottom-64 md:-bottom-72 rotate-[20deg] scale-50 opacity-70"
                        src="/images/feather.png"
                        alt=""
                    />
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;

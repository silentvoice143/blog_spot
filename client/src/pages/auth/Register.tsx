import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signupStep1,
  signupStep2,
  signupStep3,
  signupStep4,
} from "../../services/apiService.js";
import { useLoader } from "@/context/LoaderProvider.js";
import GoogleLoginWrapper from "./googleLogin.js";
import { Button } from "@/components/ui/button.js";
import CustomInput from "@/components/ui-v2/CustomInput.js";

export default function Register({ setAuthentication }) {
  const navigate = useNavigate();
  const { setLoading } = useLoader();

  const [sign_user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [steps, setSteps] = useState(1);
  const [otp, setOtp] = useState("");

  function onInputChange(e) {
    setUser({ ...sign_user, [e.target.name]: e.target.value });
  }

  async function handleSignup(step) {
    try {
      setLoading(true);
      let response;

      if (step === 1) {
        response = await signupStep1({
          password: sign_user.password,
          email: sign_user.email,
        });
      } else if (step === 2) {
        response = await signupStep2({
          email: sign_user.email,
        });
      } else if (step === 3) {
        response = await signupStep3({
          email: sign_user.email,
          otp,
        });
      } else if (step === 4) {
        response = await signupStep4({
          address: sign_user.address,
          email: sign_user.email,
          name: sign_user.name,
        });
      }

      if (response?.status === 200) {
        const data = response.data;
        if (data?.user?.step) {
          setSteps(data.user.step);
          setUser((prev) => ({ ...prev, email: data.user.email }));
        }
        if (step === 4) navigate("/login");
      } else if (response?.status === 409) {
        alert("Email already exists");
      } else {
        console.log("Something is wrong");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  function handleLogin() {
    navigate("/login");
  }

  function handleResendOTP() {
    handleSignup(2); // Step 2 sends OTP again
  }

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-amber-50/20 via-orange-50/20 to-white flex items-center justify-center px-4 font-serif">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Ornate corner decorations */}
        <svg
          className="absolute top-0 left-0 w-64 h-64 text-amber-200 opacity-30"
          viewBox="0 0 200 200"
          fill="currentColor"
        >
          <path d="M10,10 Q50,10 50,50 Q50,10 90,10 Q90,50 130,50 Q90,50 90,90 Q130,90 130,130 Q90,130 90,170 Q90,130 50,130 Q50,170 10,170 Q50,170 50,130 Q10,130 10,90 Q50,90 50,50 Q10,50 10,10 Z" />
        </svg>

        <svg
          className="absolute top-0 right-0 w-48 h-48 text-red-200 opacity-20 transform rotate-45"
          viewBox="0 0 100 100"
          fill="currentColor"
        >
          <circle cx="50" cy="50" r="3" />
          <circle cx="50" cy="30" r="2" />
          <circle cx="50" cy="70" r="2" />
          <circle cx="30" cy="50" r="2" />
          <circle cx="70" cy="50" r="2" />
          <circle cx="35" cy="35" r="1.5" />
          <circle cx="65" cy="35" r="1.5" />
          <circle cx="35" cy="65" r="1.5" />
          <circle cx="65" cy="65" r="1.5" />
        </svg>

        <svg
          className="absolute bottom-0 left-0 w-56 h-56 text-orange-200 opacity-25 transform -rotate-12"
          viewBox="0 0 120 120"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M20,60 Q60,20 100,60 Q60,100 20,60" />
          <path d="M30,60 Q60,30 90,60 Q60,90 30,60" />
          <path d="M40,60 Q60,40 80,60 Q60,80 40,60" />
        </svg>

        <svg
          className="absolute bottom-0 right-0 w-40 h-40 text-amber-300 opacity-20"
          viewBox="0 0 80 80"
          fill="currentColor"
        >
          <path d="M40,5 L45,30 L70,25 L50,40 L75,55 L45,50 L40,75 L35,50 L5,55 L30,40 L10,25 L35,30 Z" />
        </svg>

        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <defs>
              <pattern
                id="paper-texture"
                x="0"
                y="0"
                width="20"
                height="20"
                patternUnits="userSpaceOnUse"
              >
                <rect width="20" height="20" fill="none" />
                <path
                  d="M0,10 L20,10 M10,0 L10,20"
                  stroke="#8B4513"
                  strokeWidth="0.2"
                  opacity="0.3"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#paper-texture)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="text-center mb-8">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-amber-600 to-red-600 rounded-full shadow-lg mb-4">
            
          </div> */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">
            BlogSpot
          </h1>
          <p className="text-gray-600 text-sm italic">
            Join our community of storytellers
          </p>
        </div>
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  steps >= step
                    ? "bg-gradient-to-r from-amber-500 to-red-500"
                    : "bg-gray-300"
                }`}
              />
            ))}
          </div>
          <div className="text-center mt-2 text-sm text-gray-600">
            Step {steps} of 4
          </div>
        </div>

        {/* Registration Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-amber-200">
          {/* Step 1 */}
          {steps === 1 && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold">Create Account</h2>
              </div>

              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={sign_user.email}
                onChange={onInputChange}
                bordered={true}
              />

              <CustomInput
                label="Password"
                name="password"
                type="password"
                placeholder="Create a strong password"
                value={sign_user.password}
                onChange={onInputChange}
                bordered={true}
              />

              <Button
                onClick={() => handleSignup(1)}
                className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-6 rounded-lg"
              >
                Continue
              </Button>

              <div className="text-center">
                <span>Already have an account? </span>
                <button
                  onClick={handleLogin}
                  className="text-amber-700 font-medium hover:underline"
                >
                  Sign in
                </button>
              </div>
            </div>
          )}

          {/* Step 2 & 3 */}
          {(steps === 2 || steps === 3) && (
            <div className="space-y-6">
              <CustomInput
                label="Email Address"
                name="email"
                type="email"
                value={sign_user.email}
                disabled
              />

              {steps === 3 && (
                <div className="space-y-2">
                  <CustomInput
                    label="Verification Code"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    bordered={true}
                  />
                  <div className="text-right">
                    <button
                      onClick={handleResendOTP}
                      className="text-amber-700 text-sm font-medium hover:underline"
                    >
                      Resend Code
                    </button>
                  </div>
                </div>
              )}

              <Button
                onClick={() => handleSignup(steps)}
                className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-6 rounded-lg"
              >
                {steps === 2 ? "Send Code" : "Verify Email"}
              </Button>
            </div>
          )}

          {/* Step 4 */}
          {steps === 4 && (
            <div className="space-y-6">
              <CustomInput
                label="Full Name"
                name="name"
                type="text"
                value={sign_user.name}
                onChange={onInputChange}
              />

              <CustomInput
                label="Address"
                name="address"
                type="text"
                value={sign_user.address}
                onChange={onInputChange}
              />

              <Button
                onClick={() => handleSignup(4)}
                className="w-full bg-gradient-to-r from-amber-600 to-red-600 text-white py-3 px-6 rounded-lg"
              >
                Complete Registration
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

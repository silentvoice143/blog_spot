import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../services/apiService";
import { DataContext } from "../../context/Dataprovider";
import { getPublicIP } from "../../utils/common-utils";
import GoogleLoginWrapper from "./googleLogin";
import CustomInput from "@/components/ui-v2/CustomInput";
import { useLoader } from "@/context/LoaderProvider";

export default function Login({ setAuthentication }) {
  const token = sessionStorage.getItem("accessToken");
  const navigate = useNavigate();
  const { setAccount } = useContext(DataContext);
  const { setLoading } = useLoader();

  const [user, setUser] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function onInputChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  const handleLogin = async () => {
    try {
      setLoading(true);
      const ip = await getPublicIP();
      const response = await loginUser({ ...user, deviceIp: ip });

      if (response.status === 200) {
        const data = response.data;
        sessionStorage.setItem("accessToken", data.user.token);
        sessionStorage.setItem("refreshToken", data.user.refreshToken);
        sessionStorage.setItem("userId", data.user._id);
        setAccount({
          email: data.user.email,
          token: data.user.token,
          name: "",
          id: data.user._id,
        });
        setAuthentication(true);
        navigate("/");
      } else {
        setError("Something went wrong. Please try again later.");
      }
    } catch (err) {
      console.log(err);
      setError("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const handleSignUp = () => {
    navigate("/signup");
  };

  useEffect(() => {
    if (token) navigate("/");
  }, []);

  return (
    <div className="min-h-screen relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex items-center justify-center px-4 font-serif">
      {/* Decorative SVG Background */}
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

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Decorative header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 tracking-wide">
            The Blogspot
          </h1>
          <p className="text-gray-600 text-sm italic">
            Welcome back, storyteller
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-2xl p-8 border border-amber-200">
          {error && (
            <div className="mb-6 text-sm text-red-700 bg-red-100 border border-red-200 p-3 rounded-lg flex items-center">
              <svg
                className="w-4 h-4 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          )}

          <CustomInput
            label="Email Address"
            name="email"
            type="email"
            placeholder="your@email.com"
            value={user.email}
            onChange={onInputChange}
            className="mb-6"
          />

          <CustomInput
            label="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            value={user.password}
            onChange={onInputChange}
            className="mb-4"
          />

          <div className="text-right mb-6">
            <button className="text-amber-700 hover:text-amber-800 text-sm font-medium hover:underline transition-colors">
              Forgot your password?
            </button>
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-700 hover:to-red-700 text-white py-3 px-6 rounded-lg font-medium text-base shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
          >
            Sign In
          </button>

          <div className="my-8 flex items-center">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-4 text-sm text-gray-500 bg-white rounded-full font-medium">
              or continue with
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="flex justify-center mb-8">
            <GoogleLoginWrapper setAuthentication={setAuthentication} />
          </div>

          <div className="text-center">
            <span className="text-gray-600">New to The BlogSpot? </span>
            <button
              onClick={handleSignUp}
              className="text-amber-700 hover:text-amber-800 font-medium hover:underline transition-colors"
            >
              Create your account
            </button>
          </div>
        </div>

        {/* Decorative footer element */}
        <div className="text-center mt-8 opacity-60">
          <svg
            className="w-16 h-4 mx-auto text-amber-600"
            viewBox="0 0 60 15"
            fill="currentColor"
          >
            <path d="M5,7.5 Q15,2 25,7.5 Q35,13 45,7.5 Q55,2 60,7.5" />
            <circle cx="5" cy="7.5" r="1" />
            <circle cx="30" cy="7.5" r="1" />
            <circle cx="55" cy="7.5" r="1" />
          </svg>
        </div>
      </div>
    </div>
  );
}

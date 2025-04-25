import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../../services/apiService.js";
import { useLoader } from "@/context/LoaderProvider.js";
import GoogleLoginWrapper from "./googleLogin.js";
import { Input } from "@/components/ui/input.js";
import { Button } from "@/components/ui/button.js";
import CustomInput from "@/components/ui-v2/CustomInput.js";

export default function Register({ setAuthentication }) {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const registerdetail = {
    name: "",
    email: "",
    password: "",
  };

  const [sign_user, setUser] = useState(registerdetail);
  const [steps, setSteps] = useState(1);
  function onInputChange(e) {
    // console.log({ [e.target.name]: e.target.value });
    setUser({ ...sign_user, [e.target.name]: e.target.value });
  }

  async function signupuser() {
    try {
      setLoading(true);
      console.log(sign_user, "user");
      const response = await signupUser(sign_user);
      console.log(response, "register response");
      if (response.status === 201) {
        const data = response.data;
        navigate("/login");
      } else {
        console.log("something is wrong");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-100 font-montserrat">
      <div className="bg-white flex rounded-lg shadow-lg overflow-hidden w-[650px] max-w-full min-h-[480px] relativep-8">
        {steps === 1 && (
          <div className="flex flex-col items-center justify-center w-1/2 px-6 bg-white-primary">
            <h1 className="text-2xl font-bold">Sign up</h1>
            <div className="flex my-4 space-x-4 ">
              <GoogleLoginWrapper setAuthentication={setAuthentication} />
              <span className="text-sm text-gray-700 cursor-pointer">
                <img className="w-5 h-5" src="\facebook.png" alt="" />
              </span>
            </div>
            <span className="text-xs text-gray-600">or use your account</span>
            <CustomInput
              name="name"
              type="text"
              placeholder="Name"
              value={sign_user.name}
              onChange={onInputChange}
              className="w-full p-3 mt-2 border-none bg-gray-tertiary rounded-xl focus:outline-none"
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={sign_user.email}
              onChange={onInputChange}
              className="w-full p-3 mt-2 border-none bg-gray-tertiary rounded-xl focus:outline-none"
            />

            <button
              className="px-12 py-3 mt-4 text-sm font-bold text-white uppercase transition bg-red-500 rounded-full hover:bg-red-600"
              onClick={() => setSteps(2)}
            >
              Next
            </button>
            <span
              className="mt-4 text-sm text-gray-700 cursor-pointer"
              onClick={() => navigate("/login")}
            >
              Already have an account? Login
            </span>
          </div>
        )}
        {(steps === 2 || steps == 3) && (
          <div className="flex flex-col items-center justify-center w-1/2 px-6 bg-white-primary">
            <h1 className="text-2xl font-bold mb-4">Verify Email</h1>

            <CustomInput
              label="Email"
              name="email"
              type="text"
              placeholder="satya@gmail.com"
              value={sign_user.name}
              onChange={onInputChange}
              className="w-full p-3 mt-2 border-none bg-gray-tertiary rounded-xl focus:outline-none"
              disabled={true}
            />
            <div className="w-full mt-2">
              <CustomInput
                label="OTP"
                name="otp"
                type="text"
                placeholder="Enter Otp"
                value={sign_user.email}
                onChange={onInputChange}
                className="w-full p-3 mt-2 border-none !bg-gray-tertiary rounded-xl focus:outline-none"
              />
              <div className="flex justify-end">
                <Button
                  className="hover:bg-transparent test-xs hover:text-gray-secondary1 px-0"
                  variant="ghost"
                >
                  Resend
                </Button>
              </div>
            </div>

            <button
              className="px-12 py-3 mt-4 text-sm font-bold text-white uppercase transition bg-red-500 rounded-full hover:bg-red-600"
              onClick={() => (steps === 2 ? setSteps(3) : setSteps(4))}
            >
              {steps === 2 ? "Send Otp" : "Verify otp"}
            </button>
          </div>
        )}
        {steps === 4 && (
          <div className="flex flex-col items-center justify-center w-1/2 px-6 bg-white-primary">
            <h1 className="text-2xl font-bold mb-4">Fill Your Details</h1>

            <CustomInput
              label="Address*"
              name="address"
              type="text"
              placeholder="Enter address"
              value={sign_user.name}
              onChange={onInputChange}
              className="w-full p-3 mt-2 border-none !bg-gray-tertiary rounded-xl focus:outline-none "
            />

            <button
              className="px-12 py-3 mt-4 text-sm font-bold text-white uppercase transition bg-red-500 rounded-full hover:bg-red-600"
              onClick={signupuser}
            >
              Save
            </button>
          </div>
        )}
        <div className="flex flex-col items-center justify-center w-1/2 h-full p-8 text-white bg-gradient-to-r from-red-500 to-pink-500">
          <h1 className="text-3xl font-bold text-center">
            Sign up to BlogSpot
          </h1>
          <p className="mt-4 text-sm text-center">
            This platform is easy and simple to use. Create your own blog posts,
            share, like, and follow others.
          </p>
        </div>
      </div>
    </div>
  );
}

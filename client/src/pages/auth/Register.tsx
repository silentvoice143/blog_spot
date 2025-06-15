import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  signupStep1,
  signupStep2,
  signupStep3,
  signupStep4,
  signupUser,
} from "../../services/apiService.js";
import { useLoader } from "@/context/LoaderProvider.js";
import GoogleLoginWrapper from "./googleLogin.js";
import { Button } from "@/components/ui/button.js";
import CustomInput from "@/components/ui-v2/CustomInput.js";

export default function Register({ setAuthentication }) {
  const navigate = useNavigate();
  const { setLoading } = useLoader();
  const registerdetail = {
    name: "",
    email: "",
    password: "",
    address: "",
  };

  const [sign_user, setUser] = useState(registerdetail);
  const [steps, setSteps] = useState(1);
  const [otp, setOtp] = useState("");
  function onInputChange(e) {
    // console.log({ [e.target.name]: e.target.value });
    setUser({ ...sign_user, [e.target.name]: e.target.value });
  }

  async function signupUser(step) {
    switch (step) {
      case 1:
        try {
          setLoading(true);
          console.log(sign_user, "user");
          const response = await signupStep1({
            password: sign_user.password,
            email: sign_user.email,
          });
          console.log(response, "register response");
          if (response.status === 200) {
            const data = response.data;
            setSteps(data.user.step);
            setUser((prev) => ({ ...prev, email: data.user.email }));
          } else if (response.status === 409) {
            alert("Email already exists");
          } else {
            console.log("something is wrong");
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
        break;
      case 2:
        try {
          setLoading(true);
          console.log(sign_user, "user");
          const response = await signupStep2({
            email: sign_user.email,
          });
          // console.log(response, "register response");
          if (response.status === 200) {
            const data = response.data;
            setSteps(data.user.step);
            setUser((prev) => ({ ...prev, email: data.user.email }));
          } else {
            console.log("something is wrong");
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
        break;
      case 3:
        try {
          setLoading(true);
          console.log(sign_user, "user");
          const response = await signupStep3({
            email: sign_user.email,
            otp: otp,
          });
          console.log(response, "register response");
          if (response.status === 200) {
            const data = response.data;
            console.log(data, "----data");
            setSteps(data.user.step);
            setUser((prev) => ({ ...prev, email: data.user.email }));
          } else {
            console.log("something is wrong");
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
        break;
      case 4:
        try {
          setLoading(true);
          console.log(sign_user, "user");
          const response = await signupStep4({
            address: sign_user.address,
            email: sign_user.email,
            name: sign_user.name,
          });
          console.log(response, "register response");
          if (response.status === 200) {
            navigate("/login");
          } else {
            console.log("something is wrong");
          }
        } catch (err) {
          console.log(err);
        } finally {
          setLoading(false);
        }
        break;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-pink-100 font-montserrat px-4">
      <div className="bg-white flex rounded-lg shadow-lg overflow-hidden w-[650px] max-w-full min-h-[480px] relative px-2 md:pr-0 md:pl-8">
        {steps === 1 && (
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 bg-white-primary">
            <h1 className="text-2xl font-bold">Sign up</h1>
            <div className="flex my-4 space-x-4 ">
              <GoogleLoginWrapper setAuthentication={setAuthentication} />
              <span className="text-sm text-gray-700 cursor-pointer">
                <img className="w-5 h-5" src="\facebook.png" alt="" />
              </span>
            </div>
            <span className="text-xs text-gray-600">or use your account</span>

            <CustomInput
              label="Email"
              name="email"
              type="email"
              placeholder="Email"
              value={sign_user.email}
              onChange={onInputChange}
              className="mb-4"
            />
            <CustomInput
              label="Password"
              name="password"
              type="text"
              placeholder="Password"
              value={sign_user.password}
              onChange={onInputChange}
            />
            <button
              className="px-12 py-3 mt-4 text-sm font-bold text-white uppercase transition bg-red-500 rounded-full hover:bg-red-600"
              onClick={() => signupUser(1)}
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
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 bg-white-primary">
            <h1 className="text-2xl font-bold mb-4">Verify Email</h1>

            <CustomInput
              label="Email"
              name="email"
              type="text"
              placeholder="satya@gmail.com"
              value={sign_user.email}
              onChange={onInputChange}
              disabled={true}
              className="mb-4"
            />
            <div className="w-full mt-2">
              <CustomInput
                label="OTP"
                name="otp"
                type="text"
                placeholder="Enter Otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
              <div className="flex justify-end">
                <Button
                  onClick={() => signupUser(2)}
                  className="hover:bg-transparent test-xs hover:text-gray-secondary1 px-0"
                  variant="ghost"
                >
                  Resend
                </Button>
              </div>
            </div>

            <button
              className="px-12 py-3 mt-4 text-sm font-bold text-white uppercase transition bg-red-500 rounded-full hover:bg-red-600"
              onClick={() => (steps === 2 ? signupUser(2) : signupUser(3))}
            >
              {steps === 2 ? "Send Otp" : "Verify otp"}
            </button>
          </div>
        )}
        {steps === 4 && (
          <div className="flex flex-col items-center justify-center w-full md:w-1/2 px-6 bg-white-primary">
            <h1 className="text-2xl font-bold mb-4">Fill Your Details</h1>
            <CustomInput
              label="Name"
              name="name"
              type="text"
              placeholder="Enter your name"
              value={sign_user.name}
              onChange={onInputChange}
              className="mb-4"
            />
            <CustomInput
              label="Address"
              name="address"
              type="text"
              placeholder="Enter address"
              value={sign_user.address}
              onChange={onInputChange}
            />

            <button
              className="px-12 py-3 mt-4 text-sm font-bold text-white uppercase transition bg-red-500 rounded-full hover:bg-red-600"
              onClick={() => signupUser(4)}
            >
              Save
            </button>
          </div>
        )}
        <div className="hidden md:flex flex-col items-center justify-center w-1/2 h-full p-8 text-white bg-gradient-to-r from-red-500 to-pink-500 rounded-l-full">
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

import CustomInput from "@/components/ui-v2/CustomInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, EyeClosedIcon, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="flex h-full justify-center items-center">
      <div className=" w-[1000px] max-w-360 flex">
        <div className="flex-1 px-6 sm:px-8 md:px-20 py-8">
          <h3 className="text-green-primary mb-[10vh]">BlogSpot</h3>
          <div className=" space-y-8">
            <div>
              <h4>Welcome Back!</h4>
              <p>Sign In to write about your interests.</p>
            </div>
            <div className="space-y-4">
              <CustomInput
                label="Email"
                title="Email"
                placeholder="Enter your email"
                iconLeft={<Mail size={16} />}
                bordered={true}
              />
              <div>
                <div className="relative">
                  <CustomInput
                    label="Password"
                    title="Password"
                    placeholder="Enter your password"
                    iconLeft={<Lock size={16} />}
                    bordered={true}
                    type={showPassword ? "text" : "password"}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute bottom-3 right-4 text-gray-400"
                    type="button"
                  >
                    {!showPassword ? (
                      <EyeClosedIcon size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
                <div className="flex justify-end -mr-2">
                  <Button variant="ghost" className="text-green-secondary">
                    Forgot Password?
                  </Button>
                </div>
              </div>
              <Button className="w-full px-2 py-1 h-10 hover:bg-green-tertiary bg-green-primary text-white">
                Sign In
              </Button>
            </div>
            <div className="flex justify-center gap-2">
              Don't have an account?{" "}
              <Link
                className="text-green-secondary font-medium hover:text-green-tertiary"
                to={"/signup"}
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
        <div className="flex-1 hidden sm:flex flex-col gap-6 justify-center items-center bg-gradient-to-t from-green-primary to-green-tertiary text-white px-6 sm:px-8 md:px-20 py-8">
          <h1 className="text-6xl font-normal">Think</h1>
          <h1 className="ml-16 text-6xl font-normal">Write</h1>
          <h1 className="-ml-6 text-6xl font-normal">Share</h1>
        </div>
      </div>
    </div>
  );
};

export default Login;

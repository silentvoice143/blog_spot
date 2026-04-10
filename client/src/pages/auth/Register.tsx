import CustomInput from "@/components/ui-v2/CustomInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, EyeClosedIcon, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "@/services/auth-service";
import { useStore } from "@/store";
import { useApiError } from "@/hooks/use-api-error";
import { toast } from "sonner";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",

  });

  const { login: loginUser, isAuthenticated } = useStore((state) => state);
  const { handleError } = useApiError();

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    try {
      setLoading(true);
      const res = await signup({ ...form });

      console.log("signup success:", res);
      toast.success("Email sent successfully!")
      navigate(
        `/signup/verify-otp/${encodeURIComponent(form.name)}/${encodeURIComponent(form.email)}`
      );
    } catch (err) {
      handleError(err, "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-full justify-center items-center">
      <div className="w-full max-w-[1000px] max-w-360 flex">
        <div className="flex-1 px-6 md:px-12 lg:px-20 py-8">
          <h3 className="text-green-primary mb-[10vh]">BlogSpot</h3>
          <div className=" space-y-8">
            <div>
              <h4>Welcome To BlogSpot!</h4>
              <p>Create an account to write about your interests.</p>
            </div>
            <div className="space-y-4">
              <CustomInput
                label="Name"
                title="Name"
                placeholder="Enter your name"
                iconLeft={<Mail size={16} />}
                bordered={true}
                value={form.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
              <CustomInput
                label="Email"
                title="Email"
                placeholder="Enter your email"
                iconLeft={<Mail size={16} />}
                bordered={true}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />

              <div className="pt-4">
                <Button
                  onClick={handleSignup}
                  disabled={loading}
                  className="w-full px-2 py-1 h-10 hover:bg-green-tertiary bg-green-primary text-white"
                >
                  {loading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
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

export default Register;

import CustomInput from "@/components/ui-v2/CustomInput";
import { Button } from "@/components/ui/button";
import { Eye, EyeClosed, EyeClosedIcon, Lock, Mail } from "lucide-react";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "@/services/auth-service";
import { useStore } from "@/store";
import { useFormValidation } from "@/hooks/use-zod-form";
import { loginSchema } from "@/validation/auth-validation";

const Login = () => {
  const navigate = useNavigate();
  const { errors, validateField, validateForm } =
    useFormValidation(loginSchema);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const { login: loginUser, isAuthenticated } = useStore((state) => state);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      const validate = validateForm(form);

      if (!validate.success) {
        return;
      }
      setLoading(true);

      const res = await login({ ...form, deviceIp: "123456" });

      console.log("Login success:", res);

      // 👉 store token if exists
      // localStorage.setItem("token", res.token);
      loginUser(res.user, res.token);

      // 👉 redirect (example)
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
    } finally {
      setLoading(false);
    }
  };
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
              <CustomInput
                label="Email"
                title="Email"
                placeholder="Enter your email"
                iconLeft={<Mail size={16} />}
                bordered={true}
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                error={errors.email}
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
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    error={errors.password}
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-10 right-4 text-gray-400"
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
              <div className="">
                <Button
                  onClick={() => {
                    handleLogin();
                  }}
                  disabled={loading}
                  className="w-full px-2 py-1 h-10 hover:bg-green-tertiary bg-green-primary text-white"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </div>
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

export default Login;

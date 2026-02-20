"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/auth/authSlice";
import { RootState } from "@/redux/store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { AppDispatch } from "@/redux/store";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  // const users = useSelector((state: RootState) => state.auth.users);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  const validateEmail = (email: string) => {
    if (!email) {
      return "Email is required";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const validatePassword = (password: string) => {
    if (!password) {
      return "Password is required";
    }
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validatePassword(value) }));
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
    } else {
      setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
    }
  };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   setTouched({ email: true, password: true });

  //   const emailError = validateEmail(email);
  //   const passwordError = validatePassword(password);

  //   setErrors({
  //     email: emailError,
  //     password: passwordError,
  //   });

  //   // If there are validation errors, don't submit
  //   if (emailError || passwordError) {
  //     return;
  //   }

  //   const matchedUser = users.find(
  //     (u) => u.email === email && u.password === password
  //   );

  //   if (!matchedUser) {
  //     setErrors((prev) => ({
  //       ...prev,
  //       password: "Invalid email or password",
  //     }));
  //     return;
  //   }

  //   dispatch(login({ email, password }));
  //   const sessionUser = sessionStorage.getItem("loggedUser");

  //   if (sessionUser) {
  //     router.push("/");
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ email: true, password: true });

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      router.push("/");
    } catch (err: any) {
      setErrors((prev) => ({
        ...prev,
        password: err || "Invalid email or password",
      }));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
      <div className="hidden md:block relative">
        <Image
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
          alt="Register background"
          fill
          className="object-cover filter blur-xs"
          priority
          unoptimized
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
          <p className="text-lg text-center opacity-90">
            Sign in to access your account, track orders, and save your wishlist.
          </p>
        </div>
      </div>

      {/* Right Side Form */}
      <div className="flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md md:max-w-2xl md:p-10 space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold tracking-tight">Sign in</h1>
            <p className="text-gray-500 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur("email")}
                className={errors.email && touched.email ? "border-destructive" : ""}
              />
              {errors.email && touched.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={handlePasswordChange}
                onBlur={() => handleBlur("password")}
                className={errors.password && touched.password ? "border-destructive" : ""}
              />
              {errors.password && touched.password && (
                <p className="text-xs text-destructive">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <Button type="submit" size="lg" className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800">
              Sign in
            </Button>

            {/* Register Link */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline font-medium">
                Register here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );

}
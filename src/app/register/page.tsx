"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { registerUser } from "../../redux/auth/authSlice";
import type { AppDispatch } from "../../redux/store";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Register = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        address: "",
        dob: "",
    });

    const [errors, setErrors] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [touched, setTouched] = useState({
        username: false,
        email: false,
        password: false,
        confirmPassword: false,
    });

    const validateUsername = (value: string) =>
        !value ? "Username is required" : "";

    const validateEmail = (value: string) => {
        if (!value) return "Email is required";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? "" : "Enter a valid email";
    };

    const validatePassword = (value: string) => {
        if (!value) return "Password is required";
        if (value.length < 6) return "Password must be at least 6 characters";
        return "";
    };

    const validateConfirmPassword = (value: string) => {
        if (!value) return "Please confirm password";
        if (value !== form.password) return "Passwords do not match";
        return "";
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });

        if (touched[name as keyof typeof touched]) {
            runValidation(name, value);
        }
    };

    const handleBlur = (field: keyof typeof touched) => {
        setTouched({ ...touched, [field]: true });
        runValidation(field, form[field]);
    };

    const runValidation = (name: string, value: string) => {
        let message = "";

        switch (name) {
            case "username":
                message = validateUsername(value);
                break;
            case "email":
                message = validateEmail(value);
                break;
            case "password":
                message = validatePassword(value);
                break;
            case "confirmPassword":
                message = validateConfirmPassword(value);
                break;
        }

        setErrors((prev) => ({ ...prev, [name]: message }));
    };

    // const handleSubmit = (e: React.FormEvent) => {
    //     e.preventDefault();

    //     const newErrors = {
    //         username: validateUsername(form.username),
    //         email: validateEmail(form.email),
    //         password: validatePassword(form.password),
    //         confirmPassword: validateConfirmPassword(form.confirmPassword),
    //     };

    //     setErrors(newErrors);
    //     setTouched({
    //         username: true,
    //         email: true,
    //         password: true,
    //         confirmPassword: true,
    //     });

    //     if (Object.values(newErrors).some((err) => err)) return;

    //     dispatch(
    //         register({
    //             username: form.username,
    //             email: form.email,
    //             password: form.password,
    //             address: form.address || undefined,
    //             dob: form.dob || undefined,
    //         })
    //     );

    //     router.push("/login");
    // };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newErrors = {
            username: validateUsername(form.username),
            email: validateEmail(form.email),
            password: validatePassword(form.password),
            confirmPassword: validateConfirmPassword(form.confirmPassword),
        };

        setErrors(newErrors);
        setTouched({
            username: true,
            email: true,
            password: true,
            confirmPassword: true,
        });

        if (Object.values(newErrors).some((err) => err)) return;

        try {
            await dispatch(
                registerUser({
                    username: form.username,
                    email: form.email,
                    password: form.password,
                    address: form.address || undefined,
                    dateofbirth: form.dob || undefined, 
                })
            ).unwrap();

            router.push("/login");
        } catch (err: any) {
            setErrors((prev) => ({
                ...prev,
                email: err || "Registration failed",
            }));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            <div className="hidden md:block relative bg-muted">
                <Image
                    src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop"
                    alt="Register background"
                    fill
                    className="object-cover filter blur-xs"
                    priority
                    unoptimized
                />
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-white">
                    <h2 className="text-4xl font-bold mb-4">Join FableadStore</h2>
                    <p className="text-lg text-center opacity-90">
                        Create an account to track orders, save your wishlist, and enjoy a seamless shopping experience.
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-center p-5 bg-background">
                <div className="w-full max-w-2xl space-y-5">
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
                        <p className="text-muted-foreground mt-2 mb-10">
                            Enter your details below to create your account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    name="username"
                                    type="text"
                                    placeholder="johndoe"
                                    value={form.username}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("username")}
                                    className={errors.username && touched.username ? "border-destructive" : ""}
                                />
                                {errors.username && touched.username && (
                                    <p className="text-xs text-destructive">{errors.username}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="john@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("email")}
                                    className={errors.email && touched.email ? "border-destructive" : ""}
                                />
                                {errors.email && touched.email && (
                                    <p className="text-xs text-destructive">{errors.email}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("password")}
                                    className={errors.password && touched.password ? "border-destructive" : ""}
                                />
                                {errors.password && touched.password && (
                                    <p className="text-xs text-destructive">{errors.password}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={() => handleBlur("confirmPassword")}
                                    className={errors.confirmPassword && touched.confirmPassword ? "border-destructive" : ""}
                                />
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <p className="text-xs text-destructive">{errors.confirmPassword}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input
                                id="address"
                                name="address"
                                type="text"
                                placeholder="123 Main St"
                                value={form.address}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dob">Date of Birth</Label>
                            <Input
                                id="dob"
                                name="dob"
                                type="date"
                                value={form.dob}
                                onChange={handleChange}
                            />
                        </div>

                        <Button type="submit" className="w-full h-11" size="lg">
                            Register
                        </Button>

                        <p className="text-center text-sm text-muted-foreground mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Login here
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

"use client";

import { login } from "@/app/services/auth.service";
import { LoginPayload } from "@/app/types/user";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const loginSchema = z.object({
  usernameOrEmail: z
    .string()
    .min(3, { message: "Username or email must be at least 3 characters." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." }),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onClose?: () => void;
  onSignUpClick?: () => void;
}

export default function LoginForm({ onClose, onSignUpClick }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LoginPayload) => login(data),
    onSuccess: () => {
      toast.success("Logged in successfully!");
      reset();
      if (onClose) onClose();
    },
    onError: (error: unknown) => {
      console.error("Login failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Login failed. Please check your credentials.";
      setError("usernameOrEmail", {
        type: "server",
        message: errorMessage,
      });
    },
  });

  const onSubmit = (data: LoginFormData) => {
    mutate({
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
    });
  };

  return (
    <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl relative overflow-hidden group/login">
      {/* Dynamic Glow Effect */}
      <div className="absolute -top-[30%] -left-[30%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[50px] pointer-events-none group-hover/login:bg-blue-500/15 transition-all duration-700" />
      <div className="absolute -bottom-[30%] -right-[30%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none group-hover/login:bg-indigo-500/15 transition-all duration-700" />

      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-400 hover:text-white transition-colors cursor-pointer z-20 size-8 rounded-full flex items-center justify-center hover:bg-white/10 outline-none"
        >
          <X className="size-5" />
        </button>
      )}

      <CardHeader className="space-y-2 relative z-10 pt-8 px-8">
        <div className="flex justify-center mb-2">
          <div className="size-22 flex items-center justify-center overflow-hidden relative">
            <Image
              src="/favicon/apple-touch-icon.png"
              alt="Logo"
              fill
              sizes="48px"
              className="object-contain p-2 brightness-110 drop-shadow-[0_0_10px_rgba(37,99,235,0.4)]"
            />
          </div>
        </div>
        <CardTitle className="text-2xl font-bold tracking-tight text-center text-white">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-zinc-400 text-sm">
          Log in to your Binge Cloud account to continue
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 px-8 pb-8 pt-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Username or Email Input */}
          <Input
            {...register("usernameOrEmail")}
            type="text"
            label="Username or Email"
            id="usernameOrEmail"
            name="usernameOrEmail"
            placeholder="Enter username or email"
            icon={<Mail className="size-4.5" />}
            error={errors.usernameOrEmail?.message}
          />

          {/* Password Input */}
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            label="Password"
            id="password"
            placeholder="••••••••"
            icon={<Lock className="size-4.5" />}
            error={errors.password?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer outline-none focus:outline-none flex items-center justify-center p-1 rounded-full hover:bg-white/5"
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="premiumBlue"
            size="lg"
            className="w-full justify-center relative overflow-hidden group/btn mt-2"
            disabled={isPending}
          >
            {isPending ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Logging in...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Log In
                <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>

          {/* Link to Signup */}
          <div className="text-center pt-2">
            <span className="text-zinc-400 text-xs">
              {"Don't have an account? "}
              <button
                type="button"
                onClick={onSignUpClick}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Sign Up
              </button>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

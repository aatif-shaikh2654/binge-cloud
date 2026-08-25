"use client";

import { signup } from "@/features/auth/services/auth.service";
import { SignupPayload } from "@/features/auth/types/user";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const signupSchema = z
  .object({
    usernameOrEmail: z
      .string()
      .min(3, { message: "Username or email must be at least 3 characters." }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters." }),
    confirmPassword: z.string().min(6, {
      message: "Confirmation password must be at least 6 characters.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

interface SignupFormProps {
  onClose?: () => void;
  onLoginClick?: () => void;
}

export default function SignupForm({ onClose, onLoginClick }: SignupFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      usernameOrEmail: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: SignupPayload) => signup(data),
    onSuccess: () => {
      toast.success("Account created successfully!");
      reset();
      if (onLoginClick) onLoginClick();
    },
    onError: (error: unknown) => {
      console.error("Signup failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Signup failed. Please try again.";
      if (
        errorMessage.toLowerCase().includes("username") ||
        errorMessage.toLowerCase().includes("email")
      ) {
        setError("usernameOrEmail", {
          type: "server",
          message: errorMessage,
        });
      }
    },
  });

  const onSubmit = (data: SignupFormData) => {
    mutate({
      usernameOrEmail: data.usernameOrEmail,
      password: data.password,
    });
  };

  return (
    <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl relative overflow-hidden group/signup">
      {/* Dynamic Glow Effect */}
      <div className="absolute -top-[30%] -left-[30%] w-[60%] h-[60%] bg-blue-500/10 rounded-full blur-[50px] pointer-events-none group-hover/signup:bg-blue-500/15 transition-all duration-700" />
      <div className="absolute -bottom-[30%] -right-[30%] w-[60%] h-[60%] bg-indigo-500/10 rounded-full blur-[50px] pointer-events-none group-hover/signup:bg-indigo-500/15 transition-all duration-700" />

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
          Create an Account
        </CardTitle>
        <CardDescription className="text-center text-zinc-400 text-sm">
          Join Binge Cloud to explore the ultimate cinematic library
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

          {/* Confirm Password Input */}
          <Input
            {...register("confirmPassword")}
            type={showConfirmPassword ? "text" : "password"}
            label="Confirm Password"
            id="confirmPassword"
            placeholder="••••••••"
            icon={<Lock className="size-4.5" />}
            error={errors.confirmPassword?.message}
            rightElement={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-zinc-500 hover:text-white transition-colors cursor-pointer outline-none focus:outline-none flex items-center justify-center p-1 rounded-full hover:bg-white/5"
              >
                {showConfirmPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            }
          />

          {/* Submit Button with exactly 12px (rounded-xl!) border-radius */}
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
                Creating account...
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                Sign Up
                <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
              </span>
            )}
          </Button>

          {/* Link to Login */}
          <div className="text-center pt-2">
            <span className="text-zinc-400 text-xs">
              Already have an account?{" "}
              <button
                type="button"
                onClick={onLoginClick}
                className="text-blue-400 hover:text-blue-300 font-semibold hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 outline-none"
              >
                Log In
              </button>
            </span>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

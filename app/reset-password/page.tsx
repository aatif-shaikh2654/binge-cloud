"use client";

import { resetPassword } from "@/app/services/auth.service";
import { ResetPasswordPayload } from "@/app/types/user";
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
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Lock,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const resetPasswordSchema = z
  .object({
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

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    onSuccess: () => {
      toast.success("Password reset successfully!");
      setTimeout(() => router.push("/"), 2000);
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to reset password. The link may have expired.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    if (!token) {
      toast.error("Invalid reset link. Please request a new one.");
      return;
    }
    mutate({ token, password: data.password });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070709] p-4">
        <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl relative overflow-hidden">
          <CardContent className="flex flex-col items-center gap-4 py-12 px-8">
            <div className="size-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Lock className="size-6 text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-white">Invalid Reset Link</h2>
            <p className="text-zinc-400 text-sm text-center">
              This password reset link is invalid or has expired. Please request
              a new one.
            </p>
            <Button
              variant="premiumBlue"
              size="lg"
              onClick={() => router.push("/")}
              className="mt-2"
            >
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#070709] p-4">
      <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl relative overflow-hidden group/reset">
        {/* Dynamic Glow Effect */}
        <div className="absolute -top-[30%] -left-[30%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[50px] pointer-events-none group-hover/reset:bg-emerald-500/15 transition-all duration-700" />
        <div className="absolute -bottom-[30%] -right-[30%] w-[60%] h-[60%] bg-teal-500/10 rounded-full blur-[50px] pointer-events-none group-hover/reset:bg-teal-500/15 transition-all duration-700" />

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
            {isSuccess ? "Password Reset!" : "Reset Your Password"}
          </CardTitle>
          <CardDescription className="text-center text-zinc-400 text-sm">
            {isSuccess
              ? "Your password has been updated. Redirecting..."
              : "Enter your new password below"}
          </CardDescription>
        </CardHeader>

        <CardContent className="relative z-10 px-8 pb-8 pt-4">
          {isSuccess ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle className="size-6 text-emerald-400" />
              </div>
              <p className="text-zinc-400 text-sm text-center">
                You will be redirected to the home page shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* New Password */}
              <Input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                label="New Password"
                id="new-password"
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

              {/* Confirm Password */}
              <Input
                {...register("confirmPassword")}
                type={showConfirmPassword ? "text" : "password"}
                label="Confirm Password"
                id="confirm-password"
                placeholder="••••••••"
                icon={<Lock className="size-4.5" />}
                error={errors.confirmPassword?.message}
                rightElement={
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
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
                    Resetting...
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Reset Password
                    <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#070709]">
          <Loader2 className="size-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
}

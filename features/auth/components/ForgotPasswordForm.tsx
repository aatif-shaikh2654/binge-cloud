"use client";

import { forgotPassword } from "@/features/auth/services/auth.service";
import { ForgotPasswordPayload } from "@/features/auth/types/user";
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
import { ArrowLeft, ArrowRight, Loader2, Mail, X } from "lucide-react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

interface ForgotPasswordFormProps {
  onClose?: () => void;
  onLoginClick?: () => void;
}

export default function ForgotPasswordForm({
  onClose,
  onLoginClick,
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: (data: ForgotPasswordPayload) => forgotPassword(data),
    onSuccess: () => {
      toast.success("Reset link sent! Check your email.");
      reset();
    },
    onError: (error: unknown) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate({ email: data.email });
  };

  return (
    <Card className="w-full max-w-md border-white/5 bg-black/40 backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] rounded-2xl relative overflow-hidden group/forgot">
      {/* Dynamic Glow Effect */}
      <div className="absolute -top-[30%] -left-[30%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[50px] pointer-events-none group-hover/forgot:bg-amber-500/15 transition-all duration-700" />
      <div className="absolute -bottom-[30%] -right-[30%] w-[60%] h-[60%] bg-orange-500/10 rounded-full blur-[50px] pointer-events-none group-hover/forgot:bg-orange-500/15 transition-all duration-700" />

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
          Forgot Password
        </CardTitle>
        <CardDescription className="text-center text-zinc-400 text-sm">
          {isSuccess
            ? "We've sent a reset link to your email"
            : "Enter your email and we'll send you a reset link"}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative z-10 px-8 pb-8 pt-4">
        {isSuccess ? (
          <div className="space-y-5">
            <div className="flex flex-col items-center gap-3 py-4">
              <div className="size-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <Mail className="size-6 text-emerald-400" />
              </div>
              <p className="text-zinc-400 text-sm text-center leading-relaxed">
                Check your inbox for the password reset link. It will expire in
                15 minutes.
              </p>
            </div>

            {/* Back to Login */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onLoginClick}
                className="text-blue-400 hover:text-blue-300 font-semibold text-xs hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 outline-none inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                Back to Login
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Input */}
            <Input
              {...register("email")}
              type="email"
              label="Email Address"
              id="forgot-email"
              name="email"
              placeholder="Enter your email"
              icon={<Mail className="size-4.5" />}
              error={errors.email?.message}
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
                  Sending...
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  Send Reset Link
                  <ArrowRight className="size-4 group-hover/btn:translate-x-1 transition-transform" />
                </span>
              )}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={onLoginClick}
                className="text-blue-400 hover:text-blue-300 font-semibold text-xs hover:underline transition-colors cursor-pointer bg-transparent border-none p-0 outline-none inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="size-3.5" />
                Back to Login
              </button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}

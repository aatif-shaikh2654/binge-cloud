import { cn } from "@/shared/lib/utils";
import * as React from "react";

export interface InputProps extends React.ComponentProps<"input"> {
  icon?: React.ReactNode;
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", icon, label, error, id, rightElement, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold text-zinc-300 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 flex items-center justify-center pointer-events-none">
              {icon}
            </span>
          )}
          <input
            type={type}
            className={cn(
              "w-full bg-white/[0.03] border border-white/10 rounded-md py-3 text-sm text-white placeholder-zinc-500 backdrop-blur-md outline-none transition-all",
              "focus-visible:border-blue-500/70 focus-visible:ring-1 focus-visible:ring-blue-500/50",
              "disabled:cursor-not-allowed disabled:opacity-50",
              icon ? "pl-11" : "pl-4",
              rightElement ? "pr-11" : "pr-4",
              error
                ? "border-red-500/50 focus-visible:border-red-500/80 focus-visible:ring-red-500/30"
                : "hover:border-white/20",
              className,
            )}
            id={id}
            ref={ref}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center z-10">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };

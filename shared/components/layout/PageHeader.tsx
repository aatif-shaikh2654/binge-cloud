import { cn } from "@/shared/lib/utils";
import React from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

const PageHeader = ({
  title,
  description,
  children,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn("px-6 lg:px-20", className)}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-1.5 h-8 bg-blue-600 rounded-full shadow-[0_0_15px_rgba(37,99,235,0.5)] shrink-0" />
          <h1 className="md:text-3xl text-xl font-black tracking-tight text-white">
            {title}
          </h1>
        </div>
        {children && <div className="shrink-0">{children}</div>}
      </div>
      {description && (
        <p className="text-white/40 text-xs md:text-sm font-medium max-w-3xl tracking-tight leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default PageHeader;

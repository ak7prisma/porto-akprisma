import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "outline" | "glow";
  withDot?: boolean;
}

export const Badge = ({
  children,
  className = "",
  variant = "default",
  withDot = false,
}: BadgeProps) => {
  const baseStyles =
    "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-colors";

  const variants = {
    default: "bg-secondary text-muted-foreground border border-border",
    outline: "bg-transparent border border-border text-muted-foreground",
    glow: "bg-secondary text-foreground border border-border",
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {withDot && (
        <span className="relative flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-zinc-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-zinc-300" />
        </span>
      )}
      {children}
    </div>
  );
};

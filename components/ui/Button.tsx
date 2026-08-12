import React from "react";
import Link from "next/link";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export const Button = ({
  children,
  className = "",
  href,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  ...props
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const variants = {
    primary:
      "bg-foreground text-background hover:bg-zinc-300",
    secondary:
      "bg-secondary text-foreground border border-border hover:bg-accent",
    outline:
      "bg-transparent border border-border text-muted-foreground hover:text-foreground hover:border-ring",
    ghost: "bg-transparent text-muted-foreground hover:text-foreground",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-3.5 text-lg font-semibold",
  };

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  const IconWrapper = icon ? <span className="transition-transform group-hover:translate-x-0.5">{icon}</span> : null;

  if (href) {
    return (
      <Link href={href} className={`${combinedClassName} group`}>
        {iconPosition === "left" && IconWrapper}
        {children}
        {iconPosition === "right" && IconWrapper}
      </Link>
    );
  }

  return (
    <button className={`${combinedClassName} group`} {...props}>
      {iconPosition === "left" && IconWrapper}
      {children}
      {iconPosition === "right" && IconWrapper}
    </button>
  );
};

import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps) => {
  return (
    <div
      className={`relative border border-border bg-secondary shadow-sm rounded-lg overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
};

import React from "react";
import { Button } from "@/components/ui/Button";
import { Lock } from "lucide-react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ActionProjectProps {
  href?: string | null;
  label: string;
  icon?: React.ReactNode;
  variant?: ButtonVariant;
  lockedLabel?: string;
}

export default function ActionProject({
  href,
  label,
  icon,
  variant = "primary",
  lockedLabel = "Coming Soon",
}: ActionProjectProps) {
  if (href) {
    return (
      <Button href={href} variant={variant} size="md" icon={icon}>
        {label}
      </Button>
    );
  }

  return (
    <button
      type="button"
      disabled
      className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-border px-6 py-3 text-base font-medium text-muted-foreground disabled:opacity-50"
    >
      <Lock size={16} />
      {lockedLabel}
    </button>
  );
}

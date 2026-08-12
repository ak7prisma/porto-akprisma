import React from "react";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  textarea?: boolean;
  rows?: number;
  error?: string;
}

export function FormInput({
  label,
  id,
  textarea = false,
  className = "",
  error,
  ...props
}: Readonly<FormInputProps>) {
  const baseStyles =
    "w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 transition-colors focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring";

  const errorStyles = error
    ? "border-red-500/60 focus:border-red-500/60 focus:ring-red-500/60"
    : "";

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="font-label text-xs uppercase tracking-[0.15em] text-muted-foreground">
        {label}
      </label>

      {textarea ? (
        <textarea
          id={id}
          className={`${baseStyles} ${errorStyles} resize-none ${className}`}
          {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          className={`${baseStyles} ${errorStyles} ${className}`}
          {...(props as React.InputHTMLAttributes<HTMLInputElement>)}
        />
      )}

      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

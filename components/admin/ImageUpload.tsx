"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Trash2, UploadCloud } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Label } from "@/components/ui/label";

const BUCKET = "portfolio-images";

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
}

export function ImageUpload({ label, value, onChange }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("File must be an image.");
      return;
    }

    const supabase = createClient();
    const ext = file.name.split(".").pop()?.toLowerCase() || "png";
    const path = `projects/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    setUploading(true);
    setError(null);
    try {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(path, file, { upsert: false });
      if (uploadError) throw new Error(uploadError.message);

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={label}>{label}</Label>

      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className="group relative flex h-40 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-700 bg-slate-950/60 transition-colors hover:border-slate-500"
      >
        {value ? (
          <>
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover object-top"
              sizes="(max-width: 768px) 100vw, 400px"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                <UploadCloud size={14} /> Change image
              </span>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400">
            {uploading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="text-xs">Uploading...</span>
              </>
            ) : (
              <>
                <UploadCloud size={20} />
                <span className="text-xs">Click to upload image</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id={label}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />

      {value && !uploading && (
        <div className="flex items-center justify-between">
          <span className="truncate text-xs text-slate-500">{value}</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex items-center gap-1 text-xs text-slate-400 transition-colors hover:text-red-400"
          >
            <Trash2 size={12} /> Remove
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
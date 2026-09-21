"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import type { ActionState } from "@/lib/actions/content";

export function useActionToast(
  state: ActionState,
  messages?: { success?: string; error?: string }
) {
  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(messages?.success ?? "Saved successfully");
    } else if (state.error) {
      toast.error(messages?.error ?? state.error);
    }
  }, [state, messages]);
}
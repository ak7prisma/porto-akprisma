"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import type { ActionState } from "@/lib/actions/content";

type ConfirmResult = ActionState | void;

export function ConfirmDialog({
  title,
  description,
  trigger,
  confirmLabel = "Confirm",
  successMessage = "Done",
  onConfirm,
}: {
  title: string;
  description?: string;
  trigger: React.ReactElement;
  confirmLabel?: string;
  successMessage?: string;
  onConfirm: () => Promise<ConfirmResult> | ConfirmResult;
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);

  const handleConfirm = async () => {
    setPending(true);
    try {
      const result = await onConfirm();
      if (result && "error" in result && result.error) {
        toast.error(result.error);
      } else {
        toast.success(successMessage);
        setOpen(false);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" size="sm">Cancel</Button>} />
          <Button
            variant="primary"
            size="sm"
            className="bg-red-500 text-white hover:bg-red-400"
            disabled={pending}
            onClick={handleConfirm}
          >
            {pending ? "Please wait..." : confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
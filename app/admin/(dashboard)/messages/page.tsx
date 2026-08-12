import Link from "next/link";
import { ArrowLeft, Mail, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { updateContactMessageStatusAction } from "@/lib/actions/content";
import { Button } from "@/components/ui/Button";
import type { ContactMessage } from "@/types/content";

export const metadata = {
  title: "Messages | Admin",
};

const statusBadge: Record<string, string> = {
  new: "bg-amber-500/10 text-amber-400",
  read: "bg-blue-500/10 text-blue-400",
  replied: "bg-emerald-500/10 text-emerald-400",
  archived: "bg-slate-500/10 text-slate-400",
};

export default async function AdminMessagesPage() {
  const supabase = await createClient();

  const { data: rows } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  const messages: ContactMessage[] = rows ?? [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Messages</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {messages.length > 0
            ? `${messages.length} message(s) from Supabase`
            : "Supabase not configured — no messages yet"}
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/15 p-12 text-center text-slate-400">
          <Mail className="mx-auto h-8 w-8 mb-2" />
          <p>No contact messages yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-white/10 bg-slate-900/50 p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <p className="font-semibold text-white">{m.name}</p>
                  <a
                    href={`mailto:${m.email}`}
                    className="text-sm text-blue-400 hover:underline"
                  >
                    {m.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusBadge[m.status]}`}
                  >
                    {m.status}
                  </span>
                  <span className="text-xs text-slate-500">
                    {new Date(m.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-300">{m.message}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {["read", "replied", "archived", "new"].map((status) => (
                  <form
                    key={status}
                    action={async (fd: FormData) => {
                      await updateContactMessageStatusAction(null, fd);
                    }}
                  >
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="status" value={status} />
                    <Button type="submit" variant="outline" size="sm">
                      Mark {status}
                    </Button>
                  </form>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

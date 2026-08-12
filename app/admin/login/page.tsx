import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black p-6">
      <div className="w-full max-w-sm space-y-6 rounded-2xl border border-white/10 bg-slate-900/50 p-8 backdrop-blur-sm">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-sm text-slate-400">Sign in to manage your portfolio content</p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}

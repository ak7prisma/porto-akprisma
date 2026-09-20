import Link from "next/link";
import { ArrowLeft, Database } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import EducationForm from "@/components/admin/EducationForm";
import { getPublicSiteData } from "@/lib/content";

export const metadata = {
  title: "Education | Admin",
};

export default async function AdminEducationPage() {
  const supabase = await createClient();
  const fallback = await getPublicSiteData();

  const { data: educationRow } = await supabase
    .from("education")
    .select("*")
    .limit(1)
    .maybeSingle();

  const education = educationRow
    ? {
        year: educationRow.year,
        degree: educationRow.degree,
        university: educationRow.university,
        description: educationRow.description,
      }
    : fallback.education;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <h1 className="mt-2 text-3xl font-bold text-white">Education</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-400">
          <Database className="h-3.5 w-3.5" />
          {educationRow ? "Editing from Supabase" : "Supabase not configured — showing fallback values"}
        </p>
      </div>

      <EducationForm education={education} educationId={educationRow?.id} />
    </div>
  );
}
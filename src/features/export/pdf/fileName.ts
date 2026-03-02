import type { Resume } from "@/features/resumes/model/Resume";

function slugify(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function pdfFileName(resume: Resume) {
  const name = `${resume.basics.firstName} ${resume.basics.lastName}`.trim();
  const base = slugify(name || resume.title || "resume") || "resume";
  return `${base}.pdf`;
}

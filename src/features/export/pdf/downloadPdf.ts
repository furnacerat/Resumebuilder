import { pdf } from "@react-pdf/renderer";
import type { Resume } from "@/features/resumes/model/Resume";
import { getTemplate } from "@/features/templates/registry";
import { pdfFileName } from "@/features/export/pdf/fileName";

export async function downloadResumePdf(resume: Resume) {
  const template = getTemplate(resume.templateId);
  const doc = template.pdf(resume);
  const blob = await pdf(doc).toBlob();

  const url = URL.createObjectURL(blob);
  try {
    const a = document.createElement("a");
    a.href = url;
    a.download = pdfFileName(resume);
    document.body.appendChild(a);
    a.click();
    a.remove();
  } finally {
    URL.revokeObjectURL(url);
  }
}

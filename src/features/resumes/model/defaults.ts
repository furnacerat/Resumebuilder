import type { Resume } from "@/features/resumes/model/Resume";
import { uid } from "@/lib/utils/ids";

export const DEFAULT_TEMPLATE_ID = "modern";

export function createEmptyResume(): Resume {
  const now = Date.now();
  return {
    id: uid(),
    createdAt: now,
    updatedAt: now,
    title: "Untitled Resume",
    templateId: DEFAULT_TEMPLATE_ID,
    basics: {
      firstName: "",
      lastName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      website: "",
      linkedin: "",
      github: "",
    },
    summary: "",
    experience: [
      {
        id: uid(),
        company: "",
        title: "",
        location: "",
        start: "",
        end: "",
        bullets: [""],
      },
    ],
    education: [
      {
        id: uid(),
        school: "",
        degree: "",
        location: "",
        start: "",
        end: "",
        details: "",
      },
    ],
    projects: [],
    skills: [
      {
        id: uid(),
        label: "Skills",
        items: [""],
      },
    ],
  };
}

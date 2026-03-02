import type { TemplateMeta } from "@/features/templates/types";
import { ModernPdf } from "@/features/templates/pdf/Modern";
import { ClassicPdf } from "@/features/templates/pdf/Classic";
import { MinimalPdf } from "@/features/templates/pdf/Minimal";

export const templates: TemplateMeta[] = [
  {
    id: "modern",
    name: "Modern",
    description: "Crisp header, clean spacing, great all-around.",
    pdf: ModernPdf,
  },
  {
    id: "classic",
    name: "Classic",
    description: "Traditional centered header, straightforward sections.",
    pdf: ClassicPdf,
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Quiet typography and compact layout.",
    pdf: MinimalPdf,
  },
];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id) ?? templates[0];
}

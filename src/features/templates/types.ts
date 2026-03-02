import type { Resume } from "@/features/resumes/model/Resume";
import type { ReactElement } from "react";
import type { DocumentProps } from "@react-pdf/renderer";

export type PdfTemplateRender = (resume: Resume) => ReactElement<DocumentProps>;

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  pdf: PdfTemplateRender;
};

import type { ComponentType } from "react";
import PdfDropzoneDemo from "./pdf-dropzone/Demo";

/** Live demo for each project, keyed by slug. */
export const demos: Record<string, ComponentType> = {
  "pdf-dropzone": PdfDropzoneDemo,
};

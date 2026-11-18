import type { Project } from "./types";
import { pdfDropzone } from "@/projects/pdf-dropzone/meta";

/** Add new projects here, newest first. */
export const projects: Project[] = [pdfDropzone];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

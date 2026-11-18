export type ProjectStatus = "delivered" | "in-progress";

export interface Project {
  slug: string;
  title: string;
  summary: string;
  /** ISO date the job was posted. */
  postedAt: string;
  region: string;
  status: ProjectStatus;
  stack: string[];
  tags: string[];
  /** The client's brief, as posted. */
  brief: string;
  requirements: { text: string; how: string }[];
  /** Source files shown on the project page, relative to src/projects/<slug>/. */
  deliverables: { label: string; file: string }[];
  props?: { name: string; type: string; required?: boolean; defaultValue?: string; description: string }[];
  notes?: string[];
}

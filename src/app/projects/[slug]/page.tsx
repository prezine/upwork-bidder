import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import { demos } from "@/projects/demos";
import { StatusBadge } from "@/components/StatusBadge";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.summary } : {};
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const Demo = demos[slug];

  return (
    <article className="space-y-8">
      <div>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="max-w-3xl text-2xl font-semibold tracking-tight">{project.title}</h1>
          <StatusBadge status={project.status} />
        </div>
        <p className="mt-2 max-w-3xl text-zinc-600">{project.summary}</p>
      </div>

      {Demo && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6">
          <Demo />
        </div>
      )}
    </article>
  );
}

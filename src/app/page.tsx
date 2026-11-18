import { projects } from "@/lib/projects";
import { ProjectIndex } from "@/components/ProjectIndex";

export default function Home() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Each project is built and hosted here, with the original brief, a live demo and the
          source.
        </p>
      </div>
      <ProjectIndex projects={projects} />
    </>
  );
}

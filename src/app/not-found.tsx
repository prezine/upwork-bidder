import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-lg font-semibold">Project not found</h1>
      <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 hover:underline">
        Back to all projects
      </Link>
    </div>
  );
}

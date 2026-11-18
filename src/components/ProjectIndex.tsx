"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Project } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

function haystack(p: Project) {
  return [p.title, p.summary, p.brief, p.region, ...p.stack, ...p.tags, ...p.requirements.map((r) => r.text)]
    .join(" ")
    .toLowerCase();
}

export function ProjectIndex({ projects }: { projects: Project[] }) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // "/" focuses search, Escape clears it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const indexed = useMemo(() => projects.map((p) => ({ p, text: haystack(p) })), [projects]);

  const results = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return projects;
    return indexed.filter(({ text }) => terms.every((t) => text.includes(t))).map(({ p }) => p);
  }, [query, indexed, projects]);

  return (
    <div>
      <div className="relative mb-6">
        <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.45 4.39l3.08 3.08a.75.75 0 1 1-1.06 1.06l-3.08-3.08A7 7 0 0 1 2 9Z" clipRule="evenodd" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && setQuery("")}
          placeholder="Search by title, stack, tag or requirement"
          aria-label="Search projects"
          className="w-full rounded-lg border border-zinc-300 bg-white py-2.5 pl-9 pr-12 text-sm placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rounded border border-zinc-200 px-1.5 font-mono text-[10px] text-zinc-400">
          /
        </kbd>
      </div>

      <p className="mb-3 text-xs text-zinc-500" aria-live="polite">
        {results.length} {results.length === 1 ? "project" : "projects"}
        {query && ` matching "${query}"`}
      </p>

      {results.length === 0 ? (
        <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
          No projects match that search.
        </div>
      ) : (
        <ul className="grid gap-3">
          {results.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/projects/${p.slug}`}
                className="group block rounded-xl border border-zinc-200 bg-white p-5 transition hover:border-zinc-300 hover:shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                <div className="flex items-start justify-between gap-4">
                  <h2 className="font-medium text-zinc-900 group-hover:text-indigo-600">{p.title}</h2>
                  <StatusBadge status={p.status} />
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600">{p.summary}</p>
                <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs">
                  {p.stack.map((s) => (
                    <span key={s} className="rounded-md bg-zinc-100 px-2 py-0.5 text-zinc-700">
                      {s}
                    </span>
                  ))}
                  <span className="ml-auto text-zinc-400">
                    {new Date(p.postedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

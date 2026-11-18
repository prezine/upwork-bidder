export function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950">
      {filename && (
        <div className="border-b border-zinc-800 px-4 py-2 font-mono text-xs text-zinc-400">{filename}</div>
      )}
      <pre className="max-h-[32rem] overflow-auto p-4 text-[13px] leading-relaxed text-zinc-100">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  );
}

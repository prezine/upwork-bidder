"use client";

import { useState } from "react";
import { PdfDropzone } from "./PdfDropzone";

export default function UploadForm() {
  const [pdf, setPdf] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdf) return;

    // Hand-off point: connect this to your upload API later.
    const body = new FormData();
    body.append("file", pdf);
    // await fetch("/api/upload", { method: "POST", body });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PdfDropzone
        label="Contract (PDF)"
        onFileSelect={setPdf}
        onError={(err) => console.warn(err.code, err.message)}
      />
      <button
        type="submit"
        disabled={!pdf}
        className="rounded-md bg-zinc-900 px-4 py-2 text-sm text-white disabled:opacity-40"
      >
        Upload
      </button>
    </form>
  );
}

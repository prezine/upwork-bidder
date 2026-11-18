"use client";

import {
  useCallback,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";

export const DEFAULT_MAX_SIZE = 10 * 1024 * 1024; // 10 MB

export type PdfDropzoneErrorCode =
  | "invalid-type"
  | "too-large"
  | "empty-file"
  | "too-many-files";

export interface PdfDropzoneError {
  code: PdfDropzoneErrorCode;
  message: string;
}

export interface PdfDropzoneProps {
  /** Called with the valid PDF when one is selected, and with `null` when it is removed. */
  onFileSelect: (file: File | null) => void;
  /** Called when a file is rejected. The error is also shown inside the component. */
  onError?: (error: PdfDropzoneError) => void;
  /** Maximum file size in bytes. Defaults to 10 MB. */
  maxSize?: number;
  /** Visible label above the drop zone. */
  label?: string;
  disabled?: boolean;
  className?: string;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit++;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

/** True when the file's first bytes are the PDF signature "%PDF-". */
async function hasPdfSignature(file: File): Promise<boolean> {
  try {
    const head = await file.slice(0, 5).text();
    return head === "%PDF-";
  } catch {
    return false;
  }
}

async function validate(file: File, maxSize: number): Promise<PdfDropzoneError | null> {
  const looksLikePdf =
    file.type === "application/pdf" || /\.pdf$/i.test(file.name);

  if (!looksLikePdf || !(await hasPdfSignature(file))) {
    if (file.size === 0) {
      return { code: "empty-file", message: `"${file.name}" is empty.` };
    }
    return {
      code: "invalid-type",
      message: `"${file.name}" isn't a PDF. Please choose a .pdf file.`,
    };
  }
  if (file.size > maxSize) {
    return {
      code: "too-large",
      message: `"${file.name}" is ${formatBytes(file.size)}. The limit is ${formatBytes(maxSize)}.`,
    };
  }
  return null;
}

export function PdfDropzone({
  onFileSelect,
  onError,
  maxSize = DEFAULT_MAX_SIZE,
  label = "PDF document",
  disabled = false,
  className = "",
}: PdfDropzoneProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<PdfDropzoneError | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  // Counts nested dragenter/dragleave pairs so the highlight doesn't flicker over child elements.
  const dragDepth = useRef(0);

  const id = useId();
  const labelId = `${id}-label`;
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;

  const fail = useCallback(
    (err: PdfDropzoneError) => {
      setError(err);
      onError?.(err);
    },
    [onError],
  );

  const handleFiles = useCallback(
    async (files: FileList | null) => {
      if (disabled || !files || files.length === 0) return;
      if (files.length > 1) {
        fail({
          code: "too-many-files",
          message: "Please choose one PDF at a time.",
        });
        return;
      }

      const candidate = files[0];
      setIsChecking(true);
      const err = await validate(candidate, maxSize);
      setIsChecking(false);

      // On a rejected file, any previously selected valid file stays selected.
      if (err) {
        fail(err);
        return;
      }
      setError(null);
      setFile(candidate);
      onFileSelect(candidate);
    },
    [disabled, maxSize, fail, onFileSelect],
  );

  const openPicker = () => {
    if (!disabled) inputRef.current?.click();
  };

  const removeFile = () => {
    setFile(null);
    setError(null);
    onFileSelect(null);
  };

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    void handleFiles(e.target.files);
    // Reset so choosing the same file again still fires onChange.
    e.target.value = "";
  };

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    dragDepth.current += 1;
    setIsDragging(true);
  };

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = disabled ? "none" : "copy";
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepth.current = Math.max(0, dragDepth.current - 1);
    if (dragDepth.current === 0) setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragging(false);
    void handleFiles(e.dataTransfer.files);
  };

  const describedBy = [hintId, error ? errorId : null].filter(Boolean).join(" ");

  return (
    <div className={`w-full ${className}`}>
      <p id={labelId} className="mb-2 text-sm font-medium text-zinc-900">
        {label}
      </p>

      <div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        data-dragging={isDragging || undefined}
        data-invalid={error ? true : undefined}
        className={[
          "relative rounded-xl border-2 border-dashed transition-colors",
          disabled
            ? "cursor-not-allowed border-zinc-200 bg-zinc-50 opacity-60"
            : isDragging
              ? "border-indigo-500 bg-indigo-50"
              : error
                ? "border-red-300 bg-red-50/40"
                : "border-zinc-300 bg-white hover:border-zinc-400",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          disabled={disabled}
          onChange={onInputChange}
        />

        {file ? (
          <div className="flex items-center gap-4 p-4">
            <PdfIcon className="h-10 w-10 shrink-0 text-red-500" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-zinc-900" title={file.name}>
                {file.name}
              </p>
              <p id={hintId} className="text-xs text-zinc-500">
                {formatBytes(file.size)}
                {isDragging ? " · Drop to replace" : ""}
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={openPicker}
                disabled={disabled}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={removeFile}
                disabled={disabled}
                aria-label={`Remove ${file.name}`}
                className="rounded-md border border-zinc-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            aria-labelledby={labelId}
            aria-describedby={describedBy}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-xl px-6 py-10 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 disabled:cursor-not-allowed"
          >
            <UploadIcon
              className={`h-8 w-8 ${isDragging ? "text-indigo-500" : "text-zinc-400"}`}
            />
            <span className="text-sm text-zinc-700">
              {isChecking ? (
                "Checking file…"
              ) : isDragging ? (
                "Drop the PDF to select it"
              ) : (
                <>
                  <span className="font-medium text-indigo-600">Click to browse</span> or
                  drag a PDF here
                </>
              )}
            </span>
            <span id={hintId} className="text-xs text-zinc-500">
              One PDF, up to {formatBytes(maxSize)}
            </span>
          </button>
        )}
      </div>

      <div aria-live="polite" className="min-h-6">
        {error && (
          <p id={errorId} role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-red-600">
            <span aria-hidden="true">⚠</span>
            {error.message}
          </p>
        )}
      </div>
    </div>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function PdfIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <path d="M8 3h17l9 9v23a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" fill="currentColor" opacity=".12" />
      <path d="M8 3h17l9 9v23a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M25 3v9h9" stroke="currentColor" strokeWidth="1.5" />
      <text x="20" y="29" textAnchor="middle" fontSize="8.5" fontWeight="700" fill="currentColor" fontFamily="system-ui, sans-serif">PDF</text>
    </svg>
  );
}

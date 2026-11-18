import type { Project } from "@/lib/types";

export const pdfDropzone: Project = {
  slug: "pdf-dropzone",
  title: "Drag and Drop PDF Upload Component in React",
  summary:
    "A reusable React component that lets users pick one PDF by dragging it into a drop zone or clicking to browse, validates it, and hands it to the parent through a callback.",
  postedAt: "2026-11-18",
  region: "Worldwide",
  status: "delivered",
  stack: ["React", "TypeScript", "Tailwind CSS"],
  tags: ["react", "component", "file upload", "drag and drop", "pdf", "validation", "frontend"],
  brief: `We're looking for a React developer to build a small, reusable component that lets users select a PDF by dragging it into a drop zone or clicking to browse.

Please deliver the React component, basic styling, and a short usage example. This task covers frontend file selection and validation. The component should hand off the selected file so we can connect it to our upload API later.`,
  requirements: [
    {
      text: "Accept one PDF at a time, up to 10 MB.",
      how: "Multiple dropped files are rejected with a message. The limit defaults to 10 MB and can be changed with the maxSize prop.",
    },
    {
      text: "Show the selected file's name and size, with an option to remove it and pick another.",
      how: "The selected file shows its name and a readable size, plus Replace and Remove buttons. Dropping a new PDF onto it also replaces it.",
    },
    {
      text: "Display a clear error if the file isn't a PDF or exceeds the size limit.",
      how: "The component checks the MIME type or .pdf extension and the file's %PDF- signature, so a renamed .exe is caught. Errors name the file and the limit, and are announced to screen readers.",
    },
    {
      text: "Pass the selected file to the parent component through a callback.",
      how: "onFileSelect(file) fires with the File when a valid PDF is chosen and with null when it is removed. An optional onError(error) reports rejections with a code.",
    },
  ],
  deliverables: [
    { label: "Component", file: "PdfDropzone.tsx" },
    { label: "Usage example", file: "UsageExample.tsx" },
  ],
  props: [
    { name: "onFileSelect", type: "(file: File | null) => void", required: true, description: "Receives the valid PDF, or null after removal." },
    { name: "onError", type: "(error: PdfDropzoneError) => void", description: "Called on rejection. code is invalid-type, too-large, empty-file or too-many-files." },
    { name: "maxSize", type: "number", defaultValue: "10485760 (10 MB)", description: "Maximum size in bytes." },
    { name: "label", type: "string", defaultValue: '"PDF document"', description: "Visible label above the drop zone." },
    { name: "disabled", type: "boolean", defaultValue: "false", description: "Blocks clicks, drops and buttons." },
    { name: "className", type: "string", description: "Extra classes on the wrapper." },
  ],
  notes: [
    "If an invalid file is dropped while a valid one is already selected, the valid file stays selected and the error is shown.",
    "Keyboard: the drop zone is a real button, so Tab and Enter/Space open the file picker.",
    "No dependencies beyond React. Styling uses Tailwind classes and is easy to swap for CSS modules.",
  ],
};

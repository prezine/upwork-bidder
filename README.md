# upwork-bidder

Where I build small, easy tasks, then bid with the finished result.

The landing page is a searchable index of projects. Each project lives at `/projects/<slug>` with a live demo, the requirements and how each is met, usage, the source and the original brief.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Add a project

1. Create `src/projects/<slug>/` with the deliverable files and a `Demo.tsx` (client component).
2. Add `meta.ts` exporting a `Project` (see `src/lib/types.ts`). List the files to show under `deliverables`; a deliverable labelled `Usage example` appears in the Usage section.
3. Register it in `src/lib/projects.ts` (newest first) and its demo in `src/projects/demos.ts`.

## Projects

- **pdf-dropzone**: Drag and drop PDF upload component in React (one file, 10 MB limit, validation, `onFileSelect` callback).

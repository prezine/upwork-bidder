import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Projects", template: "%s · Projects" },
  description: "Small builds, each hosted here with a live demo and its source.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-zinc-50 font-sans text-zinc-900 antialiased">
        <main className="mx-auto max-w-5xl px-6 py-10">{children}</main>
      </body>
    </html>
  );
}

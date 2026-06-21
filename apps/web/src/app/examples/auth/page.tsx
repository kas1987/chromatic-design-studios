import type { Metadata } from "next";
import { AuthForm } from "./AuthForm";

export const metadata: Metadata = {
  title: "Auth — Chromatic Examples",
  description: "Sign-in form example built from Chromatic components.",
};

export default function AuthPage() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="fixed inset-0 -z-10 bg-background-default">
        <div className="absolute inset-0 bg-gradient-hero" />
      </div>

      <main id="main" className="mx-auto flex w-full max-w-md flex-1 items-center px-6 py-12">
        <AuthForm />
      </main>

      <footer className="px-6 py-4 text-center text-xs text-text-muted">
        <a href="/examples" className="hover:text-text-primary">← Back to examples</a>
      </footer>
    </div>
  );
}
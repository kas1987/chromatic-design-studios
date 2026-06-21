import type { Metadata } from "next";
import { ErrorPage } from "./ErrorPage";

export const metadata: Metadata = {
  title: "404 — Chromatic Examples",
  description: "Error page example built from Chromatic components.",
};

export default function Page() {
  return <ErrorPage />;
}
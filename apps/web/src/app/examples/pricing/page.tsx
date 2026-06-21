import type { Metadata } from "next";
import { PricingPage } from "./PricingPage";

export const metadata: Metadata = {
  title: "Pricing — Chromatic Examples",
  description: "Pricing tiers example built from Chromatic components.",
};

export default function Page() {
  return <PricingPage />;
}
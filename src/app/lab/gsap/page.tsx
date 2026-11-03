import type { Metadata } from "next";
import LabHeader from "@/components/lab/LabHeader";
import { labDemo } from "@/data/lab";
import { profile } from "@/data/profile";

const demo = labDemo("gsap");

export const metadata: Metadata = {
  title: `${demo.title} | 애니메이션 실험실 | ${profile.name}`,
  description: demo.summary,
  alternates: {
    canonical: "/lab/gsap",
  },
};

export default function LabGsapPage() {
  return (
    <main className="flex-1 pb-24">
      <LabHeader slug="gsap" />
    </main>
  );
}

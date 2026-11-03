import type { Metadata } from "next";
import LabHeader from "@/components/lab/LabHeader";
import { labDemo } from "@/data/lab";
import { profile } from "@/data/profile";

const demo = labDemo("motion");

export const metadata: Metadata = {
  title: `${demo.title} | 애니메이션 실험실 | ${profile.name}`,
  description: demo.summary,
  alternates: {
    canonical: "/lab/motion",
  },
};

export default function LabMotionPage() {
  return (
    <main className="flex-1 pb-24">
      <LabHeader slug="motion" />
    </main>
  );
}

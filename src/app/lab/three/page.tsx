import type { Metadata } from "next";
import LabHeader from "@/components/lab/LabHeader";
import PhysicsBowlDemo from "@/components/lab/three/PhysicsBowlDemo";
import ShaderBlobDemo from "@/components/lab/three/ShaderBlobDemo";
import { labDemo } from "@/data/lab";
import { profile } from "@/data/profile";

const demo = labDemo("three");

export const metadata: Metadata = {
  title: `${demo.title} | 애니메이션 실험실 | ${profile.name}`,
  description: demo.summary,
  alternates: {
    canonical: "/lab/three",
  },
};

export default function LabThreePage() {
  return (
    <main className="flex-1 pb-24">
      <LabHeader slug="three" />
      <ShaderBlobDemo />
      <PhysicsBowlDemo />
    </main>
  );
}

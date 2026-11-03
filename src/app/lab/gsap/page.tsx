import type { Metadata } from "next";
import LabHeader from "@/components/lab/LabHeader";
import SmoothScroll from "@/components/lab/gsap/SmoothScroll";
import StageBlobs from "@/components/lab/gsap/StageBlobs";
import StageEnd from "@/components/lab/gsap/StageEnd";
import StageHero from "@/components/lab/gsap/StageHero";
import StageNumbers from "@/components/lab/gsap/StageNumbers";
import StageSteps from "@/components/lab/gsap/StageSteps";
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

// 장면은 위에서부터 차례로 둡니다. 화면을 붙잡는 장면이 순서대로 만들어져야 아래 장면의 시작 위치가 맞아요.
export default function LabGsapPage() {
  return (
    <main className="flex-1 pb-24">
      <SmoothScroll />
      <LabHeader slug="gsap" />
      <StageHero />
      <StageBlobs />
      <StageSteps />
      <StageNumbers />
      <StageEnd />
    </main>
  );
}

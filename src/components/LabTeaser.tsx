"use client";

import { motion } from "motion/react";
import ClayButton from "@/components/ClayButton";
import Section from "@/components/Section";
import { labDemos } from "@/data/lab";
import { surfaceClass } from "@/data/profile";

// 첫 화면에서 애니메이션 실험실로 가는 입구입니다.
export default function LabTeaser() {
  return (
    <Section id="lab" eyebrow="Lab" title="애니메이션 실험실">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 130, damping: 16 }}
        className="clay flex flex-col gap-6 bg-white/70 p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10"
      >
        <div>
          <p className="max-w-lg text-lg leading-relaxed text-ink">
            다음 작업에 쓸 애니메이션 도구를 하나씩 만져 보는 곳이에요. Motion, GSAP, Lenis, Rive, Lottie,
            three.js 데모가 있어요.
          </p>
          <ul className="mt-4 flex gap-2" aria-hidden>
            {labDemos.map((demo) => (
              <li
                key={demo.slug}
                className={`clay-sm grid size-11 place-items-center text-xl ${surfaceClass[demo.color]}`}
              >
                {demo.icon}
              </li>
            ))}
          </ul>
        </div>
        <ClayButton href="/lab">실험실 둘러보기 →</ClayButton>
      </motion.div>
    </Section>
  );
}

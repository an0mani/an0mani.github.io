"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import ClayButton from "@/components/ClayButton";
import { profile } from "@/data/profile";

// three.js는 브라우저에서만 동작하므로 서버 렌더링에서 제외합니다.
const ClayScene = dynamic(() => import("@/components/ClayScene"), {
  ssr: false,
  loading: () => <div className="clay-pressed h-full w-full bg-white/40" />,
});

export default function Hero() {
  const reduced = useReducedMotion() ?? false;

  return (
    <section
      id="about"
      className="mx-auto grid w-full max-w-6xl scroll-mt-28 items-center gap-6 px-4 pt-28 pb-12 sm:px-6 lg:min-h-svh lg:grid-cols-2 lg:pt-20"
    >
      <div>
        <motion.p
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="clay-sm mb-6 inline-block bg-butter px-4 py-2 font-display text-ink"
        >
          {profile.role}
        </motion.p>

        <h1 className="font-display text-5xl leading-tight text-ink sm:text-6xl">
          {profile.headline.map((line, index) => (
            <motion.span
              key={line}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 160, damping: 14, delay: 0.1 + index * 0.1 }}
              className="block"
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 10, delay: 0.45 }}
            className="clay-sm mt-2 inline-block bg-lilac px-4 py-1"
          >
            {profile.name}
          </motion.span>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-6 max-w-md text-lg leading-relaxed text-muted"
        >
          {profile.intro}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <ClayButton href="#projects">프로젝트 보기</ClayButton>
          <ClayButton href={profile.github} variant="plain" external>
            GitHub
          </ClayButton>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.3 }}
        className="relative h-80 sm:h-[26rem] lg:h-[32rem]"
      >
        <div
          className="absolute inset-x-[20%] bottom-8 h-10 rounded-full bg-[#6b4fd6]/25 blur-2xl"
          aria-hidden
        />
        <ClayScene reduced={reduced} />
        <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-sm text-muted">
          도형을 눌러 보세요
        </p>
      </motion.div>
    </section>
  );
}

"use client";

import { motion } from "motion/react";
import ClayButton from "@/components/ClayButton";
import ClayPlayground from "@/components/ClayPlayground";
import { profile } from "@/data/profile";

export default function Hero() {
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

      <ClayPlayground />
    </section>
  );
}

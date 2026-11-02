"use client";

import { motion } from "motion/react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import Section from "@/components/Section";
import { skillGroups, surfaceClass } from "@/data/profile";

// 벤토 그리드: 윗줄은 카드 세 개, 아랫줄은 넓은 홈랩 카드와 다음 목표 카드
const bentoClass = ["", "", "", "lg:col-span-2", "sm:col-span-2 lg:col-span-1"];

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="다루는 기술">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            whileHover="hover"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: index * 0.06 }}
            className={`clay flex flex-col p-6 ${surfaceClass[group.color]} ${bentoClass[index] ?? ""}`}
          >
            <div className="flex items-center gap-3">
              <motion.span
                variants={{ hover: { rotate: [0, -14, 12, -6, 0], scale: 1.12 } }}
                transition={{ duration: 0.5 }}
                className="clay-sm grid size-12 shrink-0 place-items-center bg-white/80 text-2xl"
                aria-hidden
              >
                {group.icon}
              </motion.span>
              <div>
                <h3 className="font-display text-2xl text-ink">{group.label}</h3>
                <p className="text-sm text-ink/75">{group.note}</p>
              </div>
            </div>
            <ul className="mt-5 flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <motion.li
                  key={skill}
                  whileHover={{ rotate: [0, -6, 6, -3, 0], y: -3 }}
                  whileTap={SQUISH_TAP}
                  transition={SQUISH_SPRING}
                  className={`clay-sm cursor-default bg-white/75 px-4 py-2 font-medium text-ink select-none ${
                    index === 0 ? "text-lg lg:px-5 lg:py-3" : ""
                  }`}
                >
                  {skill}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

"use client";

import { motion } from "motion/react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import Section from "@/components/Section";
import { skillGroups, surfaceClass } from "@/data/profile";

export default function Skills() {
  return (
    <Section id="skills" eyebrow="Skills" title="다루는 기술">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group, index) => (
          <motion.div
            key={group.label}
            initial={{ opacity: 0, y: 32, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 140, damping: 16, delay: index * 0.06 }}
            className={`clay p-6 ${surfaceClass[group.color]}`}
          >
            <h3 className="mb-4 font-display text-2xl text-ink">{group.label}</h3>
            <ul className="flex flex-wrap gap-3">
              {group.skills.map((skill) => (
                <motion.li
                  key={skill}
                  whileHover={{ rotate: [0, -6, 6, -3, 0], y: -3 }}
                  whileTap={SQUISH_TAP}
                  transition={SQUISH_SPRING}
                  className="clay-sm cursor-default bg-white/75 px-4 py-2 font-medium text-ink select-none"
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

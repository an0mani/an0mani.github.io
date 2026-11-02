"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
};

export default function Section({ id, eyebrow, title, children }: SectionProps) {
  return (
    <section id={id} className="mx-auto w-full max-w-6xl scroll-mt-28 px-4 py-20 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ type: "spring", stiffness: 120, damping: 18 }}
        className="mb-10"
      >
        <p className="font-display text-lg text-muted">{eyebrow}</p>
        <h2 className="font-display text-4xl text-ink sm:text-5xl">{title}</h2>
      </motion.div>
      {children}
    </section>
  );
}

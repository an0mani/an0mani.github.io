"use client";

import { motion } from "motion/react";
import ClayButton from "@/components/ClayButton";
import Section from "@/components/Section";
import { profile } from "@/data/profile";

export default function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="함께 이야기해요">
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ type: "spring", stiffness: 140, damping: 14 }}
        className="clay flex flex-col items-start gap-6 bg-peach p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12"
      >
        <p className="max-w-lg text-lg leading-relaxed text-ink">
          만들고 있는 앱이나 코드가 궁금하시면 GitHub에 놀러 와 주세요. 작은 피드백도 큰 힘이 됩니다.
        </p>
        <ClayButton href={profile.github} variant="plain" external>
          GitHub 방문하기 →
        </ClayButton>
      </motion.div>

      <footer className="mt-16 text-center text-sm text-muted">
        © {profile.name} · Next.js, TypeScript, Tailwind CSS, three.js로 만들었습니다.
      </footer>
    </Section>
  );
}

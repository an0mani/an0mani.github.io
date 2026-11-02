"use client";

import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useState, type PointerEvent } from "react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import { surfaceClass, type Project } from "@/data/profile";

type ProjectCardProps = {
  project: Project;
  index: number;
};

const TILT_SPRING = { stiffness: 220, damping: 18 };

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const reduced = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  // 마우스 위치에 따라 카드가 살짝 기울어집니다.
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), TILT_SPRING);
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), TILT_SPRING);

  const handlePointerMove = (event: PointerEvent<HTMLElement>) => {
    if (reduced || event.pointerType !== "mouse") {
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set((event.clientX - rect.left) / rect.width - 0.5);
    pointerY.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover="hover"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 130, damping: 16, delay: (index % 3) * 0.08 }}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`clay flex flex-col p-6 ${surfaceClass[project.color]}`}
    >
      <div className="mb-5 flex items-start justify-between gap-3">
        <motion.span
          variants={{ hover: { rotate: [0, -12, 10, -6, 0], scale: 1.1 } }}
          transition={{ duration: 0.5 }}
          className="clay-sm grid size-14 place-items-center bg-white/80 text-2xl"
          aria-hidden
        >
          {project.icon}
        </motion.span>
        <div className="flex flex-col items-end gap-2">
          {project.step && (
            <span className="font-display text-sm tracking-wider text-muted">{project.step}</span>
          )}
          <span className="clay-pressed bg-white/50 px-3 py-1 text-sm font-medium text-ink">
            {project.status}
          </span>
        </div>
      </div>

      <h3 className="font-display text-2xl text-ink">{project.title}</h3>
      <p className="mt-2 leading-relaxed text-ink/80">{project.summary}</p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <li key={tag} className="rounded-full bg-white/60 px-3 py-1 text-sm text-ink">
            {tag}
          </li>
        ))}
      </ul>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }}
            className="overflow-hidden"
          >
            {project.details.map((detail) => (
              <li key={detail} className="mt-3 flex gap-2 text-ink/85 first:mt-5">
                <span aria-hidden>•</span>
                {detail}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        whileHover={{ scale: 1.03 }}
        whileTap={SQUISH_TAP}
        transition={SQUISH_SPRING}
        className="clay-sm mt-6 flex items-center justify-center gap-2 self-start bg-white/80 px-5 py-2.5 font-display text-ink"
      >
        {isOpen ? "접기" : "자세히 보기"}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={SQUISH_SPRING} aria-hidden>
          ▾
        </motion.span>
      </motion.button>
    </motion.article>
  );
}

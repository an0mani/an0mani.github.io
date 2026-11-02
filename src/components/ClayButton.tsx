"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type ClayButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "plain";
  external?: boolean;
};

// 누르면 찌그러졌다가 스프링처럼 튀어 오르는 버튼
export const SQUISH_TAP = { scaleX: 1.08, scaleY: 0.88 };
export const SQUISH_SPRING = { type: "spring", stiffness: 500, damping: 14 } as const;

export default function ClayButton({
  href,
  children,
  variant = "primary",
  external = false,
}: ClayButtonProps) {
  const colorClass = variant === "primary" ? "bg-lilac" : "bg-white/70";

  return (
    <motion.a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={{ y: -3, scale: 1.04 }}
      whileTap={SQUISH_TAP}
      transition={SQUISH_SPRING}
      className={`clay-sm inline-flex items-center gap-2 px-6 py-3.5 font-display text-lg text-ink ${colorClass}`}
    >
      {children}
    </motion.a>
  );
}

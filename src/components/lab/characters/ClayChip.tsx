"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";

type ClayChipProps = {
  pressed?: boolean;
  label?: string;
  onClick: () => void;
  children: ReactNode;
};

// 고르는 버튼. 골라진 것은 눌린 점토처럼 안으로 들어가 보입니다.
export default function ClayChip({ pressed, label, onClick, children }: ClayChipProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      aria-label={label}
      whileTap={SQUISH_TAP}
      transition={SQUISH_SPRING}
      className={`px-4 py-2 font-display text-ink ${pressed ? "clay-pressed bg-white/50" : "clay-sm bg-white/80"}`}
    >
      {children}
    </motion.button>
  );
}

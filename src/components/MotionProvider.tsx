"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";

type MotionProviderProps = {
  children: ReactNode;
};

// 기기에서 "움직임 줄이기"를 켜 두면 튀어 오르고 기울어지는 움직임을 끄고, 서서히 나타나는 효과만 남깁니다.
export default function MotionProvider({ children }: MotionProviderProps) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

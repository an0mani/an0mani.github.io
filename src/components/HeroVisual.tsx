"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import ClayPlayground from "@/components/ClayPlayground";

// three.js는 브라우저에서만 동작하므로 서버 렌더링에서 빼고 필요할 때 불러옵니다.
const ClayScene = dynamic(() => import("@/components/ClayScene"), {
  ssr: false,
  loading: () => null,
});

let webglSupport: boolean | undefined;

function supportsWebGL() {
  if (webglSupport === undefined) {
    try {
      const canvas = document.createElement("canvas");
      webglSupport = Boolean(canvas.getContext("webgl2") ?? canvas.getContext("webgl"));
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const subscribeNothing = () => () => {};

// 첫 화면 오른쪽 그림: 3D 점토 장면, 3D를 못 쓰거나 움직임 줄이기 설정이면 CSS 점토로 대신합니다.
export default function HeroVisual() {
  const reduced = useReducedMotion() ?? false;
  const canUse3D = useSyncExternalStore(subscribeNothing, supportsWebGL, () => false);

  if (!canUse3D || reduced) {
    return <ClayPlayground />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16, delay: 0.2 }}
      className="relative h-72 sm:h-[26rem] lg:h-[32rem]"
    >
      <div
        className="absolute inset-x-[22%] bottom-10 h-10 rounded-full bg-[#6b4fd6]/25 blur-2xl"
        aria-hidden
      />
      <ClayScene reduced={reduced} />
      <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-sm text-muted">
        Done Buddy를 눌러 보세요
      </p>
    </motion.div>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useRef, useState, type CSSProperties } from "react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import type { BowlControls } from "@/components/lab/three/PhysicsBowlCanvas";
import ThreeStage, { StageLoading } from "@/components/lab/three/ThreeStage";
import { useWebGL2 } from "@/lib/webgl";

// 물리 엔진(Rapier)은 WebAssembly까지 들어 있어 무거우므로, 이 데모 가까이 스크롤했을 때 불러옵니다.
const PhysicsBowlCanvas = dynamic(() => import("@/components/lab/three/PhysicsBowlCanvas"), {
  ssr: false,
  loading: () => <StageLoading />,
});

// PhysicsBowlCanvas의 MAX_BALLS와 같은 값입니다. 숫자 하나 때문에 무거운 파일을 미리 불러오지 않으려고 따로 적었어요.
const MAX_BALLS = 40;

const fallbackBalls = [
  { tone: "#b9a3ff", toneDark: "#7b5be0", className: "left-[24%] bottom-[30%] size-14" },
  { tone: "#ffb59c", toneDark: "#e0785a", className: "left-[40%] bottom-[28%] size-12" },
  { tone: "#8fe3bf", toneDark: "#4fb78d", className: "left-[52%] bottom-[30%] size-16" },
  { tone: "#9ccdff", toneDark: "#5a93d6", className: "left-[33%] bottom-[42%] size-11" },
  { tone: "#ffe27a", toneDark: "#e0b43c", className: "left-[47%] bottom-[44%] size-12" },
];

// 두 번째 데모: Rapier 물리 엔진으로 떨어지고 부딪히는 점토 공
export default function PhysicsBowlDemo() {
  const reduced = useReducedMotion() ?? false;
  const canUse3D = useWebGL2();
  const controlsRef = useRef<BowlControls | null>(null);
  const [count, setCount] = useState(0);

  return (
    <section aria-labelledby="physics-title" className="mx-auto mt-20 w-full max-w-5xl px-4 sm:px-6">
      <h2 id="physics-title" className="font-display text-3xl text-ink">
        점토 공 물리 놀이
      </h2>
      <p className="mt-2 leading-relaxed text-muted">
        그릇을 톡 누르면 그 자리에 공이 떨어져요. 공은 잡아서 끌었다가 놓으면 휙 던져지고, 톡 누르면 통 튀어요.
      </p>

      <ThreeStage
        className="mt-6 h-[22rem] sm:h-[28rem]"
        fallback={
          <div className="absolute inset-x-[12%] bottom-[22%] top-[30%]" aria-hidden>
            {fallbackBalls.map((ball) => (
              <span
                key={ball.tone}
                style={{ "--tone": ball.tone, "--tone-dark": ball.toneDark } as CSSProperties}
                className={`clay-ball absolute ${ball.className}`}
              />
            ))}
            {/* 그릇을 공보다 나중에 그려서 공이 그릇 안에 담긴 것처럼 보이게 합니다. */}
            <div className="clay absolute inset-x-0 bottom-0 h-1/2 rounded-b-full bg-white/90" />
          </div>
        }
      >
        <PhysicsBowlCanvas reduced={reduced} controlsRef={controlsRef} onCountChange={setCount} />
      </ThreeStage>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <motion.button
          type="button"
          disabled={!canUse3D}
          onClick={() => controlsRef.current?.drop()}
          whileTap={SQUISH_TAP}
          transition={SQUISH_SPRING}
          className="clay-sm bg-lilac px-5 py-3 font-display text-lg text-ink disabled:opacity-50"
        >
          점토 공 떨어뜨리기
        </motion.button>
        <motion.button
          type="button"
          disabled={!canUse3D}
          onClick={() => controlsRef.current?.shake()}
          whileTap={SQUISH_TAP}
          transition={SQUISH_SPRING}
          className="clay-sm bg-mint px-5 py-3 font-display text-lg text-ink disabled:opacity-50"
        >
          흔들기
        </motion.button>
        {canUse3D && (
          <p className="text-sm text-muted">
            공 {count} / {MAX_BALLS}개
          </p>
        )}
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        💡 공의 무게, 마찰, 튕김은 Rapier 물리 엔진이 계산해요. Rust로 만든 엔진을 WebAssembly(WASM)로 바꿔서
        브라우저 안에서 빠르게 돌리고, three.js는 그 결과대로 공을 그리기만 해요.
      </p>
    </section>
  );
}

"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useState, type CSSProperties } from "react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import { blobPaletteNames, blobPalettes, type BlobPaletteName } from "@/components/lab/three/clayBlobShader";
import ThreeStage, { StageLoading } from "@/components/lab/three/ThreeStage";
import { surfaceClass } from "@/data/profile";
import { useWebGL2 } from "@/lib/webgl";

// three.js는 브라우저에서만 동작하므로 서버 렌더링에서 빼고 화면 가까이 왔을 때 불러옵니다.
const ClayBlobCanvas = dynamic(() => import("@/components/lab/three/ClayBlobCanvas"), {
  ssr: false,
  loading: () => <StageLoading />,
});

// 말랑함 0~100을 셰이더가 표면을 밀어내는 거리로 바꿉니다.
function amplitudeFrom(softness: number) {
  return 0.03 + (softness / 100) * 0.28;
}

// 첫 번째 데모: GPU에서 도는 셰이더로 모양과 색을 바꾸는 점토 덩어리
export default function ShaderBlobDemo() {
  const reduced = useReducedMotion() ?? false;
  const canUse3D = useWebGL2();
  const [palette, setPalette] = useState<BlobPaletteName>("lilac");
  const [softness, setSoftness] = useState(40);
  // 직접 멈추거나 켜기 전까지는 '동작 줄이기' 설정을 따릅니다.
  const [playChoice, setPlayChoice] = useState<boolean | null>(null);
  const playing = playChoice ?? !reduced;
  const colors = blobPalettes[palette];

  return (
    <section aria-labelledby="shader-title" className="mx-auto mt-16 w-full max-w-5xl px-4 sm:px-6">
      <h2 id="shader-title" className="font-display text-3xl text-ink">
        말랑한 셰이더 덩어리
      </h2>
      <p className="mt-2 leading-relaxed text-muted">
        덩어리에 마우스를 올리면 그쪽으로 부풀고, 꾹 누르면 움푹 들어갔다가 출렁이며 돌아와요.
      </p>

      <ThreeStage
        className="mt-6 h-80 sm:h-[26rem]"
        fallback={
          <div
            style={{ "--tone": colors.base, "--tone-dark": colors.deep } as CSSProperties}
            className="clay-ball clay-ball-blob absolute inset-0 m-auto size-44 sm:size-56"
            aria-hidden
          />
        }
      >
        <div
          className="absolute inset-x-[30%] bottom-8 h-8 rounded-full bg-[#6b4fd6]/20 blur-2xl"
          aria-hidden
        />
        <ClayBlobCanvas palette={palette} amplitude={amplitudeFrom(softness)} playing={playing} />
      </ThreeStage>

      <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label="점토 색" className="flex flex-wrap gap-2">
          {blobPaletteNames.map((name) => {
            const selected = palette === name;
            return (
              <motion.button
                key={name}
                type="button"
                aria-pressed={selected}
                onClick={() => setPalette(name)}
                whileTap={SQUISH_TAP}
                transition={SQUISH_SPRING}
                className={`px-4 py-2 font-display text-ink ${surfaceClass[name]} ${selected ? "clay-pressed" : "clay-sm"}`}
              >
                {blobPalettes[name].label}
              </motion.button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-3 font-display text-ink sm:w-64 sm:flex-none">
            말랑함
            <input
              type="range"
              min={0}
              max={100}
              value={softness}
              onChange={(event) => setSoftness(Number(event.target.value))}
              className="min-w-0 flex-1 accent-[#8a6cff]"
            />
          </label>
          {/* 동작 줄이기 설정은 브라우저에서만 알 수 있어서, 3D가 켜진 뒤에 버튼을 보여 줍니다. */}
          {canUse3D && (
            <motion.button
              type="button"
              onClick={() => setPlayChoice(!playing)}
              whileTap={SQUISH_TAP}
              transition={SQUISH_SPRING}
              className="clay-sm shrink-0 bg-white/70 px-4 py-2 font-display text-ink"
            >
              {playing ? "멈추기" : "일렁이기"}
            </motion.button>
          )}
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted">
        💡 셰이더는 GPU에서 도는 작은 프로그램이에요. 구의 점 2만 6천 개쯤을 노이즈로 매 순간 밀고 당겨서 점토처럼
        일렁이게 하고, 색과 테두리 빛도 같은 자리에서 계산해요.
      </p>
    </section>
  );
}

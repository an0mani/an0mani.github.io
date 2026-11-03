"use client";

import Link from "next/link";
import { useRef } from "react";
import { gsap, MOTION_OK, toneStyle, tones, useGSAP } from "@/components/lab/gsap/stage";

// 장면 5: 막이 내리듯 마지막 카드가 말랑하게 튀어 오르고, 실험실로 돌아가는 길을 알려 줍니다.
export default function StageEnd() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        gsap
          .timeline({
            scrollTrigger: {
              trigger: scope.current,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          })
          .from(".stage-end-card", {
            scaleX: 0.7,
            scaleY: 0.5,
            y: 60,
            opacity: 0,
            duration: 1,
            ease: "elastic.out(1, 0.5)",
          })
          .from(".stage-end-ball", { scale: 0, duration: 0.6, ease: "back.out(3)", stagger: 0.1 }, "-=0.6");
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="mx-auto w-full max-w-5xl px-4 py-16 sm:px-6">
      <div className="stage-end-card clay relative flex flex-col items-start gap-6 bg-white/70 p-8 sm:p-10">
        <div className="flex gap-2" aria-hidden>
          {[tones.peach, tones.mint, tones.sky].map((tone) => (
            <span key={tone.tone} className="stage-end-ball clay-ball block size-8" style={toneStyle(tone)} />
          ))}
        </div>
        <div>
          <p className="font-display text-lg text-muted">장면 5 · 막 내리기</p>
          <h2 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">무대가 끝났어요</h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted">
            끝까지 내려 주셔서 고마워요. 다른 데모도 실험실에서 기다리고 있어요.
          </p>
        </div>
        <Link
          href="/lab"
          className="clay-sm inline-flex items-center gap-2 bg-lilac px-6 py-3.5 font-display text-lg text-ink transition-transform duration-200 hover:-translate-y-0.5"
        >
          ← 실험실로 돌아가기
        </Link>
      </div>
    </section>
  );
}

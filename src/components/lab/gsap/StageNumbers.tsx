"use client";

import { useRef } from "react";
import { surfaceClass, type ClayColor } from "@/data/profile";
import {
  gsap,
  HEADLINE_CHAR_COUNT,
  MOTION_OK,
  toneStyle,
  tones,
  useGSAP,
  type ClayTone,
} from "@/components/lab/gsap/stage";

type Stat = {
  value: number;
  suffix: string;
  label: string;
  color: ClayColor;
};

const stats: Stat[] = [
  { value: 4, suffix: "개", label: "함께 쓴 도구", color: "lilac" },
  { value: 5, suffix: "개", label: "스크롤 장면", color: "peach" },
  { value: HEADLINE_CHAR_COUNT, suffix: "자", label: "한 자씩 튀어나온 글자", color: "mint" },
  { value: 100, suffix: "%", label: "CSS로 빚은 점토", color: "sky" },
];

type FloatingBall = ClayTone & {
  id: string;
  className: string;
  /** 클수록 스크롤보다 빨리 움직여서 가까이 있는 것처럼 보입니다. */
  speed: number;
};

const floatingBalls: FloatingBall[] = [
  { id: "rose", ...tones.rose, speed: -40, className: "left-[4%] top-[8%] size-14 sm:size-20" },
  { id: "butter", ...tones.butter, speed: 70, className: "right-[6%] top-[14%] size-10 sm:size-14" },
  { id: "lilac", ...tones.lilac, speed: 90, className: "left-[38%] bottom-[6%] size-8 sm:size-12" },
  { id: "mint", ...tones.mint, speed: 120, className: "right-[18%] bottom-[2%] size-16 sm:size-24 clay-ball-blob" },
];

// 장면 4: 화면에 들어오면 숫자가 0부터 차오르고, 뒤의 점토 공은 서로 다른 빠르기로 흘러갑니다.
export default function StageNumbers() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const numbers = gsap.utils.toArray<HTMLElement>(".stage-number");
        numbers.forEach((number) => {
          const target = Number(number.dataset.value);
          const counter = { value: 0 };
          number.textContent = "0";
          gsap.to(counter, {
            value: target,
            duration: 1.6,
            ease: "power2.out",
            onUpdate: () => {
              number.textContent = String(Math.round(counter.value));
            },
            scrollTrigger: {
              trigger: number,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        gsap.from(".stage-number-card", {
          y: 50,
          opacity: 0,
          ease: "back.out(1.8)",
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".stage-number-grid",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        });

        gsap.utils.toArray<HTMLElement>(".stage-float").forEach((ball) => {
          gsap.to(ball, {
            y: () => -Number(ball.dataset.speed) * 2,
            rotation: Number(ball.dataset.speed) / 2,
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });
        });

        // 도중에 '동작 줄이기'를 켜면 세다 만 숫자가 남지 않게 최종 값으로 돌려 둡니다.
        return () => {
          numbers.forEach((number) => {
            number.textContent = number.dataset.value ?? "";
          });
        };
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="relative overflow-x-clip py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {floatingBalls.map((ball) => (
          <div
            key={ball.id}
            data-speed={ball.speed}
            className={`stage-float clay-ball absolute opacity-80 ${ball.className}`}
            style={toneStyle(ball)}
          />
        ))}
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <p className="font-display text-lg text-muted">장면 4 · 숫자 세기</p>
        <h2 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">숫자로 보는 무대</h2>
        <ul className="stage-number-grid mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {stats.map((stat) => (
            <li
              key={stat.label}
              className={`stage-number-card clay flex flex-col p-5 sm:p-6 ${surfaceClass[stat.color]}`}
            >
              {/* 숫자가 차오르는 동안 읽기 프로그램이 중간값을 읽지 않도록, 최종 값은 따로 적어 둡니다. */}
              <span className="sr-only">
                {stat.label} {stat.value}
                {stat.suffix}
              </span>
              <span aria-hidden className="font-display text-4xl text-ink sm:text-5xl">
                <span className="stage-number tabular-nums" data-value={stat.value}>
                  {stat.value}
                </span>
                <span className="ml-1 text-2xl">{stat.suffix}</span>
              </span>
              <span aria-hidden className="mt-2 leading-snug text-ink/80">
                {stat.label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

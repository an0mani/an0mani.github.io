"use client";

import { useRef } from "react";
import { gsap, MOTION_OK, pinStart, toneStyle, tones, useGSAP } from "@/components/lab/gsap/stage";

const phases = [
  { icon: "🫓", label: "반죽하기" },
  { icon: "🎳", label: "굴리기" },
  { icon: "🎨", label: "색 입히기" },
];

const startTones = [tones.lilac, tones.butter, tones.sky];
const endTones = [tones.peach, tones.mint, tones.rose];

const ROUND = "50% 50% 50% 50% / 50% 50% 50% 50%";
const BLOB = "38% 62% 56% 44% / 46% 40% 60% 54%";

// 장면 2: 화면을 붙잡아 두고, 스크롤한 만큼 점토 공을 뭉치고 굴리고 색을 입힙니다.
export default function StageBlobs() {
  const scope = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const section = scope.current;
        if (!section) {
          return;
        }
        const wraps = gsap.utils.toArray<HTMLElement>(".stage-blob");
        const clays = wraps.map((wrap) => wrap.firstElementChild as HTMLElement);
        const chips = gsap.utils.toArray<HTMLElement>(".stage-blob-phase");
        const fill = section.querySelector(".stage-blob-fill");
        const percent = section.querySelector(".stage-blob-percent");
        const [left, middle, right] = wraps;
        // 양옆 공이 가운데 공까지 가야 하는 거리입니다. 화면 크기가 바뀌면 다시 잽니다.
        const gap = () => middle.offsetLeft - left.offsetLeft;

        const timeline = gsap.timeline({
          defaults: { ease: "power2.inOut", duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: pinStart(section),
            end: "+=200%",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const active = Math.min(phases.length - 1, Math.floor(self.progress * phases.length));
              chips.forEach((chip, index) => {
                chip.dataset.active = String(index === active);
              });
              gsap.set(fill ?? [], { scaleX: self.progress });
              if (percent) {
                percent.textContent = `${Math.round(self.progress * 100)}%`;
              }
            },
          },
        });

        // 반죽하기: 양옆 공이 가운데로 모여 한 덩이가 되고, 눌렸다 펴지며 말랑하게 출렁입니다.
        timeline
          .to(left, { x: gap, scale: 0.6 }, 0)
          .to(right, { x: () => -gap(), scale: 0.6 }, 0)
          .to(middle, { scale: 1.45 }, 0)
          .to(
            clays,
            { keyframes: { scaleX: [1, 1.25, 0.9, 1], scaleY: [1, 0.75, 1.1, 1] }, ease: "none" },
            0,
          );

        // 굴리기: 한 덩이에서 공이 위아래로 튀어나오며 데굴데굴 구릅니다.
        timeline
          .to(left, { x: () => -gap() * 0.25, y: -70, scale: 0.9 }, 1)
          .to(right, { x: () => gap() * 0.25, y: 70, scale: 0.9 }, 1)
          .to(middle, { scale: 1 }, 1)
          .to(clays, { rotation: 360, ease: "none" }, 1);

        // 색 입히기: 제자리로 돌아오면서 새 색을 입고, 동그라미가 말랑한 덩어리 모양이 됩니다.
        timeline
          .to(wraps, { x: 0, y: 0, scale: 1.15 }, 2)
          .to(clays, { rotation: 400 }, 2);
        // 둥근 모서리와 CSS 변수 색은 시작값을 제대로 읽어 오지 못해서, 처음과 나중을 둘 다 적어 줍니다.
        timeline.fromTo(clays, { borderRadius: ROUND }, { borderRadius: BLOB }, 2);
        clays.forEach((clay, index) => {
          timeline.fromTo(
            clay,
            { "--tone": startTones[index].tone, "--tone-dark": startTones[index].toneDark },
            { "--tone": endTones[index].tone, "--tone-dark": endTones[index].toneDark },
            2,
          );
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="overflow-x-clip">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:px-6 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
        <div>
          <p className="font-display text-lg text-muted">장면 2 · 화면 붙잡기</p>
          <h2 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">점토 공을 빚어 볼까요?</h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-muted">
            이 장면은 잠시 화면에 붙어 있어요. 스크롤을 내린 만큼 공이 뭉치고, 구르고, 새 색을 입어요.
          </p>
          <ol className="mt-6 flex flex-wrap gap-3" aria-label="점토 공을 빚는 순서">
            {phases.map((phase, index) => (
              <li
                key={phase.label}
                data-active={index === 0 ? "true" : "false"}
                className="stage-blob-phase clay-sm flex items-center gap-2 bg-white/70 px-4 py-2 font-display text-ink transition-[background-color,transform] duration-300 motion-safe:data-[active=true]:-translate-y-1 motion-safe:data-[active=true]:bg-butter"
              >
                <span aria-hidden>{phase.icon}</span>
                {index + 1}. {phase.label}
              </li>
            ))}
          </ol>
          {/* 붙잡힌 장면이 얼마나 지나갔는지 보여 주는 막대입니다. 움직임을 줄이면 필요 없어서 숨깁니다. */}
          <div className="mt-6 flex items-center gap-3 motion-reduce:hidden" aria-hidden>
            <div className="clay-pressed h-4 flex-1 overflow-hidden bg-white/50 p-1">
              <div
                className="stage-blob-fill h-full origin-left rounded-full bg-lilac"
                style={{ transform: "scaleX(0)" }}
              />
            </div>
            <span className="stage-blob-percent w-12 text-right font-display text-ink tabular-nums">0%</span>
          </div>
        </div>

        <div className="clay relative grid h-64 place-items-center bg-white/60 sm:h-80" aria-hidden>
          <div className="flex items-center gap-6 sm:gap-10">
            {startTones.map((tone, index) => (
              <div key={tone.tone} className={`stage-blob ${index === 1 ? "size-20 sm:size-24" : "size-16 sm:size-20"}`}>
                <div className="clay-ball size-full" style={toneStyle(tone)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

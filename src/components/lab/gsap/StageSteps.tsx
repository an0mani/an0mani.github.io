"use client";

import { useRef } from "react";
import { surfaceClass, type ClayColor } from "@/data/profile";
import { gsap, MOTION_OK, pinStart, useGSAP } from "@/components/lab/gsap/stage";

type Step = {
  icon: string;
  title: string;
  body: string;
  color: ClayColor;
};

const steps: Step[] = [
  { icon: "💡", title: "떠올리기", body: "귀찮았던 일을 메모해 둬요. 작고 자주 겪는 불편일수록 좋은 앱이 돼요.", color: "butter" },
  { icon: "✏️", title: "그려 보기", body: "종이에 화면을 대충 그리고, 버튼을 몇 개까지 줄일 수 있는지 고민해요.", color: "peach" },
  { icon: "🧩", title: "만들기", body: "화면을 하나씩 만들고, 캐릭터와 애니메이션으로 손맛을 더해요.", color: "mint" },
  { icon: "🧪", title: "써 보기", body: "며칠 동안 직접 써 보면서 걸리는 곳을 고쳐요. 주변에도 써 봐 달라고 부탁해요.", color: "sky" },
  { icon: "🚀", title: "내보내기", body: "스토어에 올리고, 다음 작은 성취를 준비해요.", color: "lilac" },
];

// 장면 3: 세로로 스크롤하면 카드 줄이 옆으로 흘러갑니다. 페이지 자체는 옆으로 넘치지 않게 잘라 둡니다.
export default function StageSteps() {
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        const section = scope.current;
        const track = trackRef.current;
        if (!section || !track) {
          return;
        }
        // 카드 줄이 화면보다 긴 만큼만 옆으로 밀고, 그만큼 세로 스크롤을 붙잡아 둡니다.
        const distance = () => Math.max(0, track.scrollWidth - section.clientWidth);

        const slide = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: pinStart(section),
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // 카드가 화면 가운데로 들어올 때마다 아이콘이 통 튀어 오릅니다.
        gsap.utils.toArray<HTMLElement>(".stage-step-icon").forEach((icon) => {
          gsap.from(icon, {
            scale: 0.4,
            rotation: -25,
            ease: "back.out(3)",
            scrollTrigger: {
              trigger: icon,
              containerAnimation: slide,
              start: "left 85%",
              end: "left 45%",
              scrub: true,
            },
          });
        });
      });
    },
    { scope },
  );

  return (
    <section ref={scope} className="overflow-hidden py-12">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
        <p className="font-display text-lg text-muted">장면 3 · 옆으로 흐르기</p>
        <h2 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-5xl">앱 하나가 나오기까지</h2>
        <p className="mt-4 max-w-md text-lg leading-relaxed text-muted motion-reduce:hidden">
          아래로 스크롤하면 카드가 옆으로 지나가요.
        </p>
      </div>

      {/* 카드 줄 양옆 여백을 위 제목 줄과 맞춥니다. */}
      <ol
        ref={trackRef}
        className="mt-8 flex w-max gap-5 px-[max(1rem,calc((100%_-_64rem)/2_+_1rem))] sm:gap-6 sm:px-[max(1.5rem,calc((100%_-_64rem)/2_+_1.5rem))] motion-reduce:grid motion-reduce:w-full motion-reduce:sm:grid-cols-2 motion-reduce:lg:grid-cols-3"
      >
        {steps.map((step, index) => (
          <li
            key={step.title}
            className={`clay flex w-[78vw] max-w-sm shrink-0 flex-col p-6 sm:w-80 sm:p-8 motion-reduce:w-auto motion-reduce:max-w-none ${surfaceClass[step.color]}`}
          >
            <div className="flex items-start justify-between gap-3">
              <span className="stage-step-icon clay-sm grid size-14 place-items-center bg-white/80 text-2xl" aria-hidden>
                {step.icon}
              </span>
              <span className="font-display text-sm tracking-wider text-ink/75">
                STEP {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <h3 className="mt-6 font-display text-2xl text-ink">{step.title}</h3>
            <p className="mt-2 leading-relaxed text-ink/80">{step.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

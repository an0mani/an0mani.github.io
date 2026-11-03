"use client";

import { useRef } from "react";
import {
  gsap,
  HEADLINE,
  MOTION_OK,
  SplitText,
  toneStyle,
  tones,
  useGSAP,
  type ClayTone,
} from "@/components/lab/gsap/stage";

const SUBLINE = "글자는 한 자씩 튀어나오고, 점토 공은 스크롤을 따라 굴러가요. 천천히 내려 보세요.";

type HeroBall = ClayTone & {
  id: string;
  className: string;
  /** 스크롤할 때 얼마나 빨리 위로 흘러가는지 */
  drift: number;
};

const balls: HeroBall[] = [
  { id: "butter", ...tones.butter, drift: 60, className: "right-[6%] top-[6%] size-16 sm:size-24" },
  { id: "rose", ...tones.rose, drift: 120, className: "right-[30%] top-[38%] size-9 sm:size-12" },
  { id: "mint", ...tones.mint, drift: 90, className: "right-[10%] bottom-[16%] size-12 sm:size-16 clay-ball-blob" },
];

// 장면 1: 큰 제목이 한 자씩 통통 튀어나오고, 설명은 낱말 단위로 떠오릅니다.
export default function StageHero() {
  const scope = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLSpanElement>(null);
  const sublineRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        // 화면 읽기 프로그램은 위의 숨은 문장을 읽으니, 쪼갠 조각에는 aria를 따로 달지 않습니다.
        const title = SplitText.create(titleRef.current, { type: "words,chars", tag: "span", aria: "none" });
        const subline = SplitText.create(sublineRef.current, { type: "words", tag: "span", aria: "none" });

        // 쪼개기 전에 깜빡이지 않도록 감춰 둔 글자를 이제 보여 줍니다.
        gsap.set([titleRef.current, sublineRef.current], { visibility: "visible" });

        const intro = gsap.timeline({ delay: 0.15 });
        intro
          .from(title.chars, {
            yPercent: 120,
            scale: 0.3,
            rotation: () => gsap.utils.random(-30, 30),
            opacity: 0,
            duration: 1.1,
            ease: "elastic.out(1, 0.45)",
            stagger: 0.06,
          })
          .from(
            subline.words,
            { y: 24, opacity: 0, duration: 0.6, ease: "back.out(2)", stagger: 0.04 },
            "-=0.7",
          )
          .from(".stage-hero-hint", { y: 16, opacity: 0, duration: 0.5, ease: "back.out(3)" }, "-=0.3");

        // 스크롤 안내가 '여기 아래요' 하듯 콩콩 뜁니다.
        gsap.to(".stage-hero-hint-arrow", {
          y: 6,
          duration: 0.6,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });

        // 점토 공은 제자리에서 둥실거리다가, 스크롤하면 서로 다른 빠르기로 위로 흘러갑니다.
        gsap.utils.toArray<HTMLElement>(".stage-hero-ball").forEach((ball, index) => {
          gsap.to(ball.firstElementChild, {
            y: -14,
            rotation: index % 2 ? -8 : 8,
            duration: 1.8 + index * 0.4,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
          gsap.to(ball, {
            y: -Number(ball.dataset.drift),
            ease: "none",
            scrollTrigger: {
              trigger: scope.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        });
      });
    },
    { scope },
  );

  return (
    <section
      ref={scope}
      className="relative mx-auto flex w-full max-w-5xl flex-col justify-center overflow-x-clip px-4 pt-16 pb-24 sm:min-h-[80svh] sm:px-6"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {balls.map((ball) => (
          <div
            key={ball.id}
            data-drift={ball.drift}
            className={`stage-hero-ball absolute ${ball.className}`}
          >
            <div className="clay-ball size-full" style={toneStyle(ball)} />
          </div>
        ))}
      </div>

      <p className="relative font-display text-lg text-muted">장면 1 · 글자 쪼개기</p>
      <h2 className="relative mt-2 font-display text-5xl leading-tight text-ink sm:text-7xl">
        {/* 글자를 한 자씩 쪼개면 읽기 프로그램이 낱자로 읽어서, 온전한 문장을 따로 둡니다. */}
        <span className="sr-only">{HEADLINE.join(" ")}</span>
        <span ref={titleRef} aria-hidden className="block motion-safe:invisible">
          {HEADLINE.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </span>
      </h2>
      <p className="relative mt-6 max-w-xl text-lg leading-relaxed text-muted">
        <span className="sr-only">{SUBLINE}</span>
        <span ref={sublineRef} aria-hidden className="motion-safe:invisible">
          {SUBLINE}
        </span>
      </p>

      <p className="stage-hero-hint clay-sm relative mt-10 inline-flex items-center gap-2 self-start bg-white/70 px-4 py-2 font-display text-ink">
        스크롤해 보세요
        <span className="stage-hero-hint-arrow inline-block" aria-hidden>
          ↓
        </span>
      </p>
    </section>
  );
}

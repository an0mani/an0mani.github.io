import type { Metadata } from "next";
import Link from "next/link";
import { ViewTransition } from "react";
import { labDemos } from "@/data/lab";
import { profile, surfaceClass } from "@/data/profile";

export const metadata: Metadata = {
  title: `애니메이션 실험실 | ${profile.name}`,
  description: "Motion, GSAP, Lenis, Rive, Lottie, three.js로 만든 작은 애니메이션 데모 모음",
  alternates: {
    canonical: "/lab",
  },
};

// 웹 애니메이션 라이브러리를 하나씩 써 보는 데모 모음입니다. 카드를 누르면 카드가 이어지듯 데모 페이지로 넘어갑니다.
export default function Lab() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 sm:py-14">
      <Link
        href="/"
        className="clay-sm inline-flex items-center gap-2 bg-white/70 px-4 py-2 font-display text-ink"
      >
        ← 첫 화면
      </Link>
      <p className="mt-10 font-display text-lg text-muted">Lab</p>
      <h1 className="font-display text-4xl text-ink sm:text-5xl">애니메이션 실험실</h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
        다음 작업에 쓸 애니메이션 도구를 하나씩 직접 만져 보는 곳이에요. 같이 쓰면 좋은 것은 한 페이지에
        묶었어요. 기기에서 &lsquo;동작 줄이기&rsquo;를 켜 두면 큰 움직임은 꺼집니다.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2">
        {labDemos.map((demo) => (
          <li key={demo.slug}>
            <Link
              href={`/lab/${demo.slug}`}
              className={`clay group flex h-full flex-col p-6 transition-transform duration-300 hover:-translate-y-1 ${surfaceClass[demo.color]}`}
            >
              <div className="flex items-center gap-4">
                <ViewTransition name={`lab-icon-${demo.slug}`}>
                  <span
                    className="clay-sm grid size-14 shrink-0 place-items-center bg-white/80 text-2xl"
                    aria-hidden
                  >
                    {demo.icon}
                  </span>
                </ViewTransition>
                <ViewTransition name={`lab-title-${demo.slug}`}>
                  <h2 className="font-display text-2xl text-ink">{demo.title}</h2>
                </ViewTransition>
              </div>
              <p className="mt-4 flex-1 leading-relaxed text-ink">{demo.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2" aria-label="사용한 라이브러리">
                {demo.libraries.map((library) => (
                  <li key={library} className="clay-pressed bg-white/50 px-3 py-1 text-sm font-medium text-ink">
                    {library}
                  </li>
                ))}
              </ul>
              <span className="mt-5 font-display text-lg text-ink">들어가 보기 →</span>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

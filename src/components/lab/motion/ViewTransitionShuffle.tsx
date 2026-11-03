"use client";

import { startTransition, useState, ViewTransition } from "react";
import { surfaceClass } from "@/data/profile";
import { wins } from "./wins";

function shuffled<T>(items: T[]): T[] {
  const next = [...items];
  for (let index = next.length - 1; index > 0; index--) {
    const other = Math.floor(Math.random() * (index + 1));
    [next[index], next[other]] = [next[other], next[index]];
  }
  return next;
}

// 같은 '섞기'를 브라우저의 View Transitions로 합니다. 라이브러리 없이 브라우저가 이전·다음 화면을 찍어 이어 줍니다.
// React의 ViewTransition은 startTransition 안에서 바뀐 상태에만 반응합니다.
export default function ViewTransitionShuffle() {
  const [items, setItems] = useState(wins);
  const [compact, setCompact] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => startTransition(() => setItems((current) => shuffled(current)))}
          className="clay-sm bg-lilac px-5 py-3 font-display text-ink"
        >
          섞기
        </button>
        <button
          type="button"
          aria-pressed={compact}
          onClick={() => startTransition(() => setCompact((current) => !current))}
          className="clay-sm bg-white/80 px-5 py-3 font-display text-ink"
        >
          {compact ? "크게 보기" : "작게 보기"}
        </button>
      </div>
      <ul className={`mt-5 grid gap-3 ${compact ? "grid-cols-3 sm:grid-cols-6" : "grid-cols-2 sm:grid-cols-3"}`}>
        {items.map((win) => (
          <ViewTransition key={win.id} name={`lab-vt-${win.id}`}>
            <li
              className={`clay-sm flex flex-col items-center gap-2 text-center ${surfaceClass[win.color]} ${
                compact ? "p-3" : "p-5"
              }`}
            >
              <span className={compact ? "text-2xl" : "text-3xl"} aria-hidden>
                {win.icon}
              </span>
              {!compact && <span className="font-display text-ink">{win.title}</span>}
              {compact && <span className="sr-only">{win.title}</span>}
            </li>
          </ViewTransition>
        ))}
      </ul>
    </div>
  );
}

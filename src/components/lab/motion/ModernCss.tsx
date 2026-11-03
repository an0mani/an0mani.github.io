"use client";

import { useEffect, useRef, useState } from "react";
import { surfaceClass } from "@/data/profile";
import { wins } from "./wins";

// 스크롤 연동·linear() 스프링·@starting-style을 한 곳에서 써 봅니다. 움직임은 모두 CSS가 맡습니다.
export default function ModernCss() {
  const [toastCount, setToastCount] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  // 누를 때마다 새 key로 다시 그려서 @starting-style 등장 효과가 매번 보이게 합니다.
  const showToast = () => {
    setToastCount((count) => count + 1);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToastCount(0), 2400);
  };

  return (
    <div>
      <div className="lab-css-progress" aria-hidden />

      <p className="lab-css-unsupported clay-pressed mb-5 bg-butter/60 px-4 py-3 text-sm leading-relaxed text-ink">
        이 브라우저는 아직 스크롤 연동 애니메이션을 지원하지 않아서, 카드가 움직이지 않고 그대로 보여요. 최신
        Chrome·Edge·Safari에서 열어 보세요.
      </p>

      <ul className="grid gap-4 sm:grid-cols-3">
        {wins.map((win) => (
          <li key={win.id} className={`lab-css-reveal clay-sm p-5 ${surfaceClass[win.color]}`}>
            <span className="text-3xl" aria-hidden>
              {win.icon}
            </span>
            <p className="mt-2 font-display text-ink">{win.title}</p>
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button type="button" className="lab-css-spring clay-sm bg-peach px-5 py-3 font-display text-ink">
          올려 보세요 (linear 스프링)
        </button>
        <button type="button" onClick={showToast} className="clay-sm bg-mint px-5 py-3 font-display text-ink">
          알림 띄우기 (@starting-style)
        </button>
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4" aria-live="polite">
        {toastCount > 0 && (
          <p key={toastCount} className="lab-css-toast clay bg-white px-6 py-4 font-display text-ink">
            오늘도 하나 해냈어요! 🎉
          </p>
        )}
      </div>
    </div>
  );
}

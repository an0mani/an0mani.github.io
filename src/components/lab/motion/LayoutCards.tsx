"use client";

import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { useEffect, useState } from "react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import { surfaceClass } from "@/data/profile";
import { wins, type Win } from "./wins";

type View = "grid" | "list";

const views: { id: View; label: string }[] = [
  { id: "grid", label: "바둑판" },
  { id: "list", label: "목록" },
];

// layout만 붙이면 배치가 바뀔 때 카드가 새 자리로 미끄러져 갑니다.
// 카드를 누르면 같은 layoutId를 가진 큰 카드로 이어지듯 커집니다.
export default function LayoutCards() {
  const [view, setView] = useState<View>("grid");
  const [opened, setOpened] = useState<Win | null>(null);

  useEffect(() => {
    if (!opened) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpened(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [opened]);

  return (
    <LayoutGroup>
      <div className="clay-pressed inline-flex gap-1 bg-white/50 p-1" role="group" aria-label="보기 방식">
        {views.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={view === item.id}
            onClick={() => setView(item.id)}
            className="relative px-4 py-2 font-display text-ink"
          >
            {view === item.id && (
              <motion.span
                layoutId="lab-view-pill"
                transition={SQUISH_SPRING}
                className="clay-sm absolute inset-0 bg-lilac"
              />
            )}
            <span className="relative">{item.label}</span>
          </button>
        ))}
      </div>

      <motion.ul layout className={`mt-6 grid gap-3 ${view === "grid" ? "grid-cols-2 sm:grid-cols-3" : "grid-cols-1"}`}>
        {wins.map((win) => (
          <motion.li key={win.id} layout transition={SQUISH_SPRING}>
            <motion.button
              type="button"
              layoutId={`lab-win-${win.id}`}
              onClick={() => setOpened(win)}
              whileTap={SQUISH_TAP}
              transition={SQUISH_SPRING}
              className={`clay-sm flex w-full items-center gap-3 p-4 text-left ${surfaceClass[win.color]} ${
                view === "grid" ? "flex-col sm:items-start" : ""
              }`}
            >
              <motion.span layout="position" className="text-2xl" aria-hidden>
                {win.icon}
              </motion.span>
              <motion.span layout="position" className="font-display text-ink">
                {win.title}
              </motion.span>
            </motion.button>
          </motion.li>
        ))}
      </motion.ul>

      <AnimatePresence>
        {opened && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpened(null)}
            className="fixed inset-0 z-50 grid place-items-center bg-ink/30 p-4 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`lab-win-${opened.id}`}
              transition={SQUISH_SPRING}
              role="dialog"
              aria-modal="true"
              aria-label={opened.title}
              onClick={(event) => event.stopPropagation()}
              className={`clay w-full max-w-sm p-8 ${surfaceClass[opened.color]}`}
            >
              <span className="text-5xl" aria-hidden>
                {opened.icon}
              </span>
              <h3 className="mt-4 font-display text-3xl text-ink">{opened.title}</h3>
              <p className="mt-3 leading-relaxed text-ink">
                작은 카드와 큰 카드에 같은 layoutId를 붙이면, 위치와 크기를 계산해서 이어지듯 커지고 작아져요.
              </p>
              <button
                type="button"
                autoFocus
                onClick={() => setOpened(null)}
                className="clay-sm mt-6 bg-white/80 px-5 py-3 font-display text-ink"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

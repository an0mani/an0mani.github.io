"use client";

import { AnimatePresence, motion, useAnimate, useSpring, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import Section from "@/components/Section";
import { doneTasks } from "@/data/profile";

const BURST_COLORS = ["#b9a3ff", "#ffb59c", "#8fe3bf", "#9ccdff", "#ffe27a", "#ffa3c6"];

// 체크할 때 사방으로 튀는 작은 점토 조각
function Burst() {
  return (
    <span className="pointer-events-none absolute inset-0" aria-hidden>
      {BURST_COLORS.map((color, index) => {
        const angle = (index / BURST_COLORS.length) * Math.PI * 2;

        return (
          <motion.span
            key={color}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x: Math.cos(angle) * 34, y: Math.sin(angle) * 34, scale: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{ backgroundColor: color }}
            className="absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 size-3 rounded-full"
          />
        );
      })}
    </span>
  );
}

type BuddyProps = {
  doneCount: number;
  total: number;
};

// Done Buddy 자리에 들어간 임시 캐릭터
function Buddy({ doneCount, total }: BuddyProps) {
  const [scope, animate] = useAnimate();
  const isFirstRender = useRef(true);

  // 해낸 개수가 늘수록 입꼬리가 올라갑니다.
  const smile = useSpring(0, SQUISH_SPRING);
  const mouth = useTransform(smile, (value) => {
    const edgeX = 5 * value;
    const edgeY = 66 - 6 * value;

    return `M ${34 - edgeX} ${edgeY} Q 50 ${68 + 18 * value} ${66 + edgeX} ${edgeY}`;
  });
  const cheekOpacity = useTransform(smile, [0, 1], [0.25, 0.85]);

  useEffect(() => {
    smile.set(doneCount / total);

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    animate(scope.current, { y: [0, -18, 0], scaleY: [1, 1.08, 0.94, 1] }, { duration: 0.55 });
  }, [animate, doneCount, scope, smile, total]);

  return (
    <div ref={scope} className="mx-auto size-36">
      <svg viewBox="0 0 100 100" className="size-full drop-shadow-[0_14px_18px_rgba(107,79,214,0.3)]">
        <defs>
          <radialGradient id="buddy-body" cx="35%" cy="30%" r="75%">
            <stop offset="0" stopColor="#f6f2ff" />
            <stop offset="1" stopColor="#a78bff" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="52" r="42" fill="url(#buddy-body)" />
        <motion.g
          animate={{ scaleY: [1, 0.1, 1] }}
          transition={{ duration: 0.25, repeat: Infinity, repeatDelay: 3.2 }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          fill="#2d2545"
        >
          <ellipse cx="37" cy="46" rx="4.5" ry="5.5" />
          <ellipse cx="63" cy="46" rx="4.5" ry="5.5" />
        </motion.g>
        <motion.g style={{ opacity: cheekOpacity }} fill="#ffa3c6">
          <circle cx="28" cy="60" r="5" />
          <circle cx="72" cy="60" r="5" />
        </motion.g>
        <motion.path
          d={mouth}
          fill="none"
          stroke="#2d2545"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

export default function DoneDemo() {
  const [checked, setChecked] = useState<boolean[]>(() => doneTasks.map(() => false));
  const [bursts, setBursts] = useState<number[]>(() => doneTasks.map(() => 0));

  const doneCount = checked.filter(Boolean).length;
  const isAllDone = doneCount === doneTasks.length;

  const toggleTask = (index: number) => {
    const willCheck = !checked[index];

    setChecked((prev) => prev.map((value, i) => (i === index ? willCheck : value)));
    if (willCheck) {
      setBursts((prev) => prev.map((value, i) => (i === index ? value + 1 : value)));
    }
  };

  return (
    <Section id="done" eyebrow="Mini Demo" title="Done It 맛보기">
      <div className="clay grid gap-8 bg-white/70 p-6 sm:p-10 md:grid-cols-[1fr_1.4fr] md:items-center">
        <div className="text-center">
          <Buddy doneCount={doneCount} total={doneTasks.length} />
          <p className="mt-4 font-display text-2xl text-ink">
            {doneCount} / {doneTasks.length} 해냈어요
          </p>
          <div className="clay-pressed mx-auto mt-4 h-5 max-w-60 overflow-hidden bg-lilac/40 p-1">
            <motion.div
              animate={{ width: `${(doneCount / doneTasks.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 180, damping: 18 }}
              className="h-full rounded-full bg-[#a78bff]"
            />
          </div>
          <AnimatePresence>
            {isAllDone && (
              <motion.p
                initial={{ opacity: 0, scale: 0.4, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
                className="clay-sm mt-5 inline-block bg-butter px-5 py-2 font-display text-lg text-ink"
              >
                오늘도 해냈어요! 🎉
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <ul className="flex flex-col gap-4">
          {doneTasks.map((task, index) => (
            <li key={task}>
              <motion.button
                type="button"
                onClick={() => toggleTask(index)}
                aria-pressed={checked[index]}
                whileHover={{ x: 4 }}
                whileTap={SQUISH_TAP}
                transition={SQUISH_SPRING}
                className={`clay-sm flex w-full items-center gap-4 px-5 py-4 text-left transition-colors ${
                  checked[index] ? "bg-mint" : "bg-white/85"
                }`}
              >
                <span
                  className={`relative grid size-9 shrink-0 place-items-center rounded-full ${
                    checked[index] ? "clay-sm bg-white" : "clay-pressed bg-lilac/30"
                  }`}
                >
                  <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                    <motion.path
                      d="M5 12.5 L10 17 L19 7"
                      fill="none"
                      stroke="#2d9c6f"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={false}
                      animate={{ pathLength: checked[index] ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                    />
                  </svg>
                  {bursts[index] > 0 && <Burst key={bursts[index]} />}
                </span>
                <span
                  className={`text-lg text-ink transition-opacity ${
                    checked[index] ? "line-through opacity-60" : ""
                  }`}
                >
                  {task}
                </span>
              </motion.button>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

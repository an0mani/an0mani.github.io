"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ClayButton, { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import Section from "@/components/Section";

// Flutter 웹 빌드 결과물은 public/done-it 에 들어갑니다.
const APP_URL = "/done-it/index.html";

const features = [
  "할 일을 누르면 말랑하게 눌리고 체크됩니다.",
  "해낸 만큼 Done Buddy가 점점 더 웃어요.",
  "아래 입력창으로 할 일을 직접 추가할 수 있어요.",
];

export default function AppDemo() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Section id="app" eyebrow="Flutter Web" title="Done It 체험하기">
      <div className="grid items-center gap-12 md:grid-cols-[1fr_20rem]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        >
          <p className="text-lg leading-relaxed text-muted">
            오른쪽 화면은 그림이 아니라 <strong className="text-ink">Flutter로 만든 실제 앱</strong>입니다.
            Done It의 핵심 동작을 작게 떼어 와서 웹으로 빌드했습니다.
          </p>
          <ul className="mt-6 flex flex-col gap-3">
            {features.map((feature, index) => (
              <motion.li
                key={feature}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + index * 0.08 }}
                className="clay-sm flex items-center gap-3 bg-white/75 px-5 py-3 text-ink"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-full bg-mint text-sm" aria-hidden>
                  ✓
                </span>
                {feature}
              </motion.li>
            ))}
          </ul>
          <div className="mt-8">
            <ClayButton href={APP_URL} variant="plain" external>
              새 창에서 열기 ↗
            </ClayButton>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 110, damping: 14 }}
          className="clay mx-auto w-full max-w-80 rounded-[3rem] bg-white p-3"
        >
          <div className="relative aspect-[9/19] overflow-hidden rounded-[2.4rem] bg-[#f4efff]">
            <span
              className="absolute top-3 left-1/2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-ink"
              aria-hidden
            />

            {isLaunched && (
              <iframe
                src={APP_URL}
                title="Done It 미니 앱 (Flutter)"
                onLoad={() => setIsLoaded(true)}
                className="absolute inset-0 size-full border-0"
              />
            )}

            <AnimatePresence>
              {!isLoaded && (
                <motion.div
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center"
                >
                  <motion.span
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                    className="clay grid size-24 place-items-center rounded-full bg-lilac text-4xl"
                    aria-hidden
                  >
                    ✅
                  </motion.span>
                  <p className="font-display text-2xl text-ink">Done It mini</p>
                  {isLaunched ? (
                    <p className="text-muted">앱을 불러오는 중이에요…</p>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={() => setIsLaunched(true)}
                      whileHover={{ y: -3, scale: 1.04 }}
                      whileTap={SQUISH_TAP}
                      transition={SQUISH_SPRING}
                      className="clay-sm bg-lilac px-6 py-3.5 font-display text-lg text-ink"
                    >
                      앱 실행하기 ▶
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

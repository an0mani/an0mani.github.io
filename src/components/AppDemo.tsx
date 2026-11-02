"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";
import ClayButton, { SQUISH_SPRING, SQUISH_TAP } from "@/components/ClayButton";
import Section from "@/components/Section";
import { appScreens } from "@/data/profile";

// Flutter 웹 빌드 결과물은 public/done-it 에 들어갑니다.
const APP_URL = "/done-it/index.html";

const features = [
  "기록하면 Done Buddy가 그날 기분에 맞춰 표정을 바꿔요.",
  "구글 드라이브로 백업해서 폰을 바꿔도 이어서 써요.",
  "한 해의 기록을 한 장의 지도와 월간 회고 카드로 돌아봐요.",
];

export default function AppDemo() {
  const [isLaunched, setIsLaunched] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Section id="app" eyebrow="Flutter" title="Done It 둘러보기">
      <div className="grid items-start gap-12 md:grid-cols-[1fr_20rem]">
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
          className="md:pt-8"
        >
          <p className="text-lg leading-relaxed text-muted">
            Done It은 <strong className="text-ink">Flutter로 만든 Android 앱</strong>이에요.
            폰 화면은 실제 앱을 찍은 것이고, &quot;미니 데모 실행&quot;을 누르면 핵심 동작만 떼어 낸 데모가 그 자리에서 실행돼요.
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
          <div className="mt-8 flex flex-wrap gap-4">
            <ClayButton href={APP_URL} variant="plain" external>
              미니 데모 새 창에서 열기 ↗
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
          <div className="relative aspect-[390/844] overflow-hidden rounded-[2.4rem] bg-[#f4efff]">
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
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={appScreens[0].src}
                    alt="Done It 홈 화면"
                    fill
                    sizes="320px"
                    className="object-cover object-top"
                    priority={false}
                  />
                  <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-3 bg-gradient-to-t from-[#f4efff] via-[#f4efff]/90 to-transparent px-6 pt-24 pb-8">
                    {isLaunched ? (
                      <p className="font-display text-lg text-ink">미니 데모를 불러오는 중이에요…</p>
                    ) : (
                      <motion.button
                        type="button"
                        onClick={() => setIsLaunched(true)}
                        whileHover={{ y: -3, scale: 1.04 }}
                        whileTap={SQUISH_TAP}
                        transition={SQUISH_SPRING}
                        className="clay-sm bg-lilac px-6 py-3.5 font-display text-lg text-ink"
                      >
                        미니 데모 실행 ▶
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <h3 className="mt-16 mb-6 font-display text-2xl text-ink">실제 앱 화면</h3>
      <div className="-mx-4 flex snap-x snap-mandatory gap-6 overflow-x-auto px-4 pt-2 pb-8 sm:-mx-6 sm:px-6">
        {appScreens.map((screen, index) => (
          <motion.figure
            key={screen.src}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, rotate: index % 2 === 0 ? -1.5 : 1.5 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ type: "spring", stiffness: 160, damping: 16, delay: index * 0.06 }}
            className="w-44 shrink-0 snap-start sm:w-52"
          >
            <div className="clay rounded-[2rem] bg-white p-2">
              <div className="relative aspect-[390/844] overflow-hidden rounded-[1.6rem]">
                <Image
                  src={screen.src}
                  alt={`Done It ${screen.label} 화면`}
                  fill
                  sizes="208px"
                  className="object-cover object-top"
                />
              </div>
            </div>
            <figcaption className="mt-3 text-center font-display text-ink">{screen.label}</figcaption>
          </motion.figure>
        ))}
      </div>
    </Section>
  );
}

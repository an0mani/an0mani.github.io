"use client";

import { LottieState, LottieSubscription, useLottieLight } from "lottie-react";
import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import ClayChip from "@/components/lab/characters/ClayChip";
import StageNotice from "@/components/lab/characters/StageNotice";

const BUDDY_SRC = "/lab/lottie/done-buddy.json";

// scripts/make-done-buddy-lottie.mjs에서 정한 구간입니다. 0~120은 기본 반복, 120~180은 높은 점프예요.
const BOUNCE: readonly [number, number] = [0, 120];
const JUMP: readonly [number, number] = [120, 180];

const speeds = [0.5, 1, 2];

export default function LottieBuddy() {
  const reduced = useReducedMotion() ?? false;
  const [speed, setSpeed] = useState(1);
  // 멈춰 있을 때 누른 점프는 한 번만 뛰고 다시 멈춥니다.
  const jumpOnce = useRef(false);

  // 표정과 모양에 expressions를 쓰지 않아서 가장 가벼운 light 빌드로 충분합니다.
  const { state, play, pause, playSegments, resetSegments, seek, subscribe, setDisplayRef } = useLottieLight({
    src: BUDDY_SRC,
    autoplay: !reduced,
    loop: true,
    speed,
    segment: BOUNCE,
  });
  const playing = state === LottieState.playing;
  const ready = state !== LottieState.loading && state !== LottieState.error;

  useEffect(
    () =>
      subscribe(LottieSubscription.loopCompleted, () => {
        if (!jumpOnce.current) {
          return;
        }
        jumpOnce.current = false;
        pause();
        resetSegments();
        seek(0);
      }),
    [subscribe, pause, resetSegments, seek],
  );

  const togglePlay = () => {
    jumpOnce.current = false;
    if (playing) {
      pause();
    } else {
      play();
    }
  };

  // 반복 중이면 점프를 한 번 끼워 넣고, 끝나면 다시 통통 튀기로 돌아갑니다.
  const jump = () => {
    if (!ready) {
      return;
    }
    if (playing && !jumpOnce.current) {
      playSegments([JUMP, BOUNCE]);
    } else {
      jumpOnce.current = true;
      playSegments(JUMP);
    }
  };

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-sm">
        <button
          type="button"
          ref={setDisplayRef}
          onClick={jump}
          disabled={!ready}
          aria-label="Done Buddy를 높이 점프시키기"
          className="block size-full cursor-pointer rounded-[2rem]"
        />
        {!ready && (
          <StageNotice kind={state === LottieState.error ? "error" : "loading"} className="absolute inset-0" />
        )}
      </div>
      <p className="mt-2 text-center text-sm text-muted">Done Buddy를 누르면 높이 점프해요</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <ClayChip onClick={togglePlay}>
          {playing ? (
            <>
              <span aria-hidden>⏸</span> 멈추기
            </>
          ) : (
            <>
              <span aria-hidden>▶</span> 재생
            </>
          )}
        </ClayChip>
        <div role="group" aria-label="재생 속도" className="flex flex-wrap gap-2">
          {speeds.map((value) => (
            <ClayChip
              key={value}
              pressed={speed === value}
              label={`${value}배 속도`}
              onClick={() => setSpeed(value)}
            >
              {value}×
            </ClayChip>
          ))}
        </div>
      </div>
      {reduced && (
        <p className="mt-4 text-center text-sm text-muted">
          기기에서 &lsquo;동작 줄이기&rsquo;가 켜져 있어서 멈춰 두었어요. 재생을 누르면 움직여요.
        </p>
      )}
    </div>
  );
}

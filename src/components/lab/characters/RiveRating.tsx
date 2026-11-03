"use client";

import {
  EventType,
  useRive,
  useRiveFile,
  type Event as RiveEvent,
  type RiveEventPayload,
} from "@rive-app/react-canvas";
import { useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import ClayChip from "@/components/lab/characters/ClayChip";
import StageNotice from "@/components/lab/characters/StageNotice";
import { setRiveInput, useCalmPlayback } from "@/components/lab/characters/riveRuntime";

const RATING_SRC = "/lab/rive/rating.riv";
const STATE_MACHINE = "State Machine 1";
const STARS = [1, 2, 3, 4, 5];

// 파일이 보내는 메시지는 영어라서, 화면에는 별 수에 맞춘 한국어 한마디를 보여 줍니다.
const ratingNotes: Record<number, string> = {
  1: "아쉬웠군요. 더 다듬어 볼게요.",
  2: "솔직하게 알려 주셔서 고마워요.",
  3: "무난했군요. 다음엔 더 좋게 만들어 볼게요.",
  4: "마음에 드셨다니 다행이에요.",
  5: "최고예요! 덕분에 힘이 나요.",
};

// 별을 누르면 .riv 안의 상태 머신이 별을 채우고, rating·message 속성을 담은 Rive 이벤트를 보냅니다.
export default function RiveRating() {
  const reduced = useReducedMotion() ?? false;
  const { riveFile, status } = useRiveFile({ src: RATING_SRC });
  const { rive, RiveComponent } = useRive(
    status === "success" && riveFile
      ? { riveFile, stateMachine: STATE_MACHINE, autoplay: !reduced, isTouchScrollEnabled: true }
      : null,
  );
  const wake = useCalmPlayback(rive, reduced);
  const [rating, setRating] = useState<number | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);

  useEffect(() => {
    if (!rive) {
      return;
    }

    const handleRiveEvent = (event: RiveEvent) => {
      const payload = event.data as RiveEventPayload;
      const value = payload.properties?.rating;
      if (typeof value === "number") {
        setRating(value);
        setEventName(payload.name);
      }
    };

    rive.on(EventType.RiveEvent, handleRiveEvent);
    return () => rive.off(EventType.RiveEvent, handleRiveEvent);
  }, [rive]);

  // 캔버스 속 별은 키보드로 누를 수 없어서, 같은 상태 머신 입력을 바꾸는 버튼을 따로 둡니다.
  const choose = (value: number) => {
    wake();
    setRiveInput(rive, STATE_MACHINE, "rating", value);
  };

  return (
    <div>
      <div
        className="relative aspect-square w-full overflow-hidden rounded-[1.5rem]"
        onPointerDownCapture={wake}
      >
        {status !== "failed" && (
          <RiveComponent
            className="size-full"
            role="img"
            aria-label="Rive 별점 예제: 분홍 바탕 위에 별 다섯 개가 있어요"
          />
        )}
        {!rive && <StageNotice kind={status === "failed" ? "error" : "loading"} className="absolute inset-0" />}
      </div>

      <div aria-live="polite" className="mt-5">
        <p className="font-display text-xl text-ink">
          {rating ? `별 ${rating}개를 골랐어요` : "별을 눌러 골라 보세요"}
        </p>
        <p className="mt-1 text-ink/80">
          {rating ? ratingNotes[rating] : "고른 별 수는 Rive 이벤트로 받아서 여기에 적어요."}
        </p>
      </div>
      {eventName && (
        <p className="mt-2 text-sm text-muted">
          받은 이벤트 <code className="rounded-md bg-white/70 px-1.5 py-0.5 text-ink">{eventName}</code>
        </p>
      )}

      <div role="group" aria-label="버튼으로 별점 고르기" className="mt-4 flex flex-wrap gap-2">
        {STARS.map((star) => (
          <ClayChip key={star} pressed={rating === star} label={`별 ${star}개 주기`} onClick={() => choose(star)}>
            <span aria-hidden>★</span> {star}
          </ClayChip>
        ))}
      </div>
    </div>
  );
}

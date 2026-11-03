"use client";

import dynamic from "next/dynamic";
import StageNotice from "@/components/lab/characters/StageNotice";

// Rive(WASM)와 Lottie는 브라우저에서만 그릴 수 있어서 서버 렌더링에서 빼고, 받는 동안 점토 판을 보여 줍니다.
export const RiveRating = dynamic(() => import("@/components/lab/characters/RiveRating"), {
  ssr: false,
  loading: () => <StageNotice kind="loading" className="aspect-square w-full" />,
});

export const RiveAvatars = dynamic(() => import("@/components/lab/characters/RiveAvatars"), {
  ssr: false,
  loading: () => <StageNotice kind="loading" className="aspect-square w-full" />,
});

export const LottieBuddy = dynamic(() => import("@/components/lab/characters/LottieBuddy"), {
  ssr: false,
  loading: () => <StageNotice kind="loading" className="mx-auto aspect-square w-full max-w-sm" />,
});

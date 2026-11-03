// 스크롤 무대 데모가 함께 쓰는 GSAP 설정과 점토 색입니다.

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import type { CSSProperties } from "react";

// 플러그인은 여기서 한 번만 등록하고, 장면마다 이 파일에서 가져다 씁니다.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

export { gsap, ScrollTrigger, SplitText, useGSAP };

// 기기에서 '동작 줄이기'를 켜 두지 않았을 때만 움직임을 붙입니다.
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

export type ClayTone = {
  tone: string;
  toneDark: string;
};

export const tones = {
  butter: { tone: "#ffe27a", toneDark: "#e0b43c" },
  peach: { tone: "#ffb59c", toneDark: "#e0785a" },
  mint: { tone: "#8fe3bf", toneDark: "#4fb78d" },
  sky: { tone: "#9ccdff", toneDark: "#5a93d6" },
  rose: { tone: "#ffa3c6", toneDark: "#e06a98" },
  lilac: { tone: "#b9a3ff", toneDark: "#7b5be0" },
} satisfies Record<string, ClayTone>;

export function toneStyle({ tone, toneDark }: ClayTone): CSSProperties {
  return {
    "--tone": tone,
    "--tone-dark": toneDark,
  } as CSSProperties;
}

// 첫 장면의 큰 제목입니다. 숫자 장면에서 튀어나온 글자 수를 셀 때도 씁니다.
export const HEADLINE = ["스크롤을 내리면", "무대가 열려요"];

export const HEADLINE_CHAR_COUNT = HEADLINE.join("").replace(/\s/g, "").length;

// 장면이 화면보다 작으면 가운데에서 붙잡아 위아래 빈칸을 줄이고, 크면 맨 위에서 붙잡아 잘리지 않게 합니다.
export function pinStart(section: HTMLElement) {
  return () => (section.offsetHeight >= window.innerHeight ? "top top" : "center center");
}

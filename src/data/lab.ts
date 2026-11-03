// 애니메이션 실험실 목록입니다. 데모를 늘리면 여기에 한 줄을 더하면 됩니다.

import type { ClayColor } from "@/data/profile";

export type LabDemo = {
  slug: string;
  icon: string;
  title: string;
  summary: string;
  libraries: string[];
  color: ClayColor;
};

export const labDemos: LabDemo[] = [
  {
    slug: "motion",
    icon: "🫧",
    title: "말랑한 레이아웃",
    summary: "카드를 끌고 섞고 펼쳐 보세요. 스크롤에 맞춰 차오르는 CSS 효과와 화면 전환도 함께 담았어요.",
    libraries: ["Motion", "스크롤 연동 CSS", "View Transitions"],
    color: "lilac",
  },
  {
    slug: "gsap",
    icon: "🎬",
    title: "스크롤 무대",
    summary: "부드럽게 미끄러지는 스크롤 위에서 글자가 한 자씩 튀어나오고, 장면이 스크롤에 맞춰 바뀌어요.",
    libraries: ["GSAP", "ScrollTrigger", "SplitText", "Lenis"],
    color: "peach",
  },
  {
    slug: "characters",
    icon: "🐣",
    title: "움직이는 캐릭터",
    summary: "누르고 고르면 반응하는 Rive 캐릭터와, 가볍게 반복 재생되는 Lottie Done Buddy를 만나 보세요.",
    libraries: ["Rive", "Lottie"],
    color: "mint",
  },
  {
    slug: "three",
    icon: "🧪",
    title: "3D 점토 놀이터",
    summary: "셰이더로 일렁이는 점토 덩어리와, 떨어지고 부딪히는 점토 공을 손으로 만져 보세요.",
    libraries: ["three.js", "React Three Fiber", "셰이더", "Rapier 물리"],
    color: "sky",
  },
];

export function labDemo(slug: string): LabDemo {
  const demo = labDemos.find((item) => item.slug === slug);
  if (!demo) {
    throw new Error(`Unknown lab demo: ${slug}`);
  }
  return demo;
}

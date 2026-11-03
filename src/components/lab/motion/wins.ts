import type { ClayColor } from "@/data/profile";

export type Win = {
  id: string;
  icon: string;
  title: string;
  color: ClayColor;
};

// 데모에 쓰는 '오늘의 작은 성취' 카드들입니다.
export const wins: Win[] = [
  { id: "water", icon: "💧", title: "물 두 잔 마시기", color: "sky" },
  { id: "walk", icon: "🚶", title: "점심에 10분 걷기", color: "mint" },
  { id: "book", icon: "📖", title: "책 다섯 쪽 읽기", color: "butter" },
  { id: "code", icon: "💻", title: "커밋 하나 남기기", color: "lilac" },
  { id: "call", icon: "📞", title: "부모님께 전화", color: "peach" },
  { id: "sleep", icon: "🌙", title: "자정 전에 눕기", color: "rose" },
];

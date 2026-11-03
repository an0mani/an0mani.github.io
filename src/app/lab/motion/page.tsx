import type { Metadata } from "next";
import LabHeader from "@/components/lab/LabHeader";
import DemoBlock from "@/components/lab/motion/DemoBlock";
import DragBalls from "@/components/lab/motion/DragBalls";
import LayoutCards from "@/components/lab/motion/LayoutCards";
import ModernCss from "@/components/lab/motion/ModernCss";
import ReorderWins from "@/components/lab/motion/ReorderWins";
import ViewTransitionShuffle from "@/components/lab/motion/ViewTransitionShuffle";
import { labDemo } from "@/data/lab";
import { profile } from "@/data/profile";

const demo = labDemo("motion");

export const metadata: Metadata = {
  title: `${demo.title} | 애니메이션 실험실 | ${profile.name}`,
  description: demo.summary,
  alternates: {
    canonical: "/lab/motion",
  },
};

export default function LabMotionPage() {
  return (
    <main className="flex-1 pb-24">
      <LabHeader slug="motion" />
      <div className="mx-auto mt-12 flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6">
        <DemoBlock
          title="레이아웃이 바뀌어도 말랑하게"
          tag="Motion · layout"
          note="보기 방식을 바꾸면 카드가 새 자리로 미끄러지고, 카드를 누르면 같은 카드가 크게 펼쳐져요."
        >
          <LayoutCards />
        </DemoBlock>
        <div className="grid gap-8 lg:grid-cols-2">
          <DemoBlock
            title="끌어서 순서 바꾸기"
            tag="Motion · Reorder"
            note="오른쪽 손잡이를 잡고 위아래로 옮기면 나머지가 자리를 비켜 줘요."
          >
            <ReorderWins />
          </DemoBlock>
          <DemoBlock
            title="던지고 튕기기"
            tag="Motion · drag"
            note="점토 공을 잡아 던져 보세요. 상자 벽에 닿으면 튕겨 나와요."
          >
            <DragBalls />
          </DemoBlock>
        </div>
        <DemoBlock
          title="브라우저가 이어 주는 화면 전환"
          tag="View Transitions"
          note="위의 Motion 카드와 같은 '섞기'를 브라우저 기능으로 했어요. 실험실 카드에서 이 페이지로 넘어올 때 아이콘과 제목이 커진 것도 같은 기능이에요."
        >
          <ViewTransitionShuffle />
        </DemoBlock>
        <DemoBlock
          title="자바스크립트 없는 CSS 움직임"
          tag="스크롤 연동 CSS"
          note="맨 위 막대와 아래 카드는 스크롤 위치만 보고 CSS가 움직여요. 버튼은 linear() 스프링과 @starting-style을 써요."
        >
          <ModernCss />
        </DemoBlock>
      </div>
    </main>
  );
}

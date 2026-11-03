"use client";

import { useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { useWebGL2 } from "@/lib/webgl";

type ThreeStageProps = {
  /** 무대 높이 같은 크기 클래스 */
  className: string;
  /** WebGL 2를 못 쓸 때 대신 보여 줄 CSS 점토 그림 */
  fallback: ReactNode;
  children: ReactNode;
};

// 3D 캔버스가 놓이는 점토 무대입니다. 화면 가까이 왔을 때 3D를 불러오고, WebGL 2가 없으면 CSS 그림과 안내를 보여 줍니다.
export default function ThreeStage({ className, fallback, children }: ThreeStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const isNear = useInView(stageRef, { once: true, margin: "300px 0px" });
  const canUse3D = useWebGL2();

  return (
    <div ref={stageRef} className={`clay relative overflow-hidden bg-white/60 ${className}`}>
      {canUse3D === false ? (
        <>
          {fallback}
          <p className="absolute inset-x-4 bottom-4 text-center text-sm text-muted">
            이 브라우저에서는 WebGL 2를 쓸 수 없어서 3D 대신 그림으로 보여 드려요.
          </p>
        </>
      ) : (
        canUse3D && isNear && children
      )}
    </div>
  );
}

// 3D 코드를 내려받는 동안 무대 가운데에 보여 줄 글자입니다.
export function StageLoading() {
  return (
    <p className="absolute inset-0 grid place-items-center font-display text-lg text-muted">점토 빚는 중…</p>
  );
}

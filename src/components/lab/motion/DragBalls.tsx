"use client";

import { motion } from "motion/react";
import { useRef, useState, type CSSProperties } from "react";

const balls = [
  { id: "butter", tone: "#ffe27a", toneDark: "#e0b43c", size: "size-16", left: "8%", top: "12%" },
  { id: "peach", tone: "#ffb59c", toneDark: "#e0785a", size: "size-20", left: "38%", top: "40%" },
  { id: "mint", tone: "#8fe3bf", toneDark: "#4fb78d", size: "size-14", left: "70%", top: "14%" },
  { id: "sky", tone: "#9ccdff", toneDark: "#5a93d6", size: "size-24", left: "62%", top: "52%" },
  { id: "rose", tone: "#ffa3c6", toneDark: "#e06a98", size: "size-12", left: "18%", top: "60%" },
];

// 점토 공을 던지면 상자 벽에 부딪혀 튕기고, 끌면 살짝 눌려 커집니다.
export default function DragBalls() {
  const boxRef = useRef<HTMLDivElement>(null);
  const [snapBack, setSnapBack] = useState(false);

  return (
    <div>
      <div ref={boxRef} className="clay-pressed relative h-72 overflow-hidden bg-white/40 sm:h-80">
        {balls.map((ball) => (
          <motion.div
            key={ball.id}
            drag
            dragConstraints={boxRef}
            dragElastic={0.25}
            dragSnapToOrigin={snapBack}
            dragTransition={{ bounceStiffness: 420, bounceDamping: 11, power: 0.35 }}
            whileDrag={{ scale: 1.18, scaleY: 1.08 }}
            whileTap={{ scaleX: 1.12, scaleY: 0.9 }}
            style={
              {
                "--tone": ball.tone,
                "--tone-dark": ball.toneDark,
                left: ball.left,
                top: ball.top,
              } as CSSProperties
            }
            className={`clay-ball absolute cursor-grab active:cursor-grabbing ${ball.size}`}
            aria-hidden
          />
        ))}
      </div>
      <label className="mt-4 inline-flex cursor-pointer items-center gap-3 font-display text-ink">
        <input
          type="checkbox"
          checked={snapBack}
          onChange={(event) => setSnapBack(event.target.checked)}
          className="size-5 accent-[#8a6cff]"
        />
        놓으면 제자리로 돌아오기
      </label>
    </div>
  );
}

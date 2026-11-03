"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, type CSSProperties, type ReactNode } from "react";
import { SQUISH_SPRING } from "@/components/ClayButton";

type ShapeKind = "ball" | "ring" | "pill";

type Shape = {
  id: string;
  kind: ShapeKind;
  tone: string;
  toneDark: string;
  depth: number;
  className: string;
};

const shapes: Shape[] = [
  { id: "butter", kind: "ball", tone: "#ffe27a", toneDark: "#e0b43c", depth: 26, className: "left-[8%] top-[10%] size-16 sm:size-20" },
  { id: "peach", kind: "ring", tone: "#ffb59c", toneDark: "#e0785a", depth: 18, className: "right-[6%] top-[4%] size-24 sm:size-28" },
  { id: "mint", kind: "pill", tone: "#8fe3bf", toneDark: "#4fb78d", depth: 34, className: "left-[4%] bottom-[18%] h-14 w-28 sm:h-16 sm:w-32" },
  { id: "sky", kind: "ball", tone: "#9ccdff", toneDark: "#5a93d6", depth: 22, className: "right-[10%] bottom-[14%] size-20 sm:size-24" },
  { id: "rose", kind: "ball", tone: "#ffa3c6", toneDark: "#e06a98", depth: 40, className: "right-[34%] top-[2%] size-10 sm:size-12" },
];

const PARALLAX_SPRING = { stiffness: 80, damping: 20 };

function shapeStyle(shape: Shape): CSSProperties {
  return {
    "--tone": shape.tone,
    "--tone-dark": shape.toneDark,
  } as CSSProperties;
}

type ParallaxProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  depth: number;
  className: string;
  children: ReactNode;
};

// 마우스 위치에 따라 깊이만큼 움직여서 입체감을 만듭니다.
function Parallax({ pointerX, pointerY, depth, className, children }: ParallaxProps) {
  const x = useSpring(useTransform(pointerX, [-1, 1], [-depth, depth]), PARALLAX_SPRING);
  const y = useSpring(useTransform(pointerY, [-1, 1], [-depth, depth]), PARALLAX_SPRING);

  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      {children}
    </motion.div>
  );
}

type EyeProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

// 커서를 따라 눈동자가 움직입니다.
function Eye({ pointerX, pointerY }: EyeProps) {
  const x = useSpring(useTransform(pointerX, [-1, 1], [-7, 7]), SQUISH_SPRING);
  const y = useSpring(useTransform(pointerY, [-1, 1], [-6, 6]), SQUISH_SPRING);

  return (
    <span className="grid size-9 place-items-center rounded-full bg-white shadow-[inset_0_-3px_0_rgb(0_0_0/0.08)] sm:size-11">
      <motion.span
        style={{ x, y }}
        animate={{ scaleY: [1, 0.1, 1] }}
        transition={{ scaleY: { duration: 0.25, repeat: Infinity, repeatDelay: 3.4 } }}
        className="size-4 rounded-full bg-ink sm:size-5"
      />
    </span>
  );
}

export default function ClayPlayground() {
  const reduced = useReducedMotion();
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);

  useEffect(() => {
    if (reduced) {
      return;
    }

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1);
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1);
    };

    window.addEventListener("pointermove", handlePointerMove);

    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [pointerX, pointerY, reduced]);

  return (
    <div className="relative h-80 select-none sm:h-[26rem] lg:h-[32rem]">
      <div
        className="absolute inset-x-[18%] bottom-10 h-10 rounded-full bg-[#6b4fd6]/20 blur-2xl"
        aria-hidden
      />

      {shapes.map((shape, index) => (
        <Parallax
          key={shape.id}
          pointerX={pointerX}
          pointerY={pointerY}
          depth={shape.depth}
          className={shape.className}
        >
          <motion.div
            drag
            dragSnapToOrigin
            dragElastic={0.6}
            dragTransition={{ bounceStiffness: 300, bounceDamping: 12 }}
            initial={{ scale: 0, rotate: -30 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.4 + index * 0.08 }}
            whileHover={{ scale: 1.12 }}
            whileTap={{ scaleX: 1.15, scaleY: 0.85 }}
            whileDrag={{ scale: 1.2, rotate: 12 }}
            style={shapeStyle(shape)}
            className={`clay-ball clay-${shape.kind} size-full cursor-grab active:cursor-grabbing`}
          />
        </Parallax>
      ))}

      <Parallax pointerX={pointerX} pointerY={pointerY} depth={10} className="inset-0 m-auto size-52 sm:size-64">
        <motion.div
          drag
          dragSnapToOrigin
          dragElastic={0.5}
          dragTransition={{ bounceStiffness: 260, bounceDamping: 10 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 11, delay: 0.25 }}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scaleX: 1.12, scaleY: 0.88 }}
          whileDrag={{ scale: 1.08, rotate: -6 }}
          style={{ "--tone": "#b9a3ff", "--tone-dark": "#7b5be0" } as CSSProperties}
          className="clay-ball clay-ball-blob flex size-full cursor-grab flex-col items-center justify-center gap-3 active:cursor-grabbing"
          role="img"
          aria-label="Done Buddy"
        >
          <span className="flex gap-6 sm:gap-8">
            <Eye pointerX={pointerX} pointerY={pointerY} />
            <Eye pointerX={pointerX} pointerY={pointerY} />
          </span>
          <span className="flex items-center gap-10 sm:gap-14">
            <span className="size-4 rounded-full bg-rose/80" />
            <span className="h-4 w-10 rounded-b-full bg-ink sm:h-5 sm:w-12" />
            <span className="size-4 rounded-full bg-rose/80" />
          </span>
        </motion.div>
      </Parallax>

      <p className="pointer-events-none absolute inset-x-0 bottom-0 text-center text-sm text-muted">
        끌어서 던져 보세요
      </p>
    </div>
  );
}

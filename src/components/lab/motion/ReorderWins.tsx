"use client";

import { Reorder, useDragControls } from "motion/react";
import { useState } from "react";
import { SQUISH_SPRING } from "@/components/ClayButton";
import { surfaceClass } from "@/data/profile";
import { wins, type Win } from "./wins";

type RowProps = {
  win: Win;
  rank: number;
};

// 손잡이를 잡았을 때만 끌리게 해서, 휴대폰에서 목록을 스크롤하다가 잘못 끌리지 않게 합니다.
function Row({ win, rank }: RowProps) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={win}
      dragListener={false}
      dragControls={controls}
      transition={SQUISH_SPRING}
      whileDrag={{ scale: 1.04, rotate: -1.5 }}
      className={`clay-sm flex items-center gap-3 p-3 ${surfaceClass[win.color]}`}
    >
      <span className="w-6 text-center font-display text-lg text-ink">{rank}</span>
      <span className="text-xl" aria-hidden>
        {win.icon}
      </span>
      <span className="flex-1 font-display text-ink">{win.title}</span>
      <button
        type="button"
        aria-label={`${win.title} 순서 옮기기`}
        onPointerDown={(event) => controls.start(event)}
        className="clay-pressed grid size-10 cursor-grab touch-none place-items-center bg-white/60 text-ink active:cursor-grabbing"
      >
        ⠿
      </button>
    </Reorder.Item>
  );
}

// Reorder로 끌어서 순서를 바꾸면 나머지 카드가 자리를 비켜 줍니다.
export default function ReorderWins() {
  const [items, setItems] = useState(wins.slice(0, 5));

  return (
    <Reorder.Group axis="y" values={items} onReorder={setItems} className="flex flex-col gap-3">
      {items.map((win, index) => (
        <Row key={win.id} win={win} rank={index + 1} />
      ))}
    </Reorder.Group>
  );
}

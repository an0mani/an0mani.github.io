import type { ReactNode } from "react";

type DemoBlockProps = {
  title: string;
  tag: string;
  note: string;
  children: ReactNode;
};

// 데모 하나를 감싸는 카드. 무엇을 쓰는지(tag)와 한 줄 설명(note)을 함께 보여 줍니다.
export default function DemoBlock({ title, tag, note, children }: DemoBlockProps) {
  return (
    <section className="clay bg-white/70 p-6 sm:p-8">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">{title}</h2>
        <span className="clay-pressed bg-white/50 px-3 py-1 text-sm font-medium text-ink">{tag}</span>
      </div>
      <p className="mt-2 leading-relaxed text-muted">{note}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}

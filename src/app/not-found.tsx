import type { Metadata } from "next";
import type { CSSProperties } from "react";
import ClayButton from "@/components/ClayButton";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요 | an0mani",
};

// 없는 주소로 들어왔을 때 보여 주는 화면 (GitHub Pages가 404.html로 씁니다.)
export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-4 py-20 text-center">
      <div
        style={{ "--tone": "#b9a3ff", "--tone-dark": "#7b5be0" } as CSSProperties}
        className="clay-ball clay-ball-blob mb-4 flex size-36 flex-col items-center justify-center gap-4"
        aria-hidden
      >
        <span className="flex gap-6">
          <span className="size-4 rounded-full bg-ink" />
          <span className="size-4 rounded-full bg-ink" />
        </span>
        <span className="h-1.5 w-8 rounded-full bg-ink" />
      </div>
      <p className="clay-sm bg-butter px-4 py-2 font-display text-ink">404</p>
      <h1 className="font-display text-4xl text-ink sm:text-5xl">페이지를 찾을 수 없어요</h1>
      <p className="max-w-md text-lg leading-relaxed text-muted">
        주소가 바뀌었거나 없는 페이지예요. 첫 화면에서 다시 둘러봐 주세요.
      </p>
      <ClayButton href="/">첫 화면으로 →</ClayButton>
    </main>
  );
}

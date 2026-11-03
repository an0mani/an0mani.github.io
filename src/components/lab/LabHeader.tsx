import Link from "next/link";
import { ViewTransition } from "react";
import { surfaceClass } from "@/data/profile";
import { labDemo } from "@/data/lab";

type LabHeaderProps = {
  slug: string;
};

// 데모 페이지 맨 위. 실험실 카드의 아이콘·제목과 같은 이름을 붙여서 화면 전환 때 카드가 이어지듯 커집니다.
export default function LabHeader({ slug }: LabHeaderProps) {
  const demo = labDemo(slug);

  return (
    <header className="mx-auto w-full max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
      <Link
        href="/lab"
        className="clay-sm inline-flex items-center gap-2 bg-white/70 px-4 py-2 font-display text-ink"
      >
        ← 실험실
      </Link>
      <div className="mt-8 flex items-center gap-4">
        <ViewTransition name={`lab-icon-${demo.slug}`}>
          <span
            className={`clay grid size-16 shrink-0 place-items-center text-3xl ${surfaceClass[demo.color]}`}
            aria-hidden
          >
            {demo.icon}
          </span>
        </ViewTransition>
        <ViewTransition name={`lab-title-${demo.slug}`}>
          <h1 className="font-display text-4xl text-ink sm:text-5xl">{demo.title}</h1>
        </ViewTransition>
      </div>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">{demo.summary}</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="사용한 라이브러리">
        {demo.libraries.map((library) => (
          <li key={library} className="clay-pressed bg-white/50 px-3 py-1 text-sm font-medium text-ink">
            {library}
          </li>
        ))}
      </ul>
    </header>
  );
}

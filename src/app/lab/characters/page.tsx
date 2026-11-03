import type { Metadata } from "next";
import LabHeader from "@/components/lab/LabHeader";
import { LottieBuddy, RiveAvatars, RiveRating } from "@/components/lab/characters/LazyCharacters";
import { labDemo } from "@/data/lab";
import { profile } from "@/data/profile";

const demo = labDemo("characters");

export const metadata: Metadata = {
  title: `${demo.title} | 애니메이션 실험실 | ${profile.name}`,
  description: demo.summary,
  alternates: {
    canonical: "/lab/characters",
  },
};

const comparison = [
  {
    name: "Rive",
    color: "bg-butter",
    points: [
      "Rive 에디터에서 그림과 상태 머신을 함께 만들어요.",
      "누르기, 마우스 올리기, 입력값에 따라 스스로 상태를 바꿔요.",
      ".riv 바이너리라 작아요. 아바타 셋이 든 파일이 15KB예요.",
      "대신 처음 한 번 WASM 런타임을 받아요. Flutter 앱에도 같은 파일을 그대로 써요.",
    ],
  },
  {
    name: "Lottie",
    color: "bg-sky",
    points: [
      "보통 After Effects에서 만들고 Bodymovin으로 JSON을 내보내요.",
      "정해진 타임라인을 재생, 멈춤, 속도, 구간 재생으로 다뤄요.",
      "JSON이라 코드로도 만들 수 있어요. 이 Done Buddy가 9KB예요.",
      "누를 때마다 다르게 반응하는 일은 바깥 코드가 맡아요.",
    ],
  },
];

// Lottie 파일 구성. 스크립트를 고치면 여기도 같이 맞춰 주세요.
const buddyParts = [
  "60fps, 0~120프레임은 기본 반복, 120~180프레임은 누르면 나오는 높은 점프예요.",
  "몸통은 방사형 그라디언트로 칠한 점토 덩어리, 그 위에 반짝이·눈·볼·입이 얹혀 있어요.",
  "몸은 발끝을 기준으로 찌그러지고 늘어나요. 바닥 그림자는 높이 뜰수록 작고 옅어져요.",
  "점프할 때는 눈이 ^ ^ 모양으로 바뀌고 몸이 좌우로 살짝 기울어요.",
];

export default function LabCharactersPage() {
  return (
    <main className="flex-1 pb-24">
      <LabHeader slug="characters" />

      <section aria-labelledby="rive-title" className="mx-auto mt-16 w-full max-w-5xl px-4 sm:px-6">
        <p className="font-display text-lg text-muted">Rive</p>
        <h2 id="rive-title" className="font-display text-3xl text-ink sm:text-4xl">
          누르면 반응하는 캐릭터
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          Rive 파일은 Rive 에디터에서 그리고, 상태 머신으로 포인터 입력에 반응하게 만들어요. 아래 둘은 공식
          예제 파일이고, 진짜 Done Buddy를 Rive로 움직이려면 에디터에서 새로 그려야 해요.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <article className="clay bg-mint p-5 sm:p-6">
            <h3 className="font-display text-2xl text-ink">별점 매기기</h3>
            <p className="mt-1 mb-5 text-ink/80">별을 누르면 상태 머신이 별을 채우고 이벤트를 보내요.</p>
            <RiveRating />
          </article>
          <article className="clay bg-lilac p-5 sm:p-6">
            <h3 className="font-display text-2xl text-ink">기분 바꾸는 아바타</h3>
            <p className="mt-1 mb-5 text-ink/80">아트보드 셋과 isHappy, isSad 입력을 바꿔 가며 움직여요.</p>
            <RiveAvatars />
          </article>
        </div>

        <p className="mt-6 text-sm text-muted">
          예제 파일:{" "}
          <a
            href="https://github.com/rive-app/rive-react"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-ink underline underline-offset-4"
          >
            Rive 공식 예제 파일(MIT)
          </a>{" "}
          · rating.riv, avatars.riv
        </p>
      </section>

      <section aria-labelledby="lottie-title" className="mx-auto mt-20 w-full max-w-5xl px-4 sm:px-6">
        <p className="font-display text-lg text-muted">Lottie</p>
        <h2 id="lottie-title" className="font-display text-3xl text-ink sm:text-4xl">
          통통 튀는 Done Buddy
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted">
          After Effects 대신 작은 Node 스크립트로 키프레임을 직접 적어 만든 Lottie예요. 2초 동안 찌그러졌다
          늘어나며 튀고, 착지한 뒤 한 번 눈을 깜빡여요.
        </p>

        <div className="clay mt-8 grid items-center gap-8 bg-peach p-5 sm:p-8 md:grid-cols-2">
          <LottieBuddy />
          <div>
            <h3 className="font-display text-2xl text-ink">JSON 안에 든 것</h3>
            <ul className="mt-4 space-y-2">
              {buddyParts.map((part) => (
                <li key={part} className="flex gap-2 leading-relaxed text-ink/85">
                  <span aria-hidden>•</span>
                  {part}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              만드는 스크립트:{" "}
              <code className="rounded-md bg-white/70 px-1.5 py-0.5 break-all text-ink">
                scripts/make-done-buddy-lottie.mjs
              </code>
            </p>
          </div>
        </div>
      </section>

      <section aria-labelledby="compare-title" className="mx-auto mt-20 w-full max-w-5xl px-4 sm:px-6">
        <p className="font-display text-lg text-muted">Rive vs Lottie</p>
        <h2 id="compare-title" className="font-display text-3xl text-ink sm:text-4xl">
          언제 무엇을 쓸까
        </h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {comparison.map((item) => (
            <article key={item.name} className={`clay p-6 ${item.color}`}>
              <h3 className="font-display text-2xl text-ink">{item.name}</h3>
              <ul className="mt-4 space-y-2">
                {item.points.map((point) => (
                  <li key={point} className="flex gap-2 leading-relaxed text-ink/85">
                    <span aria-hidden>•</span>
                    {point}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-2xl leading-relaxed text-muted">
          버튼 하나에 여러 표정이 오가는 캐릭터라면 Rive, 정해진 장면을 가볍게 반복하는 일러스트라면 Lottie가
          편해요.
        </p>
      </section>
    </main>
  );
}

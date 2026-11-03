type StageNoticeProps = {
  kind: "loading" | "error";
  className?: string;
};

// 캐릭터를 불러오는 동안, 또는 불러오지 못했을 때 무대 자리에 대신 보여 주는 점토 판입니다.
export default function StageNotice({ kind, className = "" }: StageNoticeProps) {
  if (kind === "error") {
    return (
      <div
        role="alert"
        className={`clay-pressed grid place-items-center bg-white/50 p-6 text-center text-ink ${className}`}
      >
        <p>
          <span className="block text-3xl" aria-hidden>
            🫠
          </span>
          <span className="mt-2 block font-display text-lg">캐릭터를 불러오지 못했어요</span>
          <span className="mt-1 block text-sm text-muted">잠시 뒤에 새로고침해 주세요.</span>
        </p>
      </div>
    );
  }

  return (
    <div className={`clay-pressed grid place-items-center bg-white/50 ${className}`}>
      <p className="font-display text-muted motion-safe:animate-pulse">캐릭터를 부르는 중이에요…</p>
    </div>
  );
}

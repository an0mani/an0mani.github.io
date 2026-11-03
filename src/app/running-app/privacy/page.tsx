import type { Metadata } from "next";
import ClayButton from "@/components/ClayButton";
import { profile } from "@/data/profile";
import { runningAppPrivacy } from "@/data/runningAppPrivacy";

const title = `${runningAppPrivacy.appName} 개인정보처리방침 | ${profile.name}`;

export const metadata: Metadata = {
  title,
  description: runningAppPrivacy.summary,
  alternates: {
    canonical: "/running-app/privacy",
  },
};

// 앱의 헬스 커넥트 권한 화면과 Play 스토어 등록에 쓰는 공개 방침 페이지입니다.
export default function RunningAppPrivacy() {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-display text-lg text-muted">Privacy</p>
      <h1 className="font-display text-4xl text-ink sm:text-5xl">
        {runningAppPrivacy.appName} 개인정보처리방침
      </h1>
      <p className="mt-3 text-sm text-muted">시행일: {runningAppPrivacy.effectiveDate}</p>

      <p className="clay mt-8 bg-mint p-6 text-lg leading-relaxed text-ink sm:p-8">
        {runningAppPrivacy.summary}
      </p>

      <div className="mt-10 flex flex-col gap-6">
        {runningAppPrivacy.sections.map((section) => (
          <section key={section.title} className="clay-sm bg-white/70 p-6 sm:p-8">
            <h2 className="font-display text-2xl text-ink">{section.title}</h2>
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-ink">
                {paragraph}
              </p>
            ))}
            {section.items && (
              <ul className="mt-3 flex list-disc flex-col gap-2 pl-5 leading-relaxed text-ink">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <section className="clay-sm bg-white/70 p-6 sm:p-8">
          <h2 className="font-display text-2xl text-ink">7. 문의</h2>
          <p className="mt-3 leading-relaxed text-ink">
            개발자: {profile.name}. 개인정보 처리에 대한 문의는 아래 GitHub 프로필로 연락해 주세요.
          </p>
          <div className="mt-5">
            <ClayButton href={profile.github} variant="plain" external>
              GitHub로 문의하기 →
            </ClayButton>
          </div>
        </section>
      </div>
    </main>
  );
}

// 사이트에 보이는 글은 모두 이 파일에서 고치면 됩니다.

export type ClayColor = "lilac" | "peach" | "mint" | "sky" | "butter" | "rose";

export type Project = {
  step?: string;
  icon: string;
  title: string;
  summary: string;
  status: string;
  color: ClayColor;
  tags: string[];
  details: string[];
};

export type SkillGroup = {
  icon: string;
  label: string;
  note: string;
  color: ClayColor;
  skills: string[];
};

export const profile = {
  name: "an0mani",
  role: "Laravel 개발자 · Flutter 메이커",
  headline: ["작은 성취를", "쌓아 올리는", "개발자"],
  intro:
    "회사에서는 Laravel로 서비스를 만들고, 퇴근 후에는 Flutter로 작은 앱을 만듭니다. 요즘은 TypeScript와 Next.js로 웹까지 넓혀 가는 중입니다.",
  github: "https://github.com/an0mani",
};

export const skillGroups: SkillGroup[] = [
  {
    icon: "🏢",
    label: "회사에서",
    note: "실무에서 매일 쓰는 백엔드",
    color: "lilac",
    skills: ["Laravel", "PHP"],
  },
  {
    icon: "📱",
    label: "취미로",
    note: "퇴근 후 앱을 만드는 도구",
    color: "mint",
    skills: ["Flutter", "Dart", "Rive", "Drift"],
  },
  {
    icon: "🌱",
    label: "배우는 중",
    note: "이 사이트로 연습하고 있어요",
    color: "peach",
    skills: ["TypeScript", "Next.js", "Supabase"],
  },
  {
    icon: "🖥️",
    label: "홈랩",
    note: "남는 PC로 꾸리는 서버",
    color: "sky",
    skills: ["Docker", "WSL2", "Cloudflare", "Tailscale"],
  },
  {
    icon: "🚀",
    label: "다음 목표",
    note: "실서비스 하나 배포한 뒤",
    color: "butter",
    skills: ["Rust"],
  },
];

export const projects: Project[] = [
  {
    step: "STEP 01",
    icon: "✅",
    title: "Done It",
    summary: "오늘 해낸 소소한 일을 기록하고 칭찬받는 앱입니다.",
    status: "진행 중",
    color: "mint",
    tags: ["Flutter", "Rive", "Drift"],
    details: [
      "Done Buddy 캐릭터가 Rive 애니메이션으로 반응합니다.",
      "로컬 DB를 Hive에서 Drift로 옮겼습니다.",
      "Supabase 전환 여부를 검토하고 있습니다.",
    ],
  },
  {
    step: "STEP 02",
    icon: "🧭",
    title: "멀티활동 트래커",
    summary: "Done It에 기본 GPS 기록을 더해 활동까지 남깁니다.",
    status: "계획",
    color: "sky",
    tags: ["Flutter", "GPS"],
    details: [
      "Done It 위에 위치 기록 기능을 얹는 단계입니다.",
      "러닝 앱으로 가기 전 GPS 다루는 법을 익힙니다.",
    ],
  },
  {
    step: "STEP 03",
    icon: "🏃",
    title: "러닝 코스 공유 앱",
    summary: "OpenStreetMap 기반으로 코스를 나누고 함께 달리는 앱입니다.",
    status: "설계 완료",
    color: "peach",
    tags: ["Flutter", "OpenStreetMap", "Supabase"],
    details: [
      "코스 공유, 턴바이턴 내비게이션, SNS 기능을 담습니다.",
      "Supabase 스키마 설계를 마쳤습니다.",
    ],
  },
  {
    icon: "🛠️",
    title: "개인 AI 개발팀 서버",
    summary: "남는 PC를 24시간 돌려 AI 에이전트들과 함께 개발하는 홈서버입니다.",
    status: "구축 예정",
    color: "lilac",
    tags: ["Docker", "Cloudflare Tunnel", "Tailscale"],
    details: [
      "DEV/PROD 환경을 Docker로 분리합니다.",
      "외부 접속은 Cloudflare Tunnel과 Tailscale을 검토하고 있습니다.",
      "8단계로 나눠 차근차근 구축합니다.",
    ],
  },
  {
    icon: "🌐",
    title: "이 포트폴리오",
    summary: "Next.js와 TypeScript를 연습하며 만든 첫 웹 페이지입니다.",
    status: "운영 중",
    color: "rose",
    tags: ["Next.js", "TypeScript", "Tailwind", "Flutter Web"],
    details: [
      "클레이모피즘 스타일에 마이크로 인터랙션을 더했습니다.",
      "Done It 미니 데모는 Flutter로 만들어 웹으로 빌드했습니다.",
      "GitHub Actions로 GitHub Pages에 자동 배포됩니다.",
    ],
  },
];

export const surfaceClass: Record<ClayColor, string> = {
  lilac: "bg-lilac",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  butter: "bg-butter",
  rose: "bg-rose",
};

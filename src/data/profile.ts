// 사이트에 보이는 글은 모두 이 파일에서 고치면 됩니다.

export type ClayColor = "lilac" | "peach" | "mint" | "sky" | "butter" | "rose";

export type Project = {
  step?: string;
  /** 넓은 칸을 차지하는 대표 프로젝트 */
  featured?: boolean;
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
  site: "https://an0mani.github.io",
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
    skills: ["TypeScript", "Next.js", "three.js"],
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
    featured: true,
    icon: "✅",
    title: "Done It",
    summary: "오늘 해낸 소소한 일을 기록하고, Done Buddy와 함께 자라는 앱입니다. 지친 날에도 부담 없이 남길 수 있게 만들었어요.",
    status: "출시 준비 중",
    color: "mint",
    tags: ["Flutter", "Riverpod", "Drift", "RevenueCat", "Google Drive"],
    details: [
      "클레이모피즘과 말랑한 눌림 인터랙션으로 디자인을 새로 입혔습니다.",
      "기록은 폰 안(Drift)에 두고, 구글 드라이브 앱 전용 폴더로 백업해 폰을 바꿔도 이어 씁니다.",
      "프리미엄(월 구독·평생 이용권): 30일 인사이트, 올해의 작은 성취, 앱 잠금, 자동 백업.",
      "테스트 119개와 GitHub Actions로 Android 빌드까지 자동 검증합니다.",
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
    tags: ["Next.js", "TypeScript", "three.js", "Motion", "Flutter Web"],
    details: [
      "첫 화면의 3D 점토 장면은 three.js(React Three Fiber), UI 움직임은 Motion으로 만들었습니다.",
      "Done It 미니 데모는 Flutter로 만들어 웹으로 빌드했습니다.",
      "GitHub Actions로 GitHub Pages에 자동 배포됩니다.",
    ],
  },
];

/** Done It 실제 앱 화면 (public/screens) */
export const appScreens = [
  { src: "/screens/doneit-home.png", label: "홈" },
  { src: "/screens/doneit-stats.png", label: "통계" },
  { src: "/screens/doneit-year.png", label: "올해의 작은 성취" },
  { src: "/screens/doneit-paywall.png", label: "프리미엄" },
  { src: "/screens/doneit-dark.png", label: "다크 모드" },
];

export const surfaceClass: Record<ClayColor, string> = {
  lilac: "bg-lilac",
  peach: "bg-peach",
  mint: "bg-mint",
  sky: "bg-sky",
  butter: "bg-butter",
  rose: "bg-rose",
};

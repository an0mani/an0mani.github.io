import type { MetadataRoute } from "next";
import { labDemos } from "@/data/lab";
import { profile } from "@/data/profile";

// 정적 export(GitHub Pages)에서는 빌드할 때 파일로 만들어 둡니다.
export const dynamic = "force-static";

// 첫 화면, 애니메이션 실험실, 앱 개인정보처리방침 페이지를 넣습니다.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${profile.site}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${profile.site}/lab`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    ...labDemos.map((demo) => ({
      url: `${profile.site}/lab/${demo.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    {
      url: `${profile.site}/running-app/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

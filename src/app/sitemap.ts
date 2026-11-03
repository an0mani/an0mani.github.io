import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

// 정적 export(GitHub Pages)에서는 빌드할 때 파일로 만들어 둡니다.
export const dynamic = "force-static";

// 첫 화면과 앱 개인정보처리방침 페이지를 넣습니다.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${profile.site}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${profile.site}/running-app/privacy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

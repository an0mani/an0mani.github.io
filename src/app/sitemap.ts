import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

// 정적 export(GitHub Pages)에서는 빌드할 때 파일로 만들어 둡니다.
export const dynamic = "force-static";

// 한 페이지짜리 사이트라서 첫 화면 주소 하나만 넣습니다.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${profile.site}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

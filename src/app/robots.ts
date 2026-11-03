import type { MetadataRoute } from "next";
import { profile } from "@/data/profile";

// 정적 export(GitHub Pages)에서는 빌드할 때 파일로 만들어 둡니다.
export const dynamic = "force-static";

// 검색 엔진에 모든 페이지를 열어 두고 사이트맵 위치를 알려 줍니다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${profile.site}/sitemap.xml`,
  };
}

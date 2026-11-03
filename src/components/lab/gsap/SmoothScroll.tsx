"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, MOTION_OK, ScrollTrigger, useGSAP } from "@/components/lab/gsap/stage";

// 이 페이지에서만 Lenis로 스크롤을 부드럽게 미끄러뜨립니다. 화면에는 아무것도 그리지 않아요.
export default function SmoothScroll() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MOTION_OK, () => {
      const root = document.documentElement;
      // 사이트 전체에 켜 둔 scroll-behavior: smooth가 Lenis와 겹치면 스크롤이 굼떠져서, 이 페이지에 있는 동안만 끕니다.
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";

      const lenis = new Lenis({ lerp: 0.1 });
      // Lenis가 움직일 때마다 ScrollTrigger도 같은 위치를 보도록 맞춥니다.
      lenis.on("scroll", ScrollTrigger.update);

      const tick = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tick);
      // 프레임이 밀려도 따라잡도록 GSAP의 지연 보정을 잠시 끕니다.
      gsap.ticker.lagSmoothing(0);

      return () => {
        gsap.ticker.remove(tick);
        gsap.ticker.lagSmoothing(500, 33);
        lenis.destroy();
        root.style.scrollBehavior = previousBehavior;
      };
    });
  });

  return null;
}

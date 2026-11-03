"use client";

import { useSyncExternalStore } from "react";

let webglSupport: boolean | undefined;

function supportsWebGL2() {
  if (webglSupport === undefined) {
    try {
      // three.js는 WebGL 2만 쓰므로 WebGL 1만 되는 기기에서는 CSS 점토로 대신합니다.
      const gl = document.createElement("canvas").getContext("webgl2");
      webglSupport = gl !== null;
      // 확인용으로 만든 WebGL 연결은 바로 돌려줍니다.
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      webglSupport = false;
    }
  }
  return webglSupport;
}

const subscribeNothing = () => () => {};

// 3D 장면을 그릴 수 있는지 알려 줍니다. 서버에서 만든 HTML에서는 아직 모르니 null이고, 3D는 브라우저에서만 켜집니다.
export function useWebGL2(): boolean | null {
  return useSyncExternalStore(subscribeNothing, supportsWebGL2, () => null);
}

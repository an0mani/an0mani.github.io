"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Color, MathUtils, ShaderMaterial, Vector3 } from "three";
import {
  blobPalettes,
  clayBlobFragmentShader,
  clayBlobVertexShader,
  type BlobPaletteName,
} from "@/components/lab/three/clayBlobShader";

const targetPointer = new Vector3();
const targetColor = new Color();

type ClayBlobProps = {
  palette: BlobPaletteName;
  amplitude: number;
  playing: boolean;
};

function createUniforms(palette: BlobPaletteName, amplitude: number) {
  const colors = blobPalettes[palette];
  return {
    // 멈춘 상태로 시작해도 밋밋한 공이 아니라 빚어 놓은 모양이 보이도록 0이 아닌 시간에서 시작합니다.
    uTime: { value: 4.2 },
    uAmp: { value: amplitude },
    uHover: { value: 0 },
    uPress: { value: 0 },
    uPointer: { value: new Vector3(0.3, 0.4, 1).normalize() },
    uLight: { value: new Color(colors.light) },
    uBase: { value: new Color(colors.base) },
    uDeep: { value: new Color(colors.deep) },
    uRim: { value: new Color(colors.rim) },
  };
}

// 셰이더로 일렁이는 점토 덩어리: 올리면 그쪽으로 부풀고, 누르면 움푹 들어갔다가 출렁이며 돌아옵니다.
function ClayBlob({ palette, amplitude, playing }: ClayBlobProps) {
  const materialRef = useRef<ShaderMaterial>(null);
  const [uniforms] = useState(() => createUniforms(palette, amplitude));
  const hoveredRef = useRef(false);
  const pressedRef = useRef(false);
  const pressVelocityRef = useRef(0);
  const invalidate = useThree((state) => state.invalidate);

  // 멈춰 있을 때(frameloop="demand")도 색이나 말랑함을 바꾸면 한 번 다시 그립니다.
  useEffect(() => {
    invalidate();
  }, [palette, amplitude, playing, invalidate]);

  useFrame((state, delta) => {
    const material = materialRef.current;
    if (!material) {
      return;
    }

    const u = material.uniforms;
    const step = Math.min(delta, 1 / 30);
    let settling = false;

    if (playing) {
      u.uTime.value += step;
    }

    // 말랑함과 색은 바로 바뀌지 않고 부드럽게 따라갑니다.
    u.uAmp.value = MathUtils.damp(u.uAmp.value, amplitude, 6, step);
    settling ||= Math.abs(u.uAmp.value - amplitude) > 0.001;

    const colors = blobPalettes[palette];
    for (const [key, hex] of [
      ["uLight", colors.light],
      ["uBase", colors.base],
      ["uDeep", colors.deep],
      ["uRim", colors.rim],
    ] as const) {
      const color = u[key].value as Color;
      targetColor.set(hex);
      color.lerp(targetColor, 1 - Math.exp(-8 * step));
      settling ||= Math.abs(color.r - targetColor.r) + Math.abs(color.g - targetColor.g) + Math.abs(color.b - targetColor.b) > 0.002;
    }

    // 덩어리 위에 있지 않을 때도 포인터 쪽으로 천천히 고개를 돌려요.
    if (!hoveredRef.current) {
      targetPointer.set(state.pointer.x * 1.4, state.pointer.y * 1.4, 1).normalize();
    }
    const pointer = u.uPointer.value as Vector3;
    pointer.lerp(targetPointer, 1 - Math.exp(-10 * step)).normalize();

    const hoverTarget = hoveredRef.current ? 1 : 0;
    u.uHover.value = MathUtils.damp(u.uHover.value, hoverTarget, 8, step);
    settling ||= Math.abs(u.uHover.value - hoverTarget) > 0.002;

    // 누름은 스프링으로 계산해서, 손을 떼면 반대로 한 번 더 출렁이다 멈춥니다.
    const pressTarget = pressedRef.current ? 1 : 0;
    const acceleration = (pressTarget - u.uPress.value) * 170 - pressVelocityRef.current * 9;
    pressVelocityRef.current += acceleration * step;
    u.uPress.value += pressVelocityRef.current * step;
    settling ||= Math.abs(u.uPress.value - pressTarget) > 0.002 || Math.abs(pressVelocityRef.current) > 0.01;

    if (!playing && settling) {
      state.invalidate();
    }
  });

  const pointAt = (event: ThreeEvent<PointerEvent>) => {
    targetPointer.copy(event.point).normalize();
    invalidate();
  };

  const release = () => {
    pressedRef.current = false;
    invalidate();
  };

  return (
    <mesh
      onPointerOver={(event) => {
        hoveredRef.current = true;
        pointAt(event);
        document.body.style.cursor = "pointer";
      }}
      onPointerMove={pointAt}
      onPointerOut={() => {
        hoveredRef.current = false;
        document.body.style.cursor = "";
        release();
      }}
      onPointerDown={(event) => {
        pressedRef.current = true;
        pointAt(event);
      }}
      onPointerUp={release}
      onPointerCancel={release}
    >
      <sphereGeometry args={[1, 160, 160]} />
      <shaderMaterial
        ref={materialRef}
        uniforms={uniforms}
        vertexShader={clayBlobVertexShader}
        fragmentShader={clayBlobFragmentShader}
      />
    </mesh>
  );
}

export type ClayBlobCanvasProps = ClayBlobProps;

export default function ClayBlobCanvas({ palette, amplitude, playing }: ClayBlobCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 화면 밖에서는 그리지 않고, 멈춤 상태에서는 무언가 바뀔 때만 그립니다.
  const isInView = useInView(canvasRef);
  const frameloop = !isInView ? "never" : playing ? "always" : "demand";

  return (
    <Canvas
      ref={canvasRef}
      frameloop={frameloop}
      camera={{ position: [0, 0, 4.6], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      // 세로로 쓸어내리면 페이지가 스크롤되도록 두고, 누르기와 올리기만 덩어리가 받습니다.
      style={{ touchAction: "pan-y" }}
      role="img"
      aria-label="셰이더로 일렁이는 파스텔 점토 덩어리"
    >
      <ClayBlob palette={palette} amplitude={amplitude} playing={playing} />
    </Canvas>
  );
}

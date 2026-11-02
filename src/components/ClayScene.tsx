"use client";

import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import { Group, MathUtils, Mesh, Vector3 } from "three";

type ClayShapeProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  size: number;
  distort: number;
  reduced: boolean;
  children: ReactNode;
};

const targetScale = new Vector3();

// 마우스를 올리면 부풀고, 누르면 말랑하게 출렁이는 점토 도형
function ClayShape({
  position,
  rotation = [0, 0, 0],
  color,
  size,
  distort,
  reduced,
  children,
}: ClayShapeProps) {
  const meshRef = useRef<Mesh>(null);
  const squishRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }

    squishRef.current = Math.max(0, squishRef.current - delta * 1.6);
    const wobble = Math.sin(squishRef.current * Math.PI * 4) * squishRef.current * 0.35;
    const base = hovered ? size * 1.12 : size;

    targetScale.set(base * (1 + wobble), base * (1 - wobble), base * (1 + wobble));
    mesh.scale.lerp(targetScale, 0.2);

    if (!reduced) {
      mesh.rotation.y += delta * 0.25;
    }
  });

  return (
    <Float
      speed={reduced ? 0 : 2}
      rotationIntensity={reduced ? 0 : 0.5}
      floatIntensity={reduced ? 0 : 1.2}
    >
      <mesh
        ref={meshRef}
        position={position}
        rotation={rotation}
        scale={size}
        onPointerOver={(event) => {
          event.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "";
        }}
        onClick={(event) => {
          event.stopPropagation();
          squishRef.current = 1;
        }}
      >
        {children}
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={reduced ? 0 : 2}
          roughness={0.6}
          metalness={0}
        />
      </mesh>
    </Float>
  );
}

type RigProps = {
  reduced: boolean;
  children: ReactNode;
};

// 마우스 위치를 따라 장면 전체가 살짝 기울어집니다.
function Rig({ reduced, children }: RigProps) {
  const groupRef = useRef<Group>(null);

  useFrame((state) => {
    const group = groupRef.current;
    if (!group || reduced) {
      return;
    }

    group.rotation.y = MathUtils.lerp(group.rotation.y, state.pointer.x * 0.35, 0.05);
    group.rotation.x = MathUtils.lerp(group.rotation.x, -state.pointer.y * 0.2, 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
}

type ClaySceneProps = {
  reduced: boolean;
};

export default function ClayScene({ reduced }: ClaySceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <hemisphereLight args={["#ffffff", "#c9b8ff", 1.2]} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#ffb8d2" />

      <Rig reduced={reduced}>
        <ClayShape position={[0, 0.1, 0]} color="#b9a3ff" size={1.3} distort={0.35} reduced={reduced}>
          <sphereGeometry args={[1, 64, 64]} />
        </ClayShape>
        <ClayShape
          position={[1.9, 1.3, -0.6]}
          rotation={[0.6, 0.3, 0]}
          color="#ffb59c"
          size={0.75}
          distort={0.12}
          reduced={reduced}
        >
          <torusGeometry args={[0.7, 0.32, 32, 64]} />
        </ClayShape>
        <ClayShape
          position={[-1.9, -1, 0.3]}
          rotation={[0, 0, 0.7]}
          color="#8fe3bf"
          size={0.7}
          distort={0.15}
          reduced={reduced}
        >
          <capsuleGeometry args={[0.45, 0.8, 12, 32]} />
        </ClayShape>
        <ClayShape position={[1.6, -1.4, 0.7]} color="#9ccdff" size={0.45} distort={0.3} reduced={reduced}>
          <sphereGeometry args={[1, 48, 48]} />
        </ClayShape>
        <ClayShape position={[-1.7, 1.5, -0.4]} color="#ffe27a" size={0.4} distort={0.3} reduced={reduced}>
          <sphereGeometry args={[1, 48, 48]} />
        </ClayShape>
      </Rig>
    </Canvas>
  );
}

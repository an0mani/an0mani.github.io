"use client";

import { Float, MeshDistortMaterial } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useState, type ReactNode } from "react";
import { Group, MathUtils, Mesh, Vector3 } from "three";

const targetScale = new Vector3();

type ClayShapeProps = {
  position: [number, number, number];
  rotation?: [number, number, number];
  color: string;
  size: number;
  distort: number;
  reduced: boolean;
  children: ReactNode;
};

// 마우스를 올리면 부풀고, 누르면 말랑하게 출렁이는 점토 도형
function ClayShape({ position, rotation = [0, 0, 0], color, size, distort, reduced, children }: ClayShapeProps) {
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
    <Float speed={reduced ? 0 : 2} rotationIntensity={reduced ? 0 : 0.5} floatIntensity={reduced ? 0 : 1.2}>
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
        <MeshDistortMaterial color={color} distort={distort} speed={reduced ? 0 : 2} roughness={0.6} metalness={0} />
      </mesh>
    </Float>
  );
}

type BuddyProps = {
  reduced: boolean;
};

// 점토로 빚은 Done Buddy: 눈이 커서를 따라오고, 가끔 깜빡이고, 누르면 통통 튄다.
function DoneBuddy({ reduced }: BuddyProps) {
  const bodyRef = useRef<Group>(null);
  const eyesRef = useRef<Group>(null);
  const bounceRef = useRef(0);
  const [hovered, setHovered] = useState(false);

  useFrame((state, delta) => {
    const body = bodyRef.current;
    const eyes = eyesRef.current;
    if (!body || !eyes) {
      return;
    }

    // 누르면 위로 튀었다가 찌그러지며 내려앉는다.
    bounceRef.current = Math.max(0, bounceRef.current - delta * 1.4);
    const t = bounceRef.current;
    const jump = Math.sin((1 - t) * Math.PI) * t * 0.9;
    const squash = Math.sin(t * Math.PI * 5) * t * 0.18;
    const grow = hovered ? 1.06 : 1;
    body.position.y = MathUtils.lerp(body.position.y, jump, 0.3);
    targetScale.set(grow * (1 + squash), grow * (1 - squash), grow * (1 + squash));
    body.scale.lerp(targetScale, 0.25);

    // 몸은 커서 쪽으로 살짝 고개를 돌린다.
    const { x, y } = state.pointer;
    body.rotation.y = MathUtils.lerp(body.rotation.y, reduced ? 0 : x * 0.45, 0.08);
    body.rotation.x = MathUtils.lerp(body.rotation.x, reduced ? 0 : -y * 0.3, 0.08);

    // 눈동자는 더 크게 커서를 따라간다.
    eyes.position.x = MathUtils.lerp(eyes.position.x, reduced ? 0 : x * 0.09, 0.15);
    eyes.position.y = MathUtils.lerp(eyes.position.y, reduced ? 0 : y * 0.07, 0.15);

    // 3.6초마다 한 번 깜빡인다.
    const cycle = state.clock.elapsedTime % 3.6;
    const blink = cycle > 3.45 ? Math.max(0.1, Math.abs(Math.cos(((cycle - 3.45) / 0.15) * Math.PI))) : 1;
    eyes.scale.y = reduced ? 1 : blink;
  });

  return (
    <Float speed={reduced ? 0 : 1.6} rotationIntensity={0} floatIntensity={reduced ? 0 : 0.8}>
      <group
        ref={bodyRef}
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
          bounceRef.current = 1;
        }}
      >
        <mesh>
          <sphereGeometry args={[1.25, 64, 64]} />
          <meshPhysicalMaterial color="#b9a3ff" roughness={0.55} clearcoat={0.25} clearcoatRoughness={0.6} />
        </mesh>

        <group ref={eyesRef}>
          {[-0.4, 0.4].map((x) => (
            <group key={x} position={[x, 0.2, 1.1]}>
              <mesh scale={[1, 1.25, 0.6]}>
                <sphereGeometry args={[0.15, 32, 32]} />
                <meshStandardMaterial color="#2d2545" roughness={0.3} />
              </mesh>
              <mesh position={[0.05, 0.07, 0.08]}>
                <sphereGeometry args={[0.045, 16, 16]} />
                <meshBasicMaterial color="#ffffff" />
              </mesh>
            </group>
          ))}
        </group>

        {[-0.66, 0.66].map((x) => (
          <mesh key={x} position={[x, -0.12, 1.0]} scale={[1, 0.75, 0.3]}>
            <sphereGeometry args={[0.15, 24, 24]} />
            <meshStandardMaterial color="#ffa3c6" roughness={0.8} transparent opacity={0.85} />
          </mesh>
        ))}

        <mesh position={[0, -0.12, 1.17]} rotation={[-0.15, 0, Math.PI]}>
          <torusGeometry args={[0.24, 0.05, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#2d2545" roughness={0.4} />
        </mesh>
      </group>
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

    group.rotation.y = MathUtils.lerp(group.rotation.y, state.pointer.x * 0.2, 0.05);
    group.rotation.x = MathUtils.lerp(group.rotation.x, -state.pointer.y * 0.12, 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
}

type ClaySceneProps = {
  reduced: boolean;
};

export default function ClayScene({ reduced }: ClaySceneProps) {
  return (
    <Canvas camera={{ position: [0, 0, 6.5], fov: 45 }} dpr={[1, 2]} gl={{ alpha: true, antialias: true }}>
      <hemisphereLight args={["#ffffff", "#c9b8ff", 1.3]} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#ffb8d2" />

      <Rig reduced={reduced}>
        <DoneBuddy reduced={reduced} />
        <ClayShape position={[2.05, 1.35, -0.6]} rotation={[0.6, 0.3, 0]} color="#ffb59c" size={0.62} distort={0.12} reduced={reduced}>
          <torusGeometry args={[0.7, 0.32, 32, 64]} />
        </ClayShape>
        <ClayShape position={[-2.1, -1.05, 0.2]} rotation={[0, 0, 0.7]} color="#8fe3bf" size={0.62} distort={0.15} reduced={reduced}>
          <capsuleGeometry args={[0.45, 0.8, 12, 32]} />
        </ClayShape>
        <ClayShape position={[1.85, -1.45, 0.5]} color="#9ccdff" size={0.42} distort={0.3} reduced={reduced}>
          <sphereGeometry args={[1, 48, 48]} />
        </ClayShape>
        <ClayShape position={[-1.85, 1.5, -0.4]} color="#ffe27a" size={0.38} distort={0.3} reduced={reduced}>
          <sphereGeometry args={[1, 48, 48]} />
        </ClayShape>
        <ClayShape position={[0.4, 2.05, -1.2]} color="#ffa3c6" size={0.22} distort={0.3} reduced={reduced}>
          <sphereGeometry args={[1, 32, 32]} />
        </ClayShape>
      </Rig>
    </Canvas>
  );
}

"use client";

import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  useRapier,
  type RapierRigidBody,
} from "@react-three/rapier";
import { useInView } from "motion/react";
import { Suspense, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useRef, type RefObject } from "react";
import {
  Color,
  DoubleSide,
  InstancedMesh,
  MathUtils,
  Matrix4,
  Plane,
  Quaternion,
  SplineCurve,
  Vector2,
  Vector3,
} from "three";

export type BowlControls = {
  /** 위치를 주지 않으면 그릇 가운데 근처 아무 곳에나 떨어뜨립니다. */
  drop: (x?: number, z?: number) => void;
  shake: () => void;
};

/** 그릇에 동시에 있을 수 있는 공 수. 넘치면 가장 오래된 공을 다시 떨어뜨립니다. */
export const MAX_BALLS = 40;
const INTRO_BALLS = 12;
const BALL_COLORS = ["#b9a3ff", "#ffb59c", "#8fe3bf", "#9ccdff", "#ffe27a", "#ffa3c6"];
const BALL_SIZES = [0.34, 0.27, 0.4, 0.3, 0.24];
const BOWL_INNER = 2.9;
const DROP_HEIGHT = 4.6;
const CAMERA_FOV = 38;
const CAMERA_DIRECTION = new Vector3(0, 0.64, 0.77).normalize();

const ballRadius = (slot: number) => BALL_SIZES[slot % BALL_SIZES.length];

const matrix = new Matrix4();
const position = new Vector3();
const rotation = new Quaternion();
const scale = new Vector3();
const facing = new Vector3();

// 그릇 단면을 매끈한 곡선으로 그린 뒤 돌려 깎아서(lathe) 둥근 그릇을 만듭니다.
const bowlProfile = new SplineCurve([
  new Vector2(0, 0),
  new Vector2(1.9, 0),
  new Vector2(2.75, 0.18),
  new Vector2(3.15, 0.65),
  new Vector2(3.32, 1.08),
  new Vector2(3.5, 1.2),
  new Vector2(3.66, 1.05),
  new Vector2(3.55, 0.45),
  new Vector2(3.05, -0.15),
  new Vector2(2.2, -0.32),
  new Vector2(0, -0.32),
]).getPoints(64);

// 공이 그릇 밖으로 날아가지 않도록 둘러친 보이지 않는 울타리와 천장
function InvisibleFence() {
  const sides = 18;
  const radius = 3.6;
  const halfWidth = radius * Math.tan(Math.PI / sides) + 0.05;

  return (
    <RigidBody type="fixed" colliders={false}>
      {Array.from({ length: sides }, (_, index) => {
        const angle = (index / sides) * Math.PI * 2;
        return (
          <CuboidCollider
            key={index}
            args={[halfWidth, 3.4, 0.15]}
            position={[Math.cos(angle) * (radius + 0.15), 4.4, Math.sin(angle) * (radius + 0.15)]}
            rotation={[0, -angle - Math.PI / 2, 0]}
          />
        );
      })}
      <CuboidCollider args={[radius + 0.5, 0.2, radius + 0.5]} position={[0, 8, 0]} />
    </RigidBody>
  );
}

type BowlProps = {
  onTap: (x: number, z: number) => void;
};

// 공을 받는 점토 그릇. 그릇을 톡 누르면 그 위로 공이 떨어집니다.
function Bowl({ onTap }: BowlProps) {
  return (
    <RigidBody type="fixed" colliders="trimesh" friction={0.9} restitution={0.2}>
      <mesh
        receiveShadow
        castShadow
        onClick={(event) => {
          // 끌다가 뗀 것은 누른 것으로 치지 않아요.
          if (event.delta > 6) {
            return;
          }
          event.stopPropagation();
          onTap(event.point.x, event.point.z);
        }}
      >
        <latheGeometry args={[bowlProfile, 72]} />
        <meshStandardMaterial color="#f3edff" roughness={0.95} side={DoubleSide} />
      </mesh>
    </RigidBody>
  );
}

type Drag = {
  slot: number;
  plane: Plane;
  target: Vector3;
  moved: boolean;
};

type BallPitProps = {
  reduced: boolean;
  controlsRef: RefObject<BowlControls | null>;
  onCountChange: (count: number) => void;
};

// 점토 공들: 물리 계산은 Rapier가 하고, 공 40개는 한 번에 그리는 InstancedMesh로 그립니다.
function BallPit({ reduced, controlsRef, onCountChange }: BallPitProps) {
  const { world, rapier, step } = useRapier();
  const meshRef = useRef<InstancedMesh>(null);
  const ballsRef = useRef<RapierRigidBody[]>([]);
  const recycleRef = useRef(0);
  const dragRef = useRef<Drag | null>(null);

  const placeBall = useCallback(
    (x: number, y: number, z: number) => {
      const balls = ballsRef.current;
      const slot = balls.length < MAX_BALLS ? balls.length : recycleRef.current++ % MAX_BALLS;
      // 그릇 벽에 박히지 않도록 안쪽으로 당겨 놓습니다.
      const limit = BOWL_INNER - ballRadius(slot);
      const distance = Math.hypot(x, z);
      const shrink = distance > limit ? limit / distance : 1;
      const spot = { x: x * shrink, y, z: z * shrink };

      if (slot === balls.length) {
        const body = world.createRigidBody(
          rapier.RigidBodyDesc.dynamic()
            .setTranslation(spot.x, spot.y, spot.z)
            .setLinearDamping(0.15)
            .setAngularDamping(0.5)
            .setCcdEnabled(true),
        );
        world.createCollider(
          rapier.ColliderDesc.ball(ballRadius(slot)).setRestitution(0.35).setFriction(0.8).setDensity(1.2),
          body,
        );
        balls.push(body);
        onCountChange(balls.length);
        return;
      }

      // 꽉 차면 가장 오래된 공을 위로 옮겨서 다시 떨어뜨립니다.
      if (dragRef.current?.slot === slot) {
        dragRef.current = null;
      }
      const body = balls[slot];
      body.setTranslation(spot, true);
      body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      body.setAngvel({ x: Math.random() - 0.5, y: 0, z: Math.random() - 0.5 }, true);
    },
    [world, rapier, onCountChange],
  );

  const drop = useCallback(
    (x = (Math.random() - 0.5) * 3, z = (Math.random() - 0.5) * 3) => {
      placeBall(x, DROP_HEIGHT + Math.random() * 0.8, z);
    },
    [placeBall],
  );

  const shake = useCallback(() => {
    for (const body of ballsRef.current) {
      const mass = body.mass();
      body.applyImpulse(
        {
          x: (Math.random() - 0.5) * 3.5 * mass,
          y: (3.5 + Math.random() * 2.5) * mass,
          z: (Math.random() - 0.5) * 3.5 * mass,
        },
        true,
      );
      body.applyTorqueImpulse({ x: (Math.random() - 0.5) * mass * 0.2, y: 0, z: (Math.random() - 0.5) * mass * 0.2 }, true);
    }
  }, []);

  useImperativeHandle(controlsRef, () => ({ drop, shake }), [drop, shake]);

  // 공마다 색을 한 번 정해 둡니다.
  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const color = new Color();
    for (let slot = 0; slot < MAX_BALLS; slot++) {
      mesh.setColorAt(slot, color.set(BALL_COLORS[slot % BALL_COLORS.length]));
    }
    if (mesh.instanceColor) {
      mesh.instanceColor.needsUpdate = true;
    }
  }, []);

  // 장면이 사라질 때 물리 세계도 함께 지워지므로 공 목록도 비웁니다. 개발 모드에서 효과가 두 번 실행될 때 지워진 공을 붙잡고 있지 않게 해요.
  useEffect(() => {
    const balls = ballsRef.current;
    return () => {
      balls.length = 0;
      recycleRef.current = 0;
      dragRef.current = null;
    };
  }, []);

  // 처음 들어오면 공이 몇 개 쏟아집니다. 동작 줄이기를 켰다면 그릇 바닥에 가만히 놓아 둡니다.
  useEffect(() => {
    const remaining = INTRO_BALLS - ballsRef.current.length;
    if (remaining <= 0) {
      return;
    }

    if (reduced) {
      for (let index = 0; index < remaining; index++) {
        const angle = index * 2.4;
        const ring = index < 5 ? 0.9 : 1.9;
        placeBall(Math.cos(angle) * ring, ballRadius(ballsRef.current.length) + 0.02, Math.sin(angle) * ring);
      }
      return;
    }

    const timers = Array.from({ length: remaining }, (_, index) => window.setTimeout(() => drop(), 300 + index * 140));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [reduced, drop, placeBall]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) {
      return;
    }
    const balls = ballsRef.current;

    // 잡고 있는 공은 손가락 쪽으로 속도를 주어 끌어당깁니다. 놓으면 그 속도 그대로 날아가요.
    const drag = dragRef.current;
    if (drag) {
      const body = balls[drag.slot];
      const now = body.translation();
      const velocity = position.set(drag.target.x - now.x, drag.target.y - now.y, drag.target.z - now.z).multiplyScalar(14);
      velocity.clampLength(0, 14);
      body.setLinvel(velocity, true);
    }

    // 화면 밖에 있다가 돌아오면 한 프레임이 길게 잡히므로, 한 번에 1/30초까지만 계산해서 공이 순간 이동하지 않게 합니다.
    step(Math.min(delta, 1 / 30));

    for (let slot = 0; slot < balls.length; slot++) {
      const body = balls[slot];
      const t = body.translation();
      // 혹시 그릇 밖으로 빠진 공은 다시 위에서 떨어뜨립니다.
      if (t.y < -6) {
        body.setTranslation({ x: 0, y: DROP_HEIGHT, z: 0 }, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
      }
      const r = body.rotation();
      matrix.compose(position.set(t.x, t.y, t.z), rotation.set(r.x, r.y, r.z, r.w), scale.setScalar(ballRadius(slot)));
      mesh.setMatrixAt(slot, matrix);
    }
    mesh.count = balls.length;
    mesh.instanceMatrix.needsUpdate = true;
  });

  const release = (event: ThreeEvent<PointerEvent>) => {
    const drag = dragRef.current;
    if (!drag) {
      return;
    }
    dragRef.current = null;
    (event.target as Element).releasePointerCapture?.(event.pointerId);
    // 끌지 않고 톡 누르기만 했다면 통 튀어 오릅니다.
    if (!drag.moved) {
      const body = ballsRef.current[drag.slot];
      body.applyImpulse({ x: 0, y: 5 * body.mass(), z: 0 }, true);
    }
  };

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, MAX_BALLS]}
      count={0}
      castShadow
      receiveShadow
      // 공이 움직이며 범위가 계속 바뀌므로 화면 밖 판정은 하지 않습니다.
      frustumCulled={false}
      onPointerDown={(event) => {
        if (event.instanceId === undefined || event.instanceId >= ballsRef.current.length) {
          return;
        }
        event.stopPropagation();
        (event.target as Element).setPointerCapture(event.pointerId);
        // 카메라를 마주 보는 평면 위에서 공을 움직입니다.
        event.camera.getWorldDirection(facing).negate();
        dragRef.current = {
          slot: event.instanceId,
          plane: new Plane().setFromNormalAndCoplanarPoint(facing, event.point),
          target: event.point.clone(),
          moved: false,
        };
        document.body.style.cursor = "grabbing";
      }}
      onPointerMove={(event) => {
        const drag = dragRef.current;
        if (!drag || !event.ray.intersectPlane(drag.plane, position)) {
          return;
        }
        const radius = ballRadius(drag.slot);
        const limit = BOWL_INNER - radius;
        const distance = Math.hypot(position.x, position.z);
        if (distance > limit) {
          position.x *= limit / distance;
          position.z *= limit / distance;
        }
        position.y = MathUtils.clamp(position.y, radius, DROP_HEIGHT);
        if (position.distanceTo(drag.target) > 0.05) {
          drag.moved = true;
        }
        drag.target.copy(position);
      }}
      onPointerUp={(event) => {
        release(event);
        document.body.style.cursor = "";
      }}
      onPointerCancel={(event) => {
        release(event);
        document.body.style.cursor = "";
      }}
      // 공을 눌렀을 때 뒤에 있는 그릇까지 눌린 것으로 치지 않게 합니다.
      onClick={(event) => event.stopPropagation()}
      onPointerOver={() => {
        if (!dragRef.current) {
          document.body.style.cursor = "grab";
        }
      }}
      onPointerOut={() => {
        if (!dragRef.current) {
          document.body.style.cursor = "";
        }
      }}
    >
      <sphereGeometry args={[1, 32, 24]} />
      <meshPhysicalMaterial roughness={0.7} sheen={0.6} sheenRoughness={0.8} sheenColor="#ffffff" />
    </instancedMesh>
  );
}

// 그릇 전체가 보이도록, 화면이 좁을수록 카메라를 뒤로 물립니다.
function FitCamera() {
  const aspect = useThree((state) => state.size.width / state.size.height);

  useFrame((state) => {
    const distance = Math.max(10.6, 4.4 / (Math.tan(MathUtils.degToRad(CAMERA_FOV / 2)) * aspect));
    if (Math.abs(state.camera.position.length() - distance) > 0.01) {
      state.camera.position.copy(CAMERA_DIRECTION).multiplyScalar(distance);
      state.camera.lookAt(0, 0.5, 0);
    }
  });

  return null;
}

export type PhysicsBowlCanvasProps = BallPitProps;

export default function PhysicsBowlCanvas({ reduced, controlsRef, onCountChange }: PhysicsBowlCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 화면 밖으로 스크롤하면 그리기와 물리 계산을 함께 멈춥니다.
  const isInView = useInView(canvasRef);

  return (
    <Canvas
      ref={canvasRef}
      frameloop={isInView ? "always" : "never"}
      shadows="percentage"
      // 톤 매핑을 끄면 파스텔 색이 탁해지지 않고 사이트의 색 그대로 보여요.
      flat
      camera={{ position: [0, 6, 7], fov: CAMERA_FOV }}
      dpr={[1, 1.75]}
      gl={{ alpha: true, antialias: true }}
      // 세로로 쓸어내리면 페이지가 스크롤되도록 두고, 톡 누르기와 가로로 끌기만 장면이 받습니다.
      style={{ touchAction: "pan-y" }}
      onPointerMissed={() => controlsRef.current?.drop()}
      role="img"
      aria-label="점토 그릇에 파스텔 점토 공이 떨어져 쌓이는 물리 장면"
    >
      <FitCamera />
      <hemisphereLight args={["#ffffff", "#d9ccff", 1.5]} />
      <directionalLight
        position={[3, 9, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-radius={4}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
        shadow-camera-left={-4.5}
        shadow-camera-right={4.5}
        shadow-camera-top={4.5}
        shadow-camera-bottom={-4.5}
      />
      <Suspense fallback={null}>
        <Physics paused timeStep="vary" gravity={[0, -12, 0]}>
          <Bowl onTap={(x, z) => controlsRef.current?.drop(x, z)} />
          <InvisibleFence />
          <BallPit reduced={reduced} controlsRef={controlsRef} onCountChange={onCountChange} />
        </Physics>
      </Suspense>
    </Canvas>
  );
}

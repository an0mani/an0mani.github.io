"use client";

import { useRive, useRiveFile, type RiveFile } from "@rive-app/react-canvas";
import { useReducedMotion } from "motion/react";
import { useEffect, useState, type PointerEvent } from "react";
import ClayChip from "@/components/lab/characters/ClayChip";
import StageNotice from "@/components/lab/characters/StageNotice";
import { setRiveInput, useCalmPlayback } from "@/components/lab/characters/riveRuntime";

const AVATARS_SRC = "/lab/rive/avatars.riv";

// avatars.riv 안의 아트보드와 상태 머신 이름입니다. 셋 다 isHappy, isSad 두 입력을 받습니다.
const avatars = [
  { artboard: "Avatar 1", stateMachine: "avatar", label: "아바타 1" },
  { artboard: "Avatar 2", stateMachine: "avatar2", label: "아바타 2" },
  { artboard: "Avatar 3", stateMachine: "avatar3", label: "아바타 3" },
];

type Mood = "calm" | "happy" | "sad";

const moods: { value: Mood; label: string }[] = [
  { value: "calm", label: "그냥" },
  { value: "happy", label: "기뻐요" },
  { value: "sad", label: "시무룩" },
];

type AvatarStageProps = {
  riveFile: RiveFile;
  artboard: string;
  stateMachine: string;
  mood: Mood;
  reduced: boolean;
  wakeSignal: number;
};

// 아트보드를 바꾸면 이 무대를 새로 만듭니다. 파일은 한 번만 받아 두고 같이 씁니다.
function AvatarStage({ riveFile, artboard, stateMachine, mood, reduced, wakeSignal }: AvatarStageProps) {
  const { rive, RiveComponent } = useRive({
    riveFile,
    artboard,
    stateMachine,
    autoplay: !reduced,
    // 이 파일에는 캔버스 리스너가 없어서, 포인터는 아래에서 직접 입력값으로 바꿉니다.
    shouldDisableRiveListeners: true,
  });
  const wake = useCalmPlayback(rive, reduced);
  const [hovering, setHovering] = useState(false);

  // 마우스를 올리고 있으면 '그냥'일 때도 웃습니다.
  useEffect(() => {
    setRiveInput(rive, stateMachine, "isHappy", mood === "happy" || (mood === "calm" && hovering));
    setRiveInput(rive, stateMachine, "isSad", mood === "sad");
  }, [rive, stateMachine, mood, hovering]);

  // 동작 줄이기일 때는 칩을 누른 순간에만 잠깐 움직입니다. 처음 불러왔을 때는 멈춰 둡니다.
  useEffect(() => {
    if (wakeSignal > 0) {
      wake();
    }
  }, [wake, wakeSignal]);

  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse") {
      wake();
      setHovering(true);
    }
  };

  const handlePointerLeave = () => {
    if (hovering) {
      wake();
      setHovering(false);
    }
  };

  return (
    <div
      className="clay-pressed relative aspect-square w-full overflow-hidden bg-white/50 p-4"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <RiveComponent className="size-full" role="img" aria-label={`Rive 아바타 예제: ${artboard}`} />
      {!rive && <StageNotice kind="loading" className="absolute inset-0" />}
    </div>
  );
}

export default function RiveAvatars() {
  const reduced = useReducedMotion() ?? false;
  const { riveFile, status } = useRiveFile({ src: AVATARS_SRC });
  const [avatarIndex, setAvatarIndex] = useState(0);
  const [mood, setMood] = useState<Mood>("calm");
  const [wakeSignal, setWakeSignal] = useState(0);
  const avatar = avatars[avatarIndex];

  const chooseAvatar = (index: number) => {
    setAvatarIndex(index);
    setWakeSignal((count) => count + 1);
  };

  const chooseMood = (value: Mood) => {
    setMood(value);
    setWakeSignal((count) => count + 1);
  };

  return (
    <div>
      {status === "success" && riveFile ? (
        <AvatarStage
          key={avatar.artboard}
          riveFile={riveFile}
          artboard={avatar.artboard}
          stateMachine={avatar.stateMachine}
          mood={mood}
          reduced={reduced}
          wakeSignal={wakeSignal}
        />
      ) : (
        <StageNotice kind={status === "failed" ? "error" : "loading"} className="aspect-square w-full" />
      )}

      <p className="mt-5 font-display text-xl text-ink">
        {avatar.label} · {moods.find((item) => item.value === mood)?.label}
      </p>
      <p className="mt-1 text-ink/80">마우스를 올리면 웃어요. 아래에서 친구와 기분을 바꿔 보세요.</p>

      <div role="group" aria-label="아바타 고르기" className="mt-4 flex flex-wrap gap-2">
        {avatars.map((item, index) => (
          <ClayChip key={item.artboard} pressed={index === avatarIndex} onClick={() => chooseAvatar(index)}>
            {item.label}
          </ClayChip>
        ))}
      </div>
      <div role="group" aria-label="기분 고르기" className="mt-3 flex flex-wrap gap-2">
        {moods.map((item) => (
          <ClayChip key={item.value} pressed={item.value === mood} onClick={() => chooseMood(item.value)}>
            {item.label}
          </ClayChip>
        ))}
      </div>
    </div>
  );
}

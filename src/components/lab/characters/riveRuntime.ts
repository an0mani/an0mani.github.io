import { Rive } from "@rive-app/react-canvas";
import { useCallback, useEffect, useRef } from "react";

// 예제 .riv 파일은 데이터 바인딩이 생기기 전에 만들어져서 상태 머신 입력과 Rive 이벤트로 움직입니다.
// 그래서 런타임이 콘솔에 띄우는 지원 중단 안내 중 이 두 가지만 끕니다.
Rive.suppressDeprecationWarnings = ["rive-events", "state-machine-inputs"];

// 상태 머신 입력값을 바꿉니다. 아직 불러오는 중이면 아무것도 하지 않습니다.
export function setRiveInput(rive: Rive | null, stateMachine: string, name: string, value: number | boolean) {
  const input = rive?.stateMachineInputs(stateMachine)?.find((item) => item.name === name);
  if (input) {
    input.value = value;
  }
}

const CALM_PLAY_MS = 1600;

// 기기에서 '동작 줄이기'를 켜 두면 자동 재생하지 않고, 직접 누를 때만 잠깐 움직였다가 다시 멈춥니다.
export function useCalmPlayback(rive: Rive | null, reduced: boolean) {
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  return useCallback(() => {
    if (!rive || !reduced) {
      return;
    }
    rive.play();
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => rive.pause(), CALM_PLAY_MS);
  }, [rive, reduced]);
}

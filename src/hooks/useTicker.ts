import { useEffect, useRef } from "react";
import type { AppState } from "../state/AppStateContext";

const TICK_RATE = 60; // ticks per second
const MS_PER_TICK = 1000 / TICK_RATE;

type UpdateState = (updater: (draft: AppState) => void) => void;

export function useTicker(updateState: UpdateState) {
  const accumulatorRef = useRef(0);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let rafId: number;

    const tick = (currentTime: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = currentTime;
      }

      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;
      accumulatorRef.current += deltaTime;

      const ticksToAdd = Math.floor(accumulatorRef.current / MS_PER_TICK);
      if (ticksToAdd > 0) {
        accumulatorRef.current -= ticksToAdd * MS_PER_TICK;
        updateState((draft) => {
          draft.tick += ticksToAdd;
        });
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [updateState]);
}

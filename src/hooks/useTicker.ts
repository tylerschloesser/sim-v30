import { useEffect, useRef } from "react";
import type { AppState } from "../state/AppStateContext";
import { getResourcesOnEntity } from "../utils/chunks";

const TICK_RATE = 60; // ticks per second
const MS_PER_TICK = 1000 / TICK_RATE;
const MINE_TICKS = 60;
const MAX_INVENTORY_PER_TYPE = 10;

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
          draft.world.tick += ticksToAdd;

          // Process each entity
          for (const entity of Object.values(draft.world.entities)) {
            // Handle mining progress
            if (entity.state.type === "mine") {
              entity.state.progress += ticksToAdd;
              if (entity.state.progress >= MINE_TICKS) {
                // Mining complete - add to inventory
                const itemType = entity.state.itemType;
                entity.inventory[itemType] =
                  (entity.inventory[itemType] ?? 0) + 1;
                entity.state = { type: "idle" };
              }
            }

            // Check if we should start mining (idle or just finished)
            if (entity.state.type === "idle") {
              const resources = getResourcesOnEntity(
                draft.world.chunks,
                entity.position.x,
                entity.position.y,
              );
              for (const itemType of resources) {
                if (
                  (entity.inventory[itemType] ?? 0) < MAX_INVENTORY_PER_TYPE
                ) {
                  entity.state = { type: "mine", progress: 0, itemType };
                  break;
                }
              }
            }
          }
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

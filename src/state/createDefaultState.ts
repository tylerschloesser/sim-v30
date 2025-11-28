import type { AppState } from "./AppStateContext";
import { addEntity } from "./AppStateContext";

export function createDefaultState(): AppState {
  const state: AppState = {
    tick: 0,
    camera: { x: 0, y: 0 },
    nextEntityId: 0,
    entities: {},
  };

  addEntity(state, {
    position: { x: 0, y: 0 },
    radius: 32,
    color: { h: 220, s: 100, l: 50 },
    connections: {},
  });

  return state;
}

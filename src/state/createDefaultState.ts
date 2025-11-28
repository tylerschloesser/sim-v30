import type { AppState, World } from "./AppStateContext";
import { addEntity } from "./AppStateContext";

export function createDefaultWorld(): World {
  const world: World = {
    tick: 0,
    camera: { x: 0, y: 0 },
    nextEntityId: 0,
    entities: {},
  };

  addEntity(world, {
    position: { x: 0, y: 0 },
    radius: 32,
    color: { h: 220, s: 100, l: 50 },
    connections: {},
  });

  return world;
}

export function createDefaultState(): AppState {
  return {
    world: createDefaultWorld(),
    selectedEntityId: null,
  };
}

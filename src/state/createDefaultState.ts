import type { AppState, World } from "./AppStateContext";
import { addEntity } from "./AppStateContext";

export function createDefaultWorld(): World {
  const world: World = {
    tick: 0,
    camera: { x: 0, y: 0 },
    nextEntityId: 0,
    entities: {},
    chunks: {},
  };

  addEntity(world, {
    position: { x: -1, y: -1 },
    width: 2,
    height: 2,
    color: { h: 220, s: 100, l: 50 },
  });

  return world;
}

export function createDefaultState(): AppState {
  return {
    world: createDefaultWorld(),
    selectedTileId: null,
  };
}

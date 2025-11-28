import type { AppState, ItemType, World } from "./AppStateContext";
import { addEntity } from "./AppStateContext";
import {
  getChunkKey,
  getOrCreateChunk,
  getTileIndex,
  getEntityAtTile,
} from "../utils/chunks";

const ITEM_TYPES: ItemType[] = ["iron", "copper", "stone"];
const RESOURCES_PER_TYPE = { min: 3, max: 5 };
const SPAWN_RADIUS = 10;

function placeResources(world: World): void {
  const placedPositions = new Set<string>();

  for (const itemType of ITEM_TYPES) {
    const count =
      RESOURCES_PER_TYPE.min +
      Math.floor(
        Math.random() * (RESOURCES_PER_TYPE.max - RESOURCES_PER_TYPE.min + 1),
      );

    let placed = 0;
    let attempts = 0;
    const maxAttempts = count * 10;

    while (placed < count && attempts < maxAttempts) {
      attempts++;
      const x =
        Math.floor(Math.random() * (SPAWN_RADIUS * 2 + 1)) - SPAWN_RADIUS;
      const y =
        Math.floor(Math.random() * (SPAWN_RADIUS * 2 + 1)) - SPAWN_RADIUS;
      const posKey = `${x},${y}`;

      // Skip if already has a resource
      if (placedPositions.has(posKey)) continue;

      // Skip if has an entity
      if (getEntityAtTile(world.chunks, x, y)) continue;

      // Place the resource
      const chunkKey = getChunkKey(x, y);
      const chunk = getOrCreateChunk(world.chunks, chunkKey);
      const index = getTileIndex(x, y);
      const existing = chunk.tiles[index];

      chunk.tiles[index] = {
        connections: existing?.connections ?? {},
        itemType,
      };

      placedPositions.add(posKey);
      placed++;
    }
  }
}

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

  placeResources(world);

  return world;
}

export function createDefaultState(): AppState {
  return {
    world: createDefaultWorld(),
    selectedTileId: null,
  };
}

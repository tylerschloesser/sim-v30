import { createContext } from "react";
import { z } from "zod";
import { getOrCreateTile, setEntityOnTiles } from "../utils/chunks";
import type { TileId } from "../utils/tileId";

export const CameraSchema = z.strictObject({
  x: z.number(),
  y: z.number(),
});

export const PositionSchema = z.strictObject({
  x: z.number(),
  y: z.number(),
});

export const HSLSchema = z.strictObject({
  h: z.number(),
  s: z.number(),
  l: z.number(),
});

export const ItemTypeSchema = z.enum(["iron", "copper", "stone"]);

export const TileSchema = z.strictObject({
  entityId: z.string().optional(),
  connections: z.record(z.string(), z.literal(true)).default({}),
  itemType: ItemTypeSchema.optional(),
});

export const ChunkSchema = z.strictObject({
  tiles: z.array(TileSchema.nullable()),
});

export const EntitySchema = z.strictObject({
  id: z.string(),
  position: PositionSchema,
  width: z.number().int(),
  height: z.number().int(),
  color: HSLSchema,
});

export const WorldSchema = z.strictObject({
  tick: z.number(),
  camera: CameraSchema,
  entities: z.record(z.string(), EntitySchema),
  chunks: z.record(z.string(), ChunkSchema),
  nextEntityId: z.number(),
});

export const AppStateSchema = z.strictObject({
  world: WorldSchema,
  selectedTileId: z.string().nullable(),
});

export type Camera = z.infer<typeof CameraSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type HSL = z.infer<typeof HSLSchema>;
export type ItemType = z.infer<typeof ItemTypeSchema>;
export type Tile = z.infer<typeof TileSchema>;
export type Chunk = z.infer<typeof ChunkSchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type World = z.infer<typeof WorldSchema>;
export type AppState = z.infer<typeof AppStateSchema>;

export type AppStateContextType = {
  state: AppState;
  updateState: (updater: (draft: AppState) => void) => void;
};

export const AppStateContext = createContext<AppStateContextType | null>(null);

export function getEntityCenter(entity: Entity): Position {
  return {
    x: entity.position.x + entity.width / 2,
    y: entity.position.y + entity.height / 2,
  };
}

export function createEntity(world: World, props: Omit<Entity, "id">): Entity {
  const id = String(world.nextEntityId);
  return { id, ...props };
}

export function addEntity(world: World, props: Omit<Entity, "id">): string {
  const entity = createEntity(world, props);
  world.entities[entity.id] = entity;
  world.nextEntityId++;
  setEntityOnTiles(
    world.chunks,
    entity.id,
    entity.position.x,
    entity.position.y,
  );
  return entity.id;
}

export function connectTiles(world: World, path: TileId[]): void {
  for (let i = 0; i < path.length - 1; i++) {
    const tileIdA = path[i];
    const tileIdB = path[i + 1];

    const tileA = getOrCreateTile(world.chunks, tileIdA);
    const tileB = getOrCreateTile(world.chunks, tileIdB);

    tileA.connections[tileIdB] = true;
    tileB.connections[tileIdA] = true;
  }
}

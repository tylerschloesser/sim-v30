import { createContext } from "react";
import { z } from "zod";
import { setEntityOnTiles } from "../utils/chunks";
import { invariant } from "../utils/invariant";

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

export const TileSchema = z.strictObject({
  entityId: z.string(),
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
  connections: z.record(z.string(), z.literal(true)),
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
  selectedEntityId: z.string().nullable(),
});

export type Camera = z.infer<typeof CameraSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type HSL = z.infer<typeof HSLSchema>;
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

export function connectEntities(world: World, idA: string, idB: string): void {
  const entityA = world.entities[idA];
  const entityB = world.entities[idB];
  invariant(entityA, `Entity ${idA} does not exist`);
  invariant(entityB, `Entity ${idB} does not exist`);
  invariant(idA !== idB, `Cannot connect entity ${idA} to itself`);
  entityA.connections[idB] = true;
  entityB.connections[idA] = true;
}

export function disconnectEntities(
  world: World,
  idA: string,
  idB: string,
): void {
  const entityA = world.entities[idA];
  const entityB = world.entities[idB];
  if (entityA) delete entityA.connections[idB];
  if (entityB) delete entityB.connections[idA];
}

export function validateEntities(world: World): boolean {
  for (const [id, entity] of Object.entries(world.entities)) {
    for (const connectedId of Object.keys(entity.connections)) {
      // No self-connections
      if (connectedId === id) return false;

      // Connected entity must exist
      const connectedEntity = world.entities[connectedId];
      if (!connectedEntity) return false;

      // Connection must be bidirectional
      if (!connectedEntity.connections[id]) return false;
    }
  }
  return true;
}

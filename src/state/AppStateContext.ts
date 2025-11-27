import { createContext } from "react";
import { z } from "zod";

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

export const EntitySchema = z.strictObject({
  id: z.string(),
  position: PositionSchema,
  radius: z.number(),
  color: HSLSchema,
  connections: z.record(z.string(), z.literal(true)),
});

export const AppStateSchema = z.strictObject({
  tick: z.number(),
  camera: CameraSchema,
  entities: z.record(z.string(), EntitySchema),
  nextEntityId: z.number(),
});

export type Camera = z.infer<typeof CameraSchema>;
export type Position = z.infer<typeof PositionSchema>;
export type HSL = z.infer<typeof HSLSchema>;
export type Entity = z.infer<typeof EntitySchema>;
export type AppState = z.infer<typeof AppStateSchema>;

export type AppStateContextType = {
  state: AppState;
  updateState: (updater: (draft: AppState) => void) => void;
};

export const AppStateContext = createContext<AppStateContextType | null>(null);

export function createEntity(
  state: AppState,
  props: Omit<Entity, "id">,
): Entity {
  const id = String(state.nextEntityId);
  return { id, ...props };
}

export function addEntity(state: AppState, props: Omit<Entity, "id">): void {
  const entity = createEntity(state, props);
  state.entities[entity.id] = entity;
  state.nextEntityId++;
}

export function connectEntities(
  state: AppState,
  idA: string,
  idB: string,
): void {
  const entityA = state.entities[idA];
  const entityB = state.entities[idB];
  if (entityA && entityB && idA !== idB) {
    entityA.connections[idB] = true;
    entityB.connections[idA] = true;
  }
}

export function disconnectEntities(
  state: AppState,
  idA: string,
  idB: string,
): void {
  const entityA = state.entities[idA];
  const entityB = state.entities[idB];
  if (entityA) delete entityA.connections[idB];
  if (entityB) delete entityB.connections[idA];
}

export function validateEntities(state: AppState): boolean {
  for (const [id, entity] of Object.entries(state.entities)) {
    for (const connectedId of Object.keys(entity.connections)) {
      // No self-connections
      if (connectedId === id) return false;

      // Connected entity must exist
      const connectedEntity = state.entities[connectedId];
      if (!connectedEntity) return false;

      // Connection must be bidirectional
      if (!connectedEntity.connections[id]) return false;
    }
  }
  return true;
}

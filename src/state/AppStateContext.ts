import { createContext } from "react";

export interface Camera {
  x: number;
  y: number;
}

export interface Position {
  x: number;
  y: number;
}

export interface Entity {
  id: string;
  position: Position;
  radius: number;
  color: string;
}

export interface AppState {
  tick: number;
  camera: Camera;
  entities: Record<string, Entity>;
  nextEntityId: number;
}

export type AppStateContextType = {
  state: AppState;
  updateState: (updater: (draft: AppState) => void) => void;
};

export const AppStateContext = createContext<AppStateContextType | null>(null);

export function createEntity(
  state: AppState,
  props: Omit<Entity, "id">
): Entity {
  const id = String(state.nextEntityId);
  return { id, ...props };
}

export function addEntity(state: AppState, props: Omit<Entity, "id">): void {
  const entity = createEntity(state, props);
  state.entities[entity.id] = entity;
  state.nextEntityId++;
}

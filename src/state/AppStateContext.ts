import { createContext } from "react";

export interface Camera {
  x: number;
  y: number;
}

export interface AppState {
  tick: number;
  camera: Camera;
}

export type AppStateContextType = {
  state: AppState;
  updateState: (updater: (draft: AppState) => void) => void;
};

export const AppStateContext = createContext<AppStateContextType | null>(null);

import type { ReactNode } from "react";
import { useImmer } from "use-immer";
import type { AppState } from "./AppStateContext";
import { addEntity, AppStateContext } from "./AppStateContext";
import { loadState } from "./persistence";
import { usePersistence } from "../hooks/usePersistence";

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

function createInitialState(): AppState {
  const loaded = loadState();
  if (loaded) return loaded;
  return createDefaultState();
}

const initialState = createInitialState();

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, updateState] = useImmer(initialState);

  usePersistence(state);

  return (
    <AppStateContext.Provider value={{ state, updateState }}>
      {children}
    </AppStateContext.Provider>
  );
}

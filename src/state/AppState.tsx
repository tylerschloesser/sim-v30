import type { ReactNode } from "react";
import { useImmer } from "use-immer";
import type { AppState } from "./AppStateContext";
import { addEntity, AppStateContext } from "./AppStateContext";

function createInitialState(): AppState {
  const state: AppState = {
    tick: 0,
    camera: { x: 0, y: 0 },
    nextEntityId: 0,
    entities: {},
  };

  addEntity(state, {
    position: { x: 0, y: 0 },
    radius: 32,
    color: "blue",
  });

  return state;
}

const initialState = createInitialState();

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, updateState] = useImmer(initialState);

  return (
    <AppStateContext.Provider value={{ state, updateState }}>
      {children}
    </AppStateContext.Provider>
  );
}

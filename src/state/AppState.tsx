import type { ReactNode } from "react";
import { useImmer } from "use-immer";
import type { AppState } from "./AppStateContext";
import { AppStateContext } from "./AppStateContext";
import { createDefaultState } from "./createDefaultState";
import { loadState } from "./persistence";
import { usePersistence } from "../hooks/usePersistence";

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

import type { ReactNode } from "react";
import { useImmer } from "use-immer";
import type { AppState } from "./AppStateContext";
import { AppStateContext } from "./AppStateContext";

const initialState: AppState = {
  tick: 0,
};

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, updateState] = useImmer(initialState);

  return (
    <AppStateContext.Provider value={{ state, updateState }}>
      {children}
    </AppStateContext.Provider>
  );
}

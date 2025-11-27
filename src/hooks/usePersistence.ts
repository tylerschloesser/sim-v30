import { useEffect, useRef } from "react";
import type { AppState } from "../state/AppStateContext";
import { saveState } from "../state/persistence";

export function usePersistence(state: AppState): void {
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      saveState(stateRef.current);
    }, 1000);

    return () => {
      clearInterval(intervalId);
      saveState(stateRef.current);
    };
  }, []);
}

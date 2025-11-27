import type { AppState } from "./AppStateContext";
import { AppStateSchema, validateEntities } from "./AppStateContext";

const STORAGE_KEY = "sim-v30-app-state";

export function saveState(state: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (error) {
    console.error("Failed to save state:", error);
    return false;
  }
}

export function loadState(): AppState | null {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;

    const result = AppStateSchema.safeParse(JSON.parse(json));
    if (!result.success) {
      console.warn("Invalid state in localStorage:", result.error.issues);
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    if (!validateEntities(result.data)) {
      console.warn("Invalid entity connections in localStorage");
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return result.data;
  } catch (error) {
    console.error("Failed to load state:", error);
    return null;
  }
}

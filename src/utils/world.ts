import type { Chunk } from "../state/AppStateContext";
import { areTilesOccupied, getEntityAtTile } from "./chunks";

export function hasOverlappingEntity(
  chunks: Record<string, Chunk>,
  rect: { x: number; y: number },
): boolean {
  return areTilesOccupied(chunks, rect.x, rect.y);
}

export function findEntityAtPoint(
  chunks: Record<string, Chunk>,
  point: { x: number; y: number },
): string | null {
  const tileX = Math.floor(point.x);
  const tileY = Math.floor(point.y);
  return getEntityAtTile(chunks, tileX, tileY);
}

import type { Chunk } from "../state/AppStateContext";

export const CHUNK_SIZE = 32;

/** Get chunk coordinate from tile coordinate */
export function getChunkCoord(tileCoord: number): number {
  return Math.floor(tileCoord / CHUNK_SIZE);
}

/** Get chunk key string from tile position */
export function getChunkKey(tileX: number, tileY: number): string {
  return `${getChunkCoord(tileX)},${getChunkCoord(tileY)}`;
}

/** Get local tile index within chunk (0-1023) */
export function getTileIndex(tileX: number, tileY: number): number {
  const localX = ((tileX % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  const localY = ((tileY % CHUNK_SIZE) + CHUNK_SIZE) % CHUNK_SIZE;
  return localY * CHUNK_SIZE + localX;
}

/** Get or create a chunk at the given key */
export function getOrCreateChunk(
  chunks: Record<string, Chunk>,
  key: string,
): Chunk {
  let chunk = chunks[key];
  if (!chunk) {
    chunk = { tiles: new Array(CHUNK_SIZE * CHUNK_SIZE).fill(null) };
    chunks[key] = chunk;
  }
  return chunk;
}

/** Get all 4 tile positions for a 2x2 entity at position (x, y) */
export function getEntityTilePositions(
  x: number,
  y: number,
): Array<{ x: number; y: number }> {
  return [
    { x, y },
    { x: x + 1, y },
    { x, y: y + 1 },
    { x: x + 1, y: y + 1 },
  ];
}

/** Set entity on all its tiles (handles multi-chunk spanning) */
export function setEntityOnTiles(
  chunks: Record<string, Chunk>,
  entityId: string,
  x: number,
  y: number,
): void {
  for (const pos of getEntityTilePositions(x, y)) {
    const key = getChunkKey(pos.x, pos.y);
    const chunk = getOrCreateChunk(chunks, key);
    const index = getTileIndex(pos.x, pos.y);
    chunk.tiles[index] = { entityId };
  }
}

/** Clear entity from all its tiles */
export function clearEntityFromTiles(
  chunks: Record<string, Chunk>,
  x: number,
  y: number,
): void {
  for (const pos of getEntityTilePositions(x, y)) {
    const key = getChunkKey(pos.x, pos.y);
    const chunk = chunks[key];
    if (chunk) {
      const index = getTileIndex(pos.x, pos.y);
      chunk.tiles[index] = null;
    }
  }
}

/** Check if any tiles for a 2x2 entity at (x, y) are occupied */
export function areTilesOccupied(
  chunks: Record<string, Chunk>,
  x: number,
  y: number,
): boolean {
  for (const pos of getEntityTilePositions(x, y)) {
    const key = getChunkKey(pos.x, pos.y);
    const chunk = chunks[key];
    if (chunk) {
      const index = getTileIndex(pos.x, pos.y);
      if (chunk.tiles[index] !== null) {
        return true;
      }
    }
  }
  return false;
}

/** Get entity ID at a specific tile, or null if empty */
export function getEntityAtTile(
  chunks: Record<string, Chunk>,
  tileX: number,
  tileY: number,
): string | null {
  const key = getChunkKey(tileX, tileY);
  const chunk = chunks[key];
  if (!chunk) return null;
  const index = getTileIndex(tileX, tileY);
  return chunk.tiles[index]?.entityId ?? null;
}

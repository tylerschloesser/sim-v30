import type { Chunk } from "../state/AppStateContext";
import {
  areTilesOccupied,
  getEntityAtTile,
  getEntityTilePositions,
  getTile,
} from "./chunks";
import { createTileId, parseTileId } from "./tileId";

export function hasOverlappingEntity(
  chunks: Record<string, Chunk>,
  rect: { x: number; y: number },
): boolean {
  return areTilesOccupied(chunks, rect.x, rect.y);
}

/** Check if placing an entity would block an existing diagonal connection */
export function wouldBlockConnection(
  chunks: Record<string, Chunk>,
  entityX: number,
  entityY: number,
): boolean {
  const newTiles = getEntityTilePositions(entityX, entityY);

  for (const newTile of newTiles) {
    // Check all 8 neighbors of this tile
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const neighborX = newTile.x + dx;
        const neighborY = newTile.y + dy;
        const neighborTileId = createTileId(neighborX, neighborY);
        const neighborTile = getTile(chunks, neighborTileId);

        if (!neighborTile?.connections) continue;

        // Check each connection from this neighbor
        for (const connectedId of Object.keys(neighborTile.connections)) {
          const connected = parseTileId(connectedId);
          const connDx = connected.x - neighborX;
          const connDy = connected.y - neighborY;

          // Only check diagonal connections
          if (connDx === 0 || connDy === 0) continue;

          // For a diagonal connection, the two "corner" tiles are:
          // (neighborX + connDx, neighborY) and (neighborX, neighborY + connDy)
          const corner1X = neighborX + connDx;
          const corner1Y = neighborY;
          const corner2X = neighborX;
          const corner2Y = neighborY + connDy;

          // Would the new tile block this diagonal?
          if (
            (newTile.x === corner1X && newTile.y === corner1Y) ||
            (newTile.x === corner2X && newTile.y === corner2Y)
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
}

export function findEntityAtPoint(
  chunks: Record<string, Chunk>,
  point: { x: number; y: number },
): string | null {
  const tileX = Math.floor(point.x);
  const tileY = Math.floor(point.y);
  return getEntityAtTile(chunks, tileX, tileY);
}

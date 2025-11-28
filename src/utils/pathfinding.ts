import type { Chunk } from "../state/AppStateContext";
import { getEntityAtTile } from "./chunks";
import type { TileId } from "./tileId";
import { createTileId, parseTileId } from "./tileId";

// 8 directions (including diagonals)
const DIRECTIONS = [
  { dx: 0, dy: -1 }, // up
  { dx: 1, dy: -1 }, // up-right
  { dx: 1, dy: 0 }, // right
  { dx: 1, dy: 1 }, // down-right
  { dx: 0, dy: 1 }, // down
  { dx: -1, dy: 1 }, // down-left
  { dx: -1, dy: 0 }, // left
  { dx: -1, dy: -1 }, // up-left
];

interface Node {
  tileId: TileId;
  x: number;
  y: number;
  g: number; // cost from start
  h: number; // heuristic to end
  f: number; // g + h
  parent: Node | null;
}

function heuristic(x1: number, y1: number, x2: number, y2: number): number {
  // Chebyshev distance (optimal for 8-directional movement)
  return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
}

function hasEntityAt(
  chunks: Record<string, Chunk>,
  x: number,
  y: number,
): boolean {
  return getEntityAtTile(chunks, x, y) !== null;
}

function isWalkable(
  chunks: Record<string, Chunk>,
  x: number,
  y: number,
  startTileId: TileId,
  endTileId: TileId,
): boolean {
  const entityId = getEntityAtTile(chunks, x, y);
  if (!entityId) return true; // Empty tiles are walkable

  // Entity tiles are only walkable if they are the start or end
  const tileId = createTileId(x, y);
  return tileId === startTileId || tileId === endTileId;
}

export function findPath(
  chunks: Record<string, Chunk>,
  startTileId: TileId,
  endTileId: TileId,
  maxIterations: number = 500,
): TileId[] | null {
  const start = parseTileId(startTileId);
  const end = parseTileId(endTileId);

  const openSet: Node[] = [];
  const closedSet = new Set<string>();

  const startNode: Node = {
    tileId: startTileId,
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start.x, start.y, end.x, end.y),
    f: heuristic(start.x, start.y, end.x, end.y),
    parent: null,
  };

  openSet.push(startNode);

  let iterations = 0;

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;

    // Find node with lowest f (simple sort - could optimize with heap for large searches)
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift()!;

    if (current.tileId === endTileId) {
      // Reconstruct path
      const path: TileId[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift(node.tileId);
        node = node.parent;
      }
      return path;
    }

    closedSet.add(current.tileId);

    for (const dir of DIRECTIONS) {
      const nx = current.x + dir.dx;
      const ny = current.y + dir.dy;
      const neighborId = createTileId(nx, ny);

      if (closedSet.has(neighborId)) continue;

      // Check if tile is walkable
      if (!isWalkable(chunks, nx, ny, startTileId, endTileId)) {
        continue;
      }

      // For diagonal moves, check we're not cutting a corner
      if (dir.dx !== 0 && dir.dy !== 0) {
        if (
          hasEntityAt(chunks, current.x + dir.dx, current.y) ||
          hasEntityAt(chunks, current.x, current.y + dir.dy)
        ) {
          continue;
        }
      }

      // Diagonal movement costs sqrt(2), cardinal costs 1
      const moveCost = dir.dx !== 0 && dir.dy !== 0 ? 1.414 : 1;
      const g = current.g + moveCost;
      const h = heuristic(nx, ny, end.x, end.y);
      const f = g + h;

      // Check if already in open set with better or equal score
      const existing = openSet.find((n) => n.tileId === neighborId);
      if (existing && existing.f <= f) continue;

      if (existing) {
        existing.g = g;
        existing.h = h;
        existing.f = f;
        existing.parent = current;
      } else {
        openSet.push({
          tileId: neighborId,
          x: nx,
          y: ny,
          g,
          h,
          f,
          parent: current,
        });
      }
    }
  }

  return null; // No path found
}
